import { Client } from "@notionhq/client";
import { normalizeDuty } from "@/lib/constants";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = (process.env.NOTION_DATABASE_ID || "").replace(/-/g, "");

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

export async function getPublishedPulse(): Promise<{
  voices: PulseVoice[];
  tally: Record<string, number>;
  total: number;
  states: number;
}> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    return { voices: [], tally: {}, total: 0, states: 0 };
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 50,
    });

    const voices: PulseVoice[] = [];
    const tally: Record<string, number> = {};
    const stateSet = new Set<string>();

    for (const page of response.results as any[]) {
      const v = mapPageToVoice(page);
      if (!v) continue;
      voices.push(v);
      tally[v.duty] = (tally[v.duty] || 0) + 1;
      if (v.state) stateSet.add(v.state);
    }

    let total = voices.length;
    try {
      const all = await notion.databases.query({
        database_id: DATABASE_ID,
        page_size: 1,
      });
      total = (all as any).has_more ? Math.max(voices.length, 1) : all.results.length;
    } catch {
      /* ignore */
    }

    return { voices, tally, total, states: stateSet.size };
  } catch (err: any) {
    console.error("Pulse error (non-fatal):", err?.message || err);
    return { voices: [], tally: {}, total: 0, states: 0 };
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
