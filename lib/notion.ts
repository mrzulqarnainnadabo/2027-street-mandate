import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = (process.env.NOTION_DATABASE_ID || "").replace(/-/g, "");

export type PulseVoice = {
  id: string;
  sentence: string;
  office: string;
  duty: string;
  state: string;
  lga: string;
  created: string;
};

export async function submitVoice(data: {
  sentence: string;
  office: string;
  duty: string;
  state: string;
  lga: string;
  source?: string;
  deviceId: string;
}) {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error("Notion not configured yet. Share the database with the integration.");
  }

  const properties: any = {
    Name: { title: [{ text: { content: data.sentence.slice(0, 180) } }] },
    "One Sentence": { rich_text: [{ text: { content: data.sentence.slice(0, 180) } }] },
    Office: { select: { name: data.office } },
    Duty: { select: { name: data.duty } },
    State: { select: { name: data.state } },
    LGA: { rich_text: [{ text: { content: data.lga } }] },
    Source: { select: { name: data.source || "Direct Link" } },
    Status: { select: { name: "New" } },
    "Device Fingerprint": {
      rich_text: [{ text: { content: data.deviceId.slice(0, 160) } }],
    },
  };

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
  officeTally: Record<string, number>;
  lgaTally: Record<string, number>;
  dutyTally: Record<string, number>;
  total: number;
  states: number;
  lgas: number;
}> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    return {
      voices: [],
      tally: {},
      officeTally: {},
      lgaTally: {},
      dutyTally: {},
      total: 0,
      states: 0,
      lgas: 0,
    };
  }

  try {
    const rows: any[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
          property: "Status",
          select: { equals: "Published" },
        },
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      });

      rows.push(...(response.results as any[]));
      cursor = response.has_more ? response.next_cursor || undefined : undefined;

      if (rows.length >= 1000) break;
    } while (cursor);

    const voices: PulseVoice[] = [];
    const tally: Record<string, number> = {};
    const officeTally: Record<string, number> = {};
    const lgaTally: Record<string, number> = {};
    const dutyTally: Record<string, number> = {};
    const stateSet = new Set<string>();

    for (const page of rows) {
      const props = page.properties;

      const sentence =
        props["One Sentence"]?.rich_text?.[0]?.plain_text ||
        props.Name?.title?.[0]?.plain_text ||
        "";

      const office = props.Office?.select?.name || "";
      const duty = props.Duty?.select?.name || "";
      const state = props.State?.select?.name || "";
      const lga =
        props.LGA?.rich_text?.[0]?.plain_text ||
        props.LGA?.title?.[0]?.plain_text ||
        "";

      if (!sentence) continue;

      voices.push({
        id: page.id,
        sentence,
        office,
        duty,
        state,
        lga,
        created: page.created_time,
      });

      if (duty) tally[duty] = (tally[duty] || 0) + 1;
      if (office) officeTally[office] = (officeTally[office] || 0) + 1;
      if (lga) lgaTally[lga] = (lgaTally[lga] || 0) + 1;
      if (duty) dutyTally[duty] = (dutyTally[duty] || 0) + 1;
      if (state) stateSet.add(state);
    }

    return {
      voices: voices.slice(0, 60),
      tally,
      officeTally,
      lgaTally,
      dutyTally,
      total: voices.length,
      states: stateSet.size,
      lgas: Object.keys(lgaTally).length,
    };
  } catch (err: any) {
    console.error("Pulse error (non-fatal):", err?.message || err);
    return {
      voices: [],
      tally: {},
      officeTally: {},
      lgaTally: {},
      dutyTally: {},
      total: 0,
      states: 0,
      lgas: 0,
    };
  }
}