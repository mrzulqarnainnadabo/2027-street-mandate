import { NextResponse } from "next/server";
import { performBlueprintReviewMutation } from "@/lib/civic-record/blueprint-review-service";
import { isAuthorizedOperatorRequest } from "@/lib/server/operator-auth";
import { readJsonBodyLimited } from "@/lib/server/read-json-body";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthorizedOperatorRequest(request)) {
    return NextResponse.json({ error: "Operator authorization required." }, { status: 401 });
  }

  const parsed = await readJsonBodyLimited(request, 16 * 1024);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const body = parsed.value && typeof parsed.value === "object" && !Array.isArray(parsed.value)
    ? parsed.value as { id?: unknown; action?: unknown; reviewer?: unknown; notes?: unknown; decision?: unknown }
    : null;

  const result = await performBlueprintReviewMutation({
    id: typeof body?.id === "string" ? body.id : "",
    action: body?.action as any,
    reviewer: typeof body?.reviewer === "string" ? body.reviewer : undefined,
    notes: typeof body?.notes === "string" ? body.notes : undefined,
    decision:
      body?.decision === "Approved" || body?.decision === "Rejected"
        ? body.decision
        : undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, reasons: result.reasons, record: result.record },
      { status: result.status },
    );
  }
  return NextResponse.json({
    ok: true,
    action: result.action,
    decision: result.decision,
    record: result.record,
  });
}
