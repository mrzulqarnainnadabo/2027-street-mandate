"use server";

import {
  performBlueprintReviewMutation,
  type ReviewAction,
} from "@/lib/civic-record/blueprint-review-service";
import {
  getOperatorBlueprint,
  listOperatorBlueprints,
  type OperatorBlueprintRecord,
} from "@/lib/civic-record/operator-blueprint";
import {
  clearOperatorSession,
  establishOperatorSession,
  hasValidOperatorSession,
} from "@/lib/server/operator-session";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number; reasons?: string[]; record?: OperatorBlueprintRecord | null };

async function requireSession(): Promise<ActionResult<true>> {
  if (!(await hasValidOperatorSession())) {
    return { ok: false, error: "Operator authorization required.", status: 401 };
  }
  return { ok: true, data: true };
}

export async function operatorLoginAction(formData: FormData): Promise<ActionResult<{ unlocked: true }>> {
  const key = String(formData.get("operatorKey") || "");
  const result = await establishOperatorSession(key);
  if (!result.ok) {
    return { ok: false, error: result.error, status: 401 };
  }
  return { ok: true, data: { unlocked: true } };
}

export async function operatorLogoutAction(): Promise<ActionResult<{ unlocked: false }>> {
  await clearOperatorSession();
  return { ok: true, data: { unlocked: false } };
}

export async function loadBlueprintQueueAction(): Promise<
  ActionResult<{ records: OperatorBlueprintRecord[]; configured: boolean }>
> {
  const auth = await requireSession();
  if (!auth.ok) return auth;

  const queue = await listOperatorBlueprints();
  if (queue.error && queue.records.length === 0) {
    return { ok: false, error: queue.error, status: 503 };
  }
  return {
    ok: true,
    data: { records: queue.records, configured: queue.configured },
  };
}

export async function refreshBlueprintAction(
  id: string,
): Promise<ActionResult<{ record: OperatorBlueprintRecord | null }>> {
  const auth = await requireSession();
  if (!auth.ok) return auth;
  const record = await getOperatorBlueprint(id);
  return { ok: true, data: { record } };
}

export async function submitBlueprintReviewAction(input: {
  id: string;
  action: ReviewAction;
  reviewer?: string;
  notes?: string;
  decision?: "Approved" | "Rejected";
}): Promise<ActionResult<{ record: OperatorBlueprintRecord | null; action: string }>> {
  const auth = await requireSession();
  if (!auth.ok) return auth;

  const result = await performBlueprintReviewMutation({
    id: input.id,
    action: input.action,
    reviewer: input.reviewer,
    notes: input.notes,
    decision: input.decision,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      status: result.status,
      reasons: result.reasons,
      record: result.record,
    };
  }

  return {
    ok: true,
    data: { record: result.record, action: result.action },
  };
}

export async function sessionStatusAction(): Promise<{ unlocked: boolean }> {
  return { unlocked: await hasValidOperatorSession() };
}
