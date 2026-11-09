import { NextRequest, NextResponse } from "next/server";
import { DUTIES, OFFICES, STATES } from "@/lib/constants";
import { checkRateLimit, clientIpFromRequest } from "@/lib/rate-limit";
import { submitBlueprintRecord } from "@/lib/civic-record/submit-blueprint";
import { validateBlueprintDraft } from "@/lib/civic-record/validate-blueprint";
import { assertNotRankingCopy } from "@/lib/civic-record/firewall";
import { readJsonBodyLimited } from "@/lib/server/read-json-body";

const OFFICE_IDS = OFFICES.map((o) => o.id).filter((id) => id !== "Unsure");
const DUTY_IDS = DUTIES.map((d) => d.id);
const STATEMENT_CLASSES = ["ACTOR_STATEMENT", "OFFICIAL_RECORD", "MEDIA_REPORT"] as const;

export async function POST(req: NextRequest) {
  try {
    const parsed = await readJsonBodyLimited(req, 16 * 1024);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const body = parsed.value;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const {
      actorDisplayName,
      officeSought,
      dutyOrPolicyArea,
      proposalText,
      sourceUrlOrCitation,
      mechanism,
      target,
      timeline,
      funding,
      politicalPlatform,
      geographyScope,
      statementClass,
      sourceDate,
      contactEmail,
    } = body as Record<string, unknown>;

    if (typeof actorDisplayName !== "string" || actorDisplayName.trim().length < 2) {
      return NextResponse.json({ error: "Display name is required." }, { status: 400 });
    }
    if (typeof officeSought !== "string" || !OFFICE_IDS.includes(officeSought as (typeof OFFICE_IDS)[number])) {
      return NextResponse.json({ error: "Select a valid office sought." }, { status: 400 });
    }
    if (typeof dutyOrPolicyArea !== "string" || !DUTY_IDS.includes(dutyOrPolicyArea as (typeof DUTY_IDS)[number])) {
      return NextResponse.json({ error: "Select a valid policy area." }, { status: 400 });
    }
    if (typeof proposalText !== "string") {
      return NextResponse.json({ error: "Proposal text is required." }, { status: 400 });
    }
    if (typeof sourceUrlOrCitation !== "string") {
      return NextResponse.json({ error: "Source URL or citation is required." }, { status: 400 });
    }
    if (statementClass !== undefined) {
      if (
        typeof statementClass !== "string" ||
        !STATEMENT_CLASSES.includes(statementClass as (typeof STATEMENT_CLASSES)[number])
      ) {
        return NextResponse.json({ error: "Invalid statement class." }, { status: 400 });
      }
    }
    if (
      geographyScope !== undefined &&
      (typeof geographyScope !== "string" ||
        (geographyScope.trim() !== "Nigeria" &&
          !STATES.includes(geographyScope.trim() as (typeof STATES)[number]) &&
          geographyScope.trim().length > 80))
    ) {
      return NextResponse.json({ error: "Invalid geography scope." }, { status: 400 });
    }
    if (contactEmail !== undefined && typeof contactEmail === "string" && contactEmail.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim()) || contactEmail.length > 120) {
        return NextResponse.json({ error: "Invalid contact email." }, { status: 400 });
      }
    }

    if (!assertNotRankingCopy(proposalText)) {
      return NextResponse.json(
        { error: "Proposal text must not include ranking, scoring, or endorsement language." },
        { status: 400 }
      );
    }

    const draft = {
      actorDisplayName: actorDisplayName.trim(),
      officeSought: officeSought.trim(),
      dutyOrPolicyArea: dutyOrPolicyArea.trim(),
      proposalText: proposalText.trim(),
      sourceUrlOrCitation: sourceUrlOrCitation.trim(),
      mechanism: typeof mechanism === "string" ? mechanism : undefined,
      target: typeof target === "string" ? target : undefined,
      timeline: typeof timeline === "string" ? timeline : undefined,
      funding: typeof funding === "string" ? funding : undefined,
      politicalPlatform: typeof politicalPlatform === "string" ? politicalPlatform : undefined,
    };

    const validation = validateBlueprintDraft(draft);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    const ip = clientIpFromRequest(req);
    const rate = checkRateLimit(`blueprint-submit:${ip}`, 5, 60 * 60 * 1000);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Too many blueprint submissions from this connection. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
      );
    }

    const { id } = await submitBlueprintRecord({
      ...draft,
      geographyScope: typeof geographyScope === "string" ? geographyScope.trim() : "Nigeria",
      statementClass: (statementClass as (typeof STATEMENT_CLASSES)[number]) || "ACTOR_STATEMENT",
      sourceDate: typeof sourceDate === "string" ? sourceDate : undefined,
      contactEmail: typeof contactEmail === "string" ? contactEmail : undefined,
    });

    return NextResponse.json({
      ok: true,
      id,
      status: "New",
      message:
        "Received. This is not publication. ISEYC dual-review is required before any public Blueprint record appears.",
    });
  } catch {
    // Keep upstream provider, database and schema details out of public responses and logs.
    console.error("Blueprint intake failed.");
    return NextResponse.json(
      { error: "Blueprint intake is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
