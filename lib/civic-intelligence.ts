/**
 * Civic Intelligence — aggregation over Published Civic Mandate records only.
 *
 * FOUNDATIONAL RULE:
 * This module describes what published records show.
 * It does NOT claim to represent national public opinion.
 *
 * Allowed:  "Among N published records from S states…"
 * Forbidden: claims that the public has collectively decided a top national issue
 *
 * Inputs must already be public-allowlist voices (PulseVoice shape).
 * Never accept operator-only fields.
 */

import type { PulseVoice } from "@/lib/notion";

export const CIVIC_INTELLIGENCE_VERSION = "1.0.0";

export type DutyCount = {
  duty: string;
  count: number;
  shareOfPublished: number; // 0–1, among published records only
};

export type StateCount = {
  state: string;
  count: number;
  shareOfPublished: number;
};

export type OfficeCount = {
  office: string;
  count: number;
  shareOfPublished: number;
};

export type LgaCount = {
  state: string;
  lga: string;
  count: number;
};

export type CivicIntelligenceSnapshot = {
  version: string;
  generatedAt: string;
  /** Exact number of published records in this snapshot */
  publishedCount: number;
  /** Distinct states with ≥1 published record */
  statesRepresented: number;
  /** Distinct LGA labels with ≥1 published record */
  lgasRepresented: number;
  /** Distinct duty labels */
  dutiesRepresented: number;
  /** Earliest created_time among included records (ISO) or null */
  periodStart: string | null;
  /** Latest created_time among included records (ISO) or null */
  periodEnd: string | null;
  /** Whether the underlying fetch reported truncation */
  truncated: boolean;
  duties: DutyCount[];
  states: StateCount[];
  offices: OfficeCount[];
  /** Top LGAs by count (capped) */
  topLgas: LgaCount[];
  methodology: string[];
  limitations: string[];
  /** One-sentence framing for UI / media drafts */
  framingLine: string;
};

function share(n: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((n / total) * 1000) / 1000;
}

function sortByCountDesc<T extends { count: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => b.count - a.count || 0);
}

/**
 * Build a Civic Intelligence snapshot from published public voices.
 * Pure function — no I/O, no Notion, no invention of records.
 */
