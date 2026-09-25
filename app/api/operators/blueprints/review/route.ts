import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import {
  canOperatorPublishFromStatus,
  evaluateBlueprintPublication,
} from "@/lib/civic-record/blueprint-governance";
import {
  assertBlueprintPageOwnership,
  notionPageId,
} from "@/lib/civic-record/blueprint-ownership";
import { isAuthorizedOperatorRequest } from "@/lib/server/operator-auth";

export const dynamic = "force-dynamic";

type Action = "review_a" | "review_b" | "publish" | "reject";

const ALLOWED_ACTIONS = new Set<Action>(["review_a", "review_b", "publish", "reject"]);

function select(name: string) {
  return { select: { name } };
}
function text(value: string) {
  return { rich_text: [{ type: "text", text: { content: value.slice(0, 2000) } }] };
}
function date(value: string) {
  return { date: { start: value } };
}

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function POST(request: Request) {
  if (!isAuthorizedOperatorRequest(request)) {
    return jsonError("Operator authorization required.", 401);
  }
  if (!process.env.NOTION_TOKEN) {
    return jsonError("Notion is not configured.", 503);
  }

  let body: {
    id?: unknown;
    action?: unknown;
    reviewer?: unknown;
    notes?: unknown;
  } | null = null;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (typeof body?.id !== "string" || !body.id.trim()) {
    return jsonError("id is required.", 400);
  }
  if (typeof body?.action !== "string" || !ALLOWED_ACTIONS.has(body.action as Action)) {
    return jsonError("Unsupported action.", 400);
  }
  const action = body.action as Action;
  const notes =
    typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) : "";
  const reviewer =
    typeof body.reviewer === "string" ? body.reviewer.trim().slice(0, 120) : "";

  const pageId = notionPageId(body.id.trim());
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId });
    const ownership = assertBlueprintPageOwnership(page);
    if (!ownership.ok) {
      return jsonError(ownership.error, 403);
    }

    const props: any = page.properties || {};
    const getText = (name: string) => props?.[name]?.rich_text?.[0]?.plain_text?.trim() || "";
    const getSelect = (name: string) => props?.[name]?.select?.name || "";
    const sourceUrl = typeof props?.Source?.url === "string" ? props.Source.url : "";
    const now = new Date().toISOString().slice(0, 10);
    const statusNow = getSelect("Status");

    if (action === "review_a" || action === "review_b") {
      if (!reviewer) {
        return jsonError("Reviewer name is required.", 400);
      }

      const decision = notes.toLowerCase() === "reject" ? "Rejected" : "Approved";
      const target = action === "review_a" ? "A" : "B";

      if (target === "B" && getSelect("Reviewer A Decision") !== "Approved") {
        return jsonError("Reviewer A must approve before Reviewer B.", 409);
      }
      if (target === "B" && reviewer.toLowerCase() === getText("Reviewer A").toLowerCase()) {
        return jsonError("Reviewer A and Reviewer B must be different reviewers.", 409);
      }
      if (target === "A" && getText("Reviewer B") && reviewer.toLowerCase() === getText("Reviewer B").toLowerCase()) {
        return jsonError("Reviewer A and Reviewer B must be different reviewers.", 409);
      }

      const properties: Record<string, any> = {
        [`Reviewer ${target}`]: text(reviewer),
        [`Reviewer ${target} Decision`]: select(decision),
        [`Reviewer ${target} Date`]: date(now),
      };
      if (notes && notes.toLowerCase() !== "reject") {
        properties["Review Notes"] = text(notes);
      }
      if (decision === "Rejected") {
        properties["Publication Decision"] = select("Reject");
      }

      await notion.pages.update({ page_id: pageId, properties: properties as any });
      return NextResponse.json({ ok: true, action, decision });
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

    if (action === "publish") {
      if (!canOperatorPublishFromStatus(statusNow)) {
        return jsonError(
          "Cannot publish from Rejected or Flagged status. Reopen the record first.",
          409,
        );
      }

      const decision = evaluateBlueprintPublication({
        ...governance,
        status: "Published",
        publicationDecision: "Publish",
      });
      if (!decision.publishable) {
        return jsonError("Publication gate failed.", 409, { reasons: decision.reasons });
      }

      await notion.pages.update({
        page_id: pageId,
        properties: {
          Status: select("Published"),
          "Publication Decision": select("Publish"),
          "Publication Date": date(now),
        } as any,
      });
      return NextResponse.json({ ok: true, action: "publish" });
    }

    if (action === "reject") {
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Status: select("Rejected"),
          "Publication Decision": select("Reject"),
          "Publication Date": date(now),
          ...(notes ? { "Review Notes": text(notes) } : {}),
        } as any,
      });
      return NextResponse.json({ ok: true, action: "reject" });
    }

    return jsonError("Unsupported action.", 400);
  } catch (err: any) {
    const status = Number(err?.status || err?.code || 0);
    if (status === 404) {
      return jsonError("Blueprint record not found.", 404);
    }
    if (status === 401 || status === 403) {
      return jsonError("Notion access denied.", 502);
    }
    if (status === 429) {
      return jsonError("Notion rate limited. Try again shortly.", 503);
    }
    console.error("Blueprint review mutation failed:", status || "unknown");
    return jsonError("Blueprint record could not be updated.", 500);
  }
}
