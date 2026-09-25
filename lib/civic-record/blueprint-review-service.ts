import { Client } from "@notionhq/client";
import {
  canOperatorPublishFromStatus,
  evaluateBlueprintPublication,
} from "./blueprint-governance";
import { assertBlueprintPageOwnership, notionPageId } from "./blueprint-ownership";
import { getOperatorBlueprint, type OperatorBlueprintRecord } from "./operator-blueprint";
import {
  institutionalConflictMessage,
  resolveReviewDecision,
  validateHoldNotes,
  validateRejectionNotes,
  validateReviewerANotSameAsB,
  validateReviewerBPrerequisites,
  validateReviewerIdentity,
} from "./blueprint-review-rules";

export type ReviewAction = "review_a" | "review_b" | "publish" | "reject";

export type ReviewMutationInput = {
  id: string;
  action: ReviewAction;
  reviewer?: string;
  notes?: string;
  decision?: "Approved" | "Rejected";
};

export type ReviewMutationResult =
  | { ok: true; action: ReviewAction; decision?: string; record: OperatorBlueprintRecord | null }
  | { ok: false; status: number; error: string; reasons?: string[]; record: OperatorBlueprintRecord | null };

function select(name: string) {
  return { select: { name } };
}
function text(value: string) {
  return { rich_text: [{ type: "text", text: { content: value.slice(0, 2000) } }] };
}
function date(value: string) {
  return { date: { start: value } };
}

/** Server-authoritative Blueprint review mutation. Call only after operator auth. */
export async function performBlueprintReviewMutation(
  input: ReviewMutationInput,
): Promise<ReviewMutationResult> {
  if (!process.env.NOTION_TOKEN) {
    return { ok: false, status: 503, error: "Notion is not configured.", record: null };
  }

  const allowed: ReviewAction[] = ["review_a", "review_b", "publish", "reject"];
  if (!allowed.includes(input.action)) {
    return { ok: false, status: 400, error: "Unsupported action.", record: null };
  }

  const id = input.id?.trim();
  if (!id) {
    return { ok: false, status: 400, error: "id is required.", record: null };
  }

  const notes = (input.notes || "").trim().slice(0, 2000);
  const reviewer = (input.reviewer || "").trim().slice(0, 120);
  const pageId = notionPageId(id);
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId });
    const ownership = assertBlueprintPageOwnership(page);
    if (!ownership.ok) {
      return { ok: false, status: 403, error: ownership.error, record: null };
    }

    const props: any = page.properties || {};
    const getText = (name: string) => props?.[name]?.rich_text?.[0]?.plain_text?.trim() || "";
    const getSelect = (name: string) => props?.[name]?.select?.name || "";
    const sourceUrl = typeof props?.Source?.url === "string" ? props.Source.url : "";
    const now = new Date().toISOString().slice(0, 10);
    const statusNow = getSelect("Status");

    if (input.action === "review_a" || input.action === "review_b") {
      const identity = validateReviewerIdentity(reviewer);
      if (!identity.ok) {
        return {
          ok: false,
          status: identity.status,
          error: identity.error,
          record: await getOperatorBlueprint(id),
        };
      }

      const decision = resolveReviewDecision(input.decision, notes);
      const rejectionNotes = validateRejectionNotes(decision, notes);
      if (!rejectionNotes.ok) {
        return {
          ok: false,
          status: rejectionNotes.status,
          error: rejectionNotes.error,
          record: await getOperatorBlueprint(id),
        };
      }

      const target = input.action === "review_a" ? "A" : "B";

      if (target === "B") {
        const bGate = validateReviewerBPrerequisites({
          reviewerA: getText("Reviewer A"),
          reviewerADecision: getSelect("Reviewer A Decision"),
          reviewerBCandidate: reviewer,
        });
        if (!bGate.ok) {
          return {
            ok: false,
            status: bGate.status,
            error: bGate.error,
            record: await getOperatorBlueprint(id),
          };
        }
      }
      if (target === "A") {
        const aGate = validateReviewerANotSameAsB({
          reviewerACandidate: reviewer,
          reviewerB: getText("Reviewer B"),
        });
        if (!aGate.ok) {
          return {
            ok: false,
            status: aGate.status,
            error: aGate.error,
            record: await getOperatorBlueprint(id),
          };
        }
      }

      const properties: Record<string, any> = {
        [`Reviewer ${target}`]: text(reviewer),
        [`Reviewer ${target} Decision`]: select(decision),
        [`Reviewer ${target} Date`]: date(now),
      };
      if (notes) properties["Review Notes"] = text(notes);
      if (decision === "Rejected") {
        properties["Publication Decision"] = select("Reject");
      }

      await notion.pages.update({ page_id: pageId, properties: properties as any });
      return {
        ok: true,
        action: input.action,
        decision,
        record: await getOperatorBlueprint(id),
      };
    }

    const governance = {
      status: statusNow,
      verification: getSelect("Verification"),
      sourceUrl,
      reviewerA: getText("Reviewer A"),
      reviewerADecision: getSelect("Reviewer A Decision"),
      reviewerB: getText("Reviewer B"),
      reviewerBDecision: getSelect("Reviewer B Decision"),
      publicationDecision: getSelect("Publication Decision"),
    };

    if (input.action === "publish") {
      if (!canOperatorPublishFromStatus(statusNow)) {
        return {
          ok: false,
          status: 409,
          error: "Cannot publish from Rejected or Flagged status. Reopen the record first.",
          record: await getOperatorBlueprint(id),
        };
      }
      const decision = evaluateBlueprintPublication({
        ...governance,
        status: "Published",
        publicationDecision: "Publish",
      });
      if (!decision.publishable) {
        return {
          ok: false,
          status: 409,
          error: institutionalConflictMessage(),
          reasons: decision.reasons,
          record: await getOperatorBlueprint(id),
        };
      }
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Status: select("Published"),
          "Publication Decision": select("Publish"),
          "Publication Date": date(now),
        } as any,
      });
      return { ok: true, action: "publish", record: await getOperatorBlueprint(id) };
    }

    if (input.action === "reject") {
      const hold = validateHoldNotes(notes);
      if (!hold.ok) {
        return {
          ok: false,
          status: hold.status,
          error: hold.error,
          record: await getOperatorBlueprint(id),
        };
      }
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Status: select("Rejected"),
          "Publication Decision": select("Reject"),
          "Publication Date": date(now),
          "Review Notes": text(notes),
        } as any,
      });
      return { ok: true, action: "reject", record: await getOperatorBlueprint(id) };
    }

    return { ok: false, status: 400, error: "Unsupported action.", record: null };
  } catch (err: any) {
    const status = Number(err?.status || err?.code || 0);
    if (status === 404) {
      return { ok: false, status: 404, error: "Blueprint record not found.", record: null };
    }
    if (status === 401 || status === 403) {
      return { ok: false, status: 502, error: "Notion access denied.", record: null };
    }
    if (status === 429) {
      return {
        ok: false,
        status: 503,
        error: "Notion rate limited. Try again shortly.",
        record: await getOperatorBlueprint(id).catch(() => null),
      };
    }
    console.error("Blueprint review mutation failed:", status || "unknown");
    return {
      ok: false,
      status: 500,
      error: "Blueprint record could not be updated.",
      record: null,
    };
  }
}
