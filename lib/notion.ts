import { Client } from "@notionhq/client";
import { normalizeDuty } from "@/lib/constants";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = (process.env.NOTION_DATABASE_ID || "").replace(/-/g, "");

/** Soft cap so a runaway DB cannot blow the serverless timeout */
const MAX_PUBLISHED_PAGES = 10;
const PAGE_SIZE = 50;

export type PulseVoice = {
  id: string;
  sentence: string;
  mandate: string;
  duty: string;
  office: string;
  state: string;
  lga: string;
  created: string;
};

export type MandateStatus = {
  id: string;
  sentence: string;
  duty: string;
  office: string;
  state: string;
  lga: string;
  status: string;
  created: string;
};

function extractFromFingerprint(
  rich: any[] | undefined,
  key: "office" | "lga"
): string {
  const text = rich?.[0]?.plain_text || "";
  const re = key === "office" ? /office:([^|]+)/ : /lga:([^|]+)/;
  const m = text.match(re);
  return (m?.[1] || "").trim();
}

function mapPageToVoice(page: any): PulseVoice | null {
  const props = page.properties;
  const sentence =
    props.Name?.title?.[0]?.plain_text ||
    props.Sentence?.title?.[0]?.plain_text ||
    "";
  if (!sentence) return null;

  const rawMandate =
    props["Top Mandate"]?.select?.name ||
    props.Duty?.select?.name ||
    props.Mandate?.select?.name ||
    "Other";
  const duty = normalizeDuty(rawMandate);
  const office =
    props.Office?.select?.name ||
    extractFromFingerprint(props["Device Fingerprint"]?.rich_text, "office") ||
    "";
  const lga =
    props.LGA?.rich_text?.[0]?.plain_text ||
    extractFromFingerprint(props["Device Fingerprint"]?.rich_text, "lga") ||
    "";
  const state = props.State?.select?.name || "";

  return {
    id: page.id.replace(/-/g, ""),
    sentence,
    mandate: duty,
    duty,
    office,
    state,
    lga,
    created: page.created_time,
  };
}

/** Notion page ids may be with or without dashes */
function notionPageId(id: string): string {
  const clean = id.replace(/-/g, "");
  if (clean.length !== 32) return id;
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
}

export async function submitVoice(data: {
  sentence: string;
  duty: string;
  office: string;
  state: string;
  lga?: string;
  ageBand?: string;
  gender?: string;
  deviceId: string;
}) {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error("Notion not configured yet. Share the database with the integration.");
  }

  const meta = `${data.deviceId} | office:${data.office} | lga:${data.lga || ""}`;

  const core: Record<string, unknown> = {
    Name: { title: [{ text: { content: data.sentence.slice(0, 200) } }] },
    "Top Mandate": { select: { name: data.duty } },
    State: { select: { name: data.state } },
    Status: { select: { name: "New" } },
    "Device Fingerprint": { rich_text: [{ text: { content: meta.slice(0, 2000) } }] },
  };

  if (data.ageBand) {
    core["Age Band"] = { select: { name: data.ageBand } };
  }
  if (data.gender) {
    core["Gender"] = { select: { name: data.gender } };
  }

  const full = {
    ...core,
    Duty: { select: { name: data.duty } },
    Office: { select: { name: data.office } },
    ...(data.lga?.trim()
      ? { LGA: { rich_text: [{ text: { content: data.lga.trim().slice(0, 120) } }] } }
      : {}),
  };

  try {
    const page = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: full as any,
    });
    return page.id;
  } catch (err: any) {
    console.error("Notion full submit failed, trying core:", String(err?.body || err?.message || err));
    try {
      const page = await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: core as any,
      });
      return page.id;
    } catch (err2: any) {
      console.error("Notion submit error:", err2?.message || err2);
      throw new Error(
        "Could not save to Notion. Make sure the database is shared with the Street Mandate integration."
      );
    }
  }
}

/**
 * Load Published mandates only.
 * Paginate until exhausted or soft cap.
 * `total` is always the number of Published pages successfully loaded (honest).
 * `truncated` is true if Notion still has more Published rows beyond the soft cap.
 */
export async function getPublishedPulse(): Promise<{
  voices: PulseVoice[];
  tally: Record<string, number>;
  total: number;
  states: number;
  truncated: boolean;
}> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error("Civic Pulse is not configured: missing Notion environment variables.");
  }

  try {
    const voices: PulseVoice[] = [];
    const tally: Record<string, number> = {};
    const stateSet = new Set<string>();
    let cursor: string | undefined;
    let truncated = false;

    for (let page = 0; page < MAX_PUBLISHED_PAGES; page++) {
      const response: any = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
          property: "Status",
          select: { equals: "Published" },
        },
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        page_size: PAGE_SIZE,
        ...(cursor ? { start_cursor: cursor } : {}),
      });

      for (const result of response.results as any[]) {
        const v = mapPageToVoice(result);
        if (!v) continue;
        voices.push(v);
        tally[v.duty] = (tally[v.duty] || 0) + 1;
        if (v.state) stateSet.add(v.state);
      }

      if (!response.has_more) {
        truncated = false;
        break;
      }
      cursor = response.next_cursor || undefined;
      if (!cursor) break;
      if (page === MAX_PUBLISHED_PAGES - 1) {
        truncated = true;
      }
    }

    return {
      voices,
      tally,
      total: voices.length,
      states: stateSet.size,
      truncated,
    };
  } catch (err: any) {
    console.error("Pulse error (fatal for public data):", err?.message || err);
    throw new Error("Civic Pulse could not load published records.");
  }
}

/** Only returns a mandate if Status is Published */
export async function getPublishedMandate(id: string): Promise<PulseVoice | null> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) return null;

  try {
    const page = (await notion.pages.retrieve({
      page_id: notionPageId(id),
    })) as any;

    if (page.object !== "page" || page.archived) return null;

    const status = page.properties?.Status?.select?.name;
    if (status !== "Published") return null;

    return mapPageToVoice(page);
  } catch (err: any) {
    console.error("getPublishedMandate:", err?.message || err);
    return null;
  }
}

/** Read a submission's moderation status without exposing demographic or fingerprint fields. */
export async function getMandateStatus(id: string): Promise<MandateStatus | null> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error("Civic status is not configured: missing Notion environment variables.");
  }

  try {
    const page = (await notion.pages.retrieve({
      page_id: notionPageId(id),
    })) as any;

    if (page.object !== "page" || page.archived) return null;

    const mapped = mapPageToVoice(page);
    if (!mapped) return null;

    return {
      ...mapped,
      status: page.properties?.Status?.select?.name || "New",
    };
  } catch (err: any) {
    console.error("getMandateStatus:", err?.message || err);
    const status = Number(err?.status || err?.body?.status || 0);
    const code = err?.code || err?.body?.code;
    if (status === 400 || status === 404 || code === "object_not_found") {
      return null;
    }
    throw new Error("Civic status could not load right now.");
  }
}
