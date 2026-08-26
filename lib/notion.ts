import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = (process.env.NOTION_DATABASE_ID || "").replace(/-/g, "");

export type PulseVoice = {
  id: string;
  sentence: string;
  mandate: string;
  state: string;
  created: string;
};

export async function submitVoice(data: {
  sentence: string;
  mandate: string;
  willVote: string;
  state: string;
  ageBand?: string;
  gender?: string;
  deviceId: string;
}) {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error("Notion not configured yet. Share the database with the integration.");
  }

  const properties: any = {
    Name: { title: [{ text: { content: data.sentence.slice(0, 140) } }] },
    "Top Mandate": { select: { name: data.mandate } },
    "Will You Vote": { select: { name: data.willVote } },
    State: { select: { name: data.state } },
    Status: { select: { name: "New" } },
    "Device Fingerprint": { rich_text: [{ text: { content: data.deviceId } }] },
  };

  if (data.ageBand) {
    properties["Age Band"] = { select: { name: data.ageBand } };
  }
  if (data.gender) {
    properties["Gender"] = { select: { name: data.gender } };
  }

  try {
    const page = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties,
    });
    return page.id;
  } catch (err: any) {
    console.error("Notion submit error:", err?.message || err);
    throw new Error(
      "Could not save to Notion. Make sure the database is shared with the Street Mandate integration."
    );
  }
}

export async function getPublishedPulse(): Promise<{
  voices: PulseVoice[];
  tally: Record<string, number>;
  total: number;
  states: number;
}> {
  // Never throw — return empty data so the site still builds and loads
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
      page_size: 40,
    });

    const voices: PulseVoice[] = [];
    const tally: Record<string, number> = {};
    const stateSet = new Set<string>();

    for (const page of response.results as any[]) {
      const props = page.properties;
      const sentence =
        props.Name?.title?.[0]?.plain_text ||
        props.Sentence?.title?.[0]?.plain_text ||
        "";
      const mandate =
        props["Top Mandate"]?.select?.name ||
        props.Mandate?.select?.name ||
        "Other";
      const state = props.State?.select?.name || "";

      if (sentence) {
        voices.push({
          id: page.id,
          sentence,
          mandate,
          state,
          created: page.created_time,
        });
      }
      tally[mandate] = (tally[mandate] || 0) + 1;
      if (state) stateSet.add(state);
    }

    let total = voices.length;
    try {
      const all = await notion.databases.query({
        database_id: DATABASE_ID,
        page_size: 1,
      });
      total = (all as any).has_more ? Math.max(voices.length, 1) : all.results.length;
    } catch {
      // ignore count failure
    }

    return {
      voices,
      tally,
      total,
      states: stateSet.size,
    };
  } catch (err: any) {
    console.error("Pulse error (non-fatal):", err?.message || err);
    return { voices: [], tally: {}, total: 0, states: 0 };
  }
}