export function buildCivicIntelligence(
  voices: PulseVoice[],
  opts?: { truncated?: boolean; generatedAt?: string }
): CivicIntelligenceSnapshot {
  const truncated = Boolean(opts?.truncated);
  const generatedAt = opts?.generatedAt || new Date().toISOString();
  const publishedCount = voices.length;

  const dutyMap = new Map<string, number>();
  const stateMap = new Map<string, number>();
  const officeMap = new Map<string, number>();
  const lgaMap = new Map<string, { state: string; lga: string; count: number }>();
  let periodStart: string | null = null;
  let periodEnd: string | null = null;

  for (const v of voices) {
    const duty = (v.duty || v.mandate || "Other").trim() || "Other";
    dutyMap.set(duty, (dutyMap.get(duty) || 0) + 1);

    const state = (v.state || "").trim();
    if (state) stateMap.set(state, (stateMap.get(state) || 0) + 1);

    const office = (v.office || "").trim() || "Office not specified";
    officeMap.set(office, (officeMap.get(office) || 0) + 1);

    const lga = (v.lga || "").trim();
    if (state && lga) {
      const key = `${state}::${lga}`;
      const existing = lgaMap.get(key);
      if (existing) existing.count += 1;
      else lgaMap.set(key, { state, lga, count: 1 });
    }

    if (v.created) {
      if (!periodStart || v.created < periodStart) periodStart = v.created;
      if (!periodEnd || v.created > periodEnd) periodEnd = v.created;
    }
  }

  const duties = sortByCountDesc(
    Array.from(dutyMap.entries()).map(([duty, count]) => ({
      duty,
      count,
      shareOfPublished: share(count, publishedCount),
    }))
  );

  const states = sortByCountDesc(
    Array.from(stateMap.entries()).map(([state, count]) => ({
      state,
      count,
      shareOfPublished: share(count, publishedCount),
    }))
  );

  const offices = sortByCountDesc(
    Array.from(officeMap.entries()).map(([office, count]) => ({
      office,
      count,
      shareOfPublished: share(count, publishedCount),
    }))
  );

  const topLgas = sortByCountDesc(Array.from(lgaMap.values())).slice(0, 20);
  const lgasRepresentedFull = lgaMap.size;
  const statesRepresented = states.length;

  const methodology = [
    "Only records with Status = Published after human ISEYC review are included.",
    "Counts describe published Civic Mandate records, not votes or popularity.",
    "Duty and office labels come from the citizen submission as moderated; they are not legal determinations.",
    "Geographic fields (state, LGA) are as provided by the submitter and may be incomplete.",
    `Snapshot version ${CIVIC_INTELLIGENCE_VERSION}.`,
  ];

  const limitations: string[] = [
    "This is not a statistically representative survey of all Nigerians.",
    "Submission volume reflects who used the instrument and what passed review — not the size of the underlying need.",
    "Uneven geographic coverage is expected in a pilot; absence of a state does not mean absence of need.",
    "Office responsibility is a citizen/ISEYC classification for navigation, not a court finding.",
  ];

  if (truncated) {
    limitations.push(
      "The underlying fetch reported truncation: additional published records may exist beyond this snapshot."
    );
  }

  if (publishedCount === 0) {
    limitations.push(
      "Zero published records: the public civic memory is empty until human review publishes demands."
    );
  }

  let framingLine: string;
  if (publishedCount === 0) {
    framingLine =
      "No published Civic Mandate records are available in this snapshot. An empty public record is not a ranking and not a system failure.";
  } else if (statesRepresented === 0) {
    framingLine = `Among ${publishedCount} published Civic Mandate record${publishedCount === 1 ? "" : "s"}, state geography was not specified on the public fields.`;
  } else {
    const top = duties[0];
    const topBit = top
      ? ` The most frequently recorded duty among these published records is ${top.duty} (${top.count}).`
      : "";
    framingLine = `Among ${publishedCount} published Civic Mandate record${publishedCount === 1 ? "" : "s"} from ${statesRepresented} state${statesRepresented === 1 ? "" : "s"}, these are the duties and places that appear in the public record.${topBit} This describes published records only — not national public opinion.`;
  }

  return {
    version: CIVIC_INTELLIGENCE_VERSION,
    generatedAt,
    publishedCount,
    statesRepresented,
    lgasRepresented: lgasRepresentedFull,
    dutiesRepresented: duties.length,
    periodStart,
    periodEnd,
    truncated,
    duties,
    states,
    offices,
    topLgas,
    methodology,
    limitations,
    framingLine,
  };
}

/**
 * Short plain-text brief suitable for operators / media draft (human approval still required).
 */
export function formatIntelligencePlain(snap: CivicIntelligenceSnapshot): string {
  const lines: string[] = [];
  lines.push("Civic Mandate Nigeria — Civic Intelligence snapshot");
  lines.push(`Generated: ${snap.generatedAt}`);
  lines.push("");
  lines.push(snap.framingLine);
  lines.push("");
  lines.push(`Published records: ${snap.publishedCount}`);
  lines.push(`States represented: ${snap.statesRepresented}`);
  lines.push(`LGAs with labels: ${snap.lgasRepresented}`);
  if (snap.periodStart || snap.periodEnd) {
    lines.push(
      `Period (record created_time): ${snap.periodStart || "—"} → ${snap.periodEnd || "—"}`
    );
  }
  if (snap.truncated) lines.push("Note: snapshot may be truncated.");
  lines.push("");
  if (snap.duties.length) {
    lines.push("Duties by frequency (published records):");
    for (const d of snap.duties.slice(0, 12)) {
      lines.push(`  ${d.duty}: ${d.count}`);
    }
    lines.push("");
  }
  if (snap.states.length) {
    lines.push("States by frequency (published records):");
    for (const s of snap.states.slice(0, 15)) {
      lines.push(`  ${s.state}: ${s.count}`);
    }
    lines.push("");
  }
  lines.push("Methodology:");
  for (const m of snap.methodology) lines.push(`  • ${m}`);
  lines.push("");
  lines.push("Limitations:");
  for (const L of snap.limitations) lines.push(`  • ${L}`);
  lines.push("");
  lines.push("— ISEYC · Civic Mandate Nigeria · Non-partisan · Published records only");
  return lines.join("\n");
}
