import { NextResponse } from "next/server";
import { performBlueprintReviewMutation } from "@/lib/civic-record/blueprint-review-service";
import { isAuthorizedOperatorRequest } from "@/lib/server/operator-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthorizedOperatorRequest(request)) {
    return NextResponse.json({ error: "Operator authorization required." }, { status: 401 });
  }

  let body: {
    id?: unknown;
    action?: unknown;
    reviewer?: unknown;
    notes?: unknown;
    decision?: unknown;
  } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

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
