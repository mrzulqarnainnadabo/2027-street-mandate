import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { evaluateBlueprintPublication } from "@/lib/civic-record/blueprint-governance";
import { BLUEPRINT_PILOT_DATABASE_ID } from "@/lib/civic-record/notion-pilot-ids";

export const dynamic = "force-dynamic";

type Action = "review_a" | "review_b" | "publish" | "reject";

function authorized(request: Request): boolean {
  const expected = process.env.CIVIC_OPERATOR_KEY?.trim();
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return Boolean(expected && supplied && supplied === expected);
}

function select(name: string) {
  return { select: { name } };
}
function text(value: string) {
  return { rich_text: [{ type: "text", text: { content: value } }] };
}
function date(value: string) {
  return { date: { start: value } };
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Operator authorization required." }, { status: 401 });
  }
  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json({ error: "Notion is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as
    | { id?: string; action?: Action; reviewer?: string; notes?: string }
    | null;

  if (!body?.id || !body.action) {
    return NextResponse.json({ error: "id and action are required." }, { status: 400 });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pageId = body.id.replace(/-/g, "");

  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId });
    const props: any = page.properties || {};
    const getText = (name: string) => props?.[name]?.rich_text?.[0]?.plain_text?.trim() || "";
    const getSelect = (name: string) => props?.[name]?.select?.name || "";
    const sourceUrl = props?.Source?.url || "";
    const now = new Date().toISOString().slice(0, 10);

    if (body.action === "review_a" || body.action === "review_b") {
      const reviewer = body.reviewer?.trim() || "";
      if (!reviewer) return NextResponse.json({ error: "Reviewer name is required." }, { status: 400 });

      const decision = body.notes?.trim().toLowerCase() === "reject" ? "Rejected" : "Approved";
      const target = body.action === "review_a" ? "A" : "B";

      if (target === "B" && getSelect("Reviewer A Decision") !== "Approved") {
        return NextResponse.json({ error: "Reviewer A must approve before Reviewer B." }, { status: 409 });
      }
      if (target === "B" && reviewer === getText("Reviewer A")) {
        return NextResponse.json({ error: "Reviewer A and Reviewer B must be different reviewers." }, { status: 409 });
      }

      const properties: Record<string, any> = {
        [`Reviewer ${target}`]: text(reviewer),
        [`Reviewer ${target} Decision`]: select(decision),
        [`Reviewer ${target} Date`]: date(now),
      };
      if (body.notes?.trim() && body.notes.trim().toLowerCase() !== "reject") {
        properties["Review Notes"] = text(body.notes.trim());
      }
      await notion.pages.update({ page_id: pageId, properties });
      return NextResponse.json({ ok: true, action: body.action, decision });
    }

    const governance = {
      status: getSelect("Status"),
      verification: getSelect("Verification"),
      sourceUrl,
      reviewerA: getText("Reviewer A"),
      reviewerADecision: getSelect("Reviewer A Decision"),
      reviewerB: getText("Reviewer B"),
      reviewerBDecision: getSelect("Reviewer B Decision"),
      publicationDecision: getSelect("Publication Decision"),
    };

    if (body.action === "publish") {
      const decision = evaluateBlueprintPublication({
        ...governance,
        status: "Published",
        publicationDecision: "Publish",
      });
      if (!decision.publishable) {
        return NextResponse.json({ error: "Publication gate failed.", reasons: decision.reasons }, { status: 409 });
      }
      await notion.pages.update({
        page_id: pageId,
        properties: {
          "Status": select("Published"),
          "Publication Decision": select("Publish"),
          "Publication Date": date(now),
        },
      });
      return NextResponse.json({ ok: true, action: "publish" });
    }

    if (body.action === "reject") {
      await notion.pages.update({
        page_id: pageId,
        properties: {
          "Status": select("Rejected"),
          "Publication Decision": select("Reject"),
          "Publication Date": date(now),
          ...(body.notes?.trim() ? { "Review Notes": text(body.notes.trim()) } : {}),
        },
      });
      return NextResponse.json({ ok: true, action: "reject" });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Blueprint record could not be updated." }, { status: 500 });
  }
}
