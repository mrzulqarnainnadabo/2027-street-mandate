/**
 * What Changed — public timeline from known facts only.
 * Never invent responses, evidence, or resolutions.
 */

export type TimelineEvent = {
  id: string;
  label: string;
  at?: string;
  detail?: string;
  confirmed: boolean;
};

export type PublicMandateFacts = {
  id: string;
  sentence: string;
  state: string;
  lga?: string;
  duty: string;
  office: string;
  created: string;
  /** Always Published when shown on public detail */
  status: "Published";
};

/**
 * Build timeline from public allowlist fields only.
 * Response / evidence stages stay unconfirmed until operator fields are safely public.
 */
export function buildWhatChangedTimeline(m: PublicMandateFacts): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  if (m.created) {
    events.push({
      id: "recorded",
      label: "Record created in civic system",
      at: m.created,
      detail: "Timestamp from the public record system.",
      confirmed: true,
    });
  }

  events.push({
    id: "published",
    label: "Published after human review",
    detail:
      "This demand is public civic data. Publication is not proof of delivery or institutional acceptance.",
    confirmed: true,
  });

  events.push({
    id: "response",
    label: "Response",
    detail:
      "No public response recorded. Absence of a response here does not prove that no institution has acted — only that none is documented on this public record.",
    confirmed: false,
  });

  events.push({
    id: "evidence",
    label: "Evidence",
    detail:
      "No supporting evidence recorded on this public page. Evidence, when added, will be source-backed and human-reviewed.",
    confirmed: false,
  });

  events.push({
    id: "outcome",
    label: "What changed",
    detail:
      "No public outcome is recorded. We only describe change when documented evidence supports it.",
    confirmed: false,
  });

  return events;
}
