import { NextResponse } from "next/server";
import { isAuthorizedOperatorRequest } from "@/lib/server/operator-auth";
import { readJsonBodyLimited } from "@/lib/server/read-json-body";
import {
  applyStatusChange,
  attachEvidence,
  addSpecialistRecommendation,
  createMemoryStore,
  humanPublicationDecision,
  operatorSafeRecord,
  setDraftMandate,
  type ReviewStore,
  createFixtureReviewRecord,
  FIXTURE_MANDATE_REVIEW_ID,
  type ReviewStatus,
} from "@/lib/mandate-review";

export const dynamic = "force-dynamic";

const globalStore = globalThis as unknown as { __mandateReviewStore?: ReviewStore };
function getStore(): ReviewStore {
  if (!globalStore.__mandateReviewStore) {
    globalStore.__mandateReviewStore = createMemoryStore([createFixtureReviewRecord()]);
  }
  return globalStore.__mandateReviewStore;
}

export async function POST(request: Request) {
  if (!isAuthorizedOperatorRequest(request)) {
    return NextResponse.json({ error: "Operator authorization required." }, { status: 401 });
  }

  const parsed = await readJsonBodyLimited(request, 32 * 1024);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const body =
    parsed.value && typeof parsed.value === "object" && !Array.isArray(parsed.value)
      ? (parsed.value as Record<string, unknown>)
      : null;

  const id = typeof body?.id === "string" ? body.id.trim() : "";
  const action = typeof body?.action === "string" ? body.action : "";
  const actorRaw = body?.actor === "ai" ? "ai" : body?.actor === "system" ? "system" : "human";

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  if (id !== FIXTURE_MANDATE_REVIEW_ID && process.env.MANDATE_REVIEW_ALLOW_NON_FIXTURE !== "1") {
    return NextResponse.json(
      {
        error:
          "This review API is bound to the labelled test fixture until Notion persistence is approved.",
      },
      { status: 403 },
    );
  }

  const store = getStore();

  if (action === "transition") {
    const toStatus = body?.toStatus as ReviewStatus;
    const result = applyStatusChange(store, {
      id,
      toStatus,
      actor: actorRaw,
      note: typeof body?.note === "string" ? body.note : undefined,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, reasons: result.reasons, record: result.record ? operatorSafeRecord(result.record) : null },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true, record: operatorSafeRecord(result.record) });
  }

  if (action === "attach_evidence") {
    const evidence = body?.evidence as Record<string, unknown> | undefined;
    if (!evidence || typeof evidence !== "object") {
      return NextResponse.json({ error: "evidence object is required." }, { status: 400 });
    }
    const result = attachEvidence(store, {
      id,
      actor: actorRaw === "ai" ? "ai" : actorRaw === "system" ? "system" : "human",
      evidence: {
        id: String(evidence.id || ""),
        label: String(evidence.label || ""),
        sourceType: (evidence.sourceType as "primary" | "publisher_supported" | "secondary" | "community_reported") || "secondary",
        url: typeof evidence.url === "string" ? evidence.url : undefined,
        geography: typeof evidence.geography === "string" ? evidence.geography : undefined,
        reportingPeriod: typeof evidence.reportingPeriod === "string" ? evidence.reportingPeriod : undefined,
        limitations: Array.isArray(evidence.limitations) ? evidence.limitations.map(String) : [],
        relevanceNote: typeof evidence.relevanceNote === "string" ? evidence.relevanceNote : undefined,
      },
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error, record: result.record ? operatorSafeRecord(result.record) : null }, { status: result.status });
    }
    return NextResponse.json({ ok: true, record: operatorSafeRecord(result.record) });
  }

  if (action === "specialist_recommendation") {
    const rec = body?.recommendation as Record<string, unknown> | undefined;
    if (!rec || typeof rec !== "object") {
      return NextResponse.json({ error: "recommendation object is required." }, { status: 400 });
    }
    const result = addSpecialistRecommendation(store, {
      id,
      actor: "human",
      recommendation: {
        department: rec.department as "civic" | "education" | "health" | "software-technology",
        advisorLabel: String(rec.advisorLabel || "Specialist advisor"),
        recommendation: String(rec.recommendation || ""),
        at: new Date().toISOString(),
      },
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error, record: result.record ? operatorSafeRecord(result.record) : null }, { status: result.status });
    }
    return NextResponse.json({ ok: true, record: operatorSafeRecord(result.record) });
  }

  if (action === "set_draft") {
    const result = setDraftMandate(store, {
      id,
      draftMandateText: String(body?.draftMandateText || ""),
      responsibleInstitution: String(body?.responsibleInstitution || ""),
      evidenceLimitations: Array.isArray(body?.evidenceLimitations)
        ? body.evidenceLimitations.map(String)
        : undefined,
      actor: actorRaw === "ai" ? "ai" : "human",
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error, record: result.record ? operatorSafeRecord(result.record) : null }, { status: result.status });
    }
    return NextResponse.json({ ok: true, record: operatorSafeRecord(result.record) });
  }

  if (action === "publication_decision") {
    const decision = body?.decision === "reject" ? "reject" : body?.decision === "approve" ? "approve" : null;
    if (!decision) {
      return NextResponse.json({ error: "decision must be approve or reject." }, { status: 400 });
    }
    const result = humanPublicationDecision(store, {
      id,
      decision,
      actor: actorRaw,
      rejectionReason: typeof body?.rejectionReason === "string" ? body.rejectionReason : undefined,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, reasons: result.reasons, record: result.record ? operatorSafeRecord(result.record) : null },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true, record: operatorSafeRecord(result.record) });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}

export async function GET(request: Request) {
  if (!isAuthorizedOperatorRequest(request)) {
    return NextResponse.json({ error: "Operator authorization required." }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || FIXTURE_MANDATE_REVIEW_ID;
  const store = getStore();
  const record = store.get(id);
  if (!record) {
    return NextResponse.json({ error: "Record not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, record: operatorSafeRecord(record) });
}
