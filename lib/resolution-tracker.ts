/**
 * Civic demand resolution tracker — public-facing stage model.
 *
 * Rules:
 * - Never invent responses, referrals, acknowledgements, or resolutions.
 * - Published ≠ referred ≠ acknowledged ≠ resolved.
 * - Only stages backed by public allowlist facts are "confirmed".
 * - Not a scorecard, ranking, or performance league table.
 */

export type ResolutionStageId =
  | "published"
  | "response"
  | "evidence"
  | "outcome";

export type ResolutionStage = {
  id: ResolutionStageId;
  label: string;
  shortLabel: string;
  /** true only when the public record supports this stage */
  confirmed: boolean;
  detail: string;
  at?: string;
};

export type ResolutionPublicFacts = {
  id: string;
  sentence: string;
  state: string;
  lga?: string;
  duty: string;
  office: string;
  created: string;
  /** Public surfaces only show Published mandates */
  status: "Published";
  /**
   * Optional future public fields — only use when allowlisted and human-reviewed.
   * Until then leave undefined so stages stay unconfirmed.
   */
  responseSummary?: string;
  responseAt?: string;
  evidenceSummary?: string;
  evidenceAt?: string;
  outcomeSummary?: string;
  outcomeAt?: string;
  /** Explicit human-reviewed resolution flag on public record — rare */
  resolvedOnPublicRecord?: boolean;
};

export type ResolutionSnapshot = {
  stages: ResolutionStage[];
  /** Highest confirmed stage id */
  furthestConfirmed: ResolutionStageId;
  /** Plain-language status for lists */
  statusLabel: string;
  disclaimer: string;
};

export function buildResolutionSnapshot(m: ResolutionPublicFacts): ResolutionSnapshot {
  const stages: ResolutionStage[] = [
    {
      id: "published",
      label: "Published on the public record",
      shortLabel: "Published",
      confirmed: true,
      at: m.created,
      detail:
        "Human-reviewed and Published. This is a civic record of the demand — not proof that any office has acted.",
    },
    {
      id: "response",
      label: "Institutional response on record",
      shortLabel: "Response",
      confirmed: Boolean(m.responseSummary?.trim()),
      at: m.responseAt,
      detail: m.responseSummary?.trim()
        ? m.responseSummary.trim()
        : "No public response is recorded. Silence here does not prove inaction elsewhere — only that nothing is documented on this record.",
    },
    {
      id: "evidence",
      label: "Supporting evidence on record",
      shortLabel: "Evidence",
      confirmed: Boolean(m.evidenceSummary?.trim()),
      at: m.evidenceAt,
      detail: m.evidenceSummary?.trim()
        ? m.evidenceSummary.trim()
        : "No supporting evidence is recorded on this public page. When added, evidence must be source-backed and human-reviewed.",
    },
    {
      id: "outcome",
      label: "Documented outcome",
      shortLabel: "Outcome",
      confirmed: Boolean(m.resolvedOnPublicRecord && m.outcomeSummary?.trim()),
      at: m.outcomeAt,
      detail:
        m.resolvedOnPublicRecord && m.outcomeSummary?.trim()
          ? m.outcomeSummary.trim()
          : "No public outcome is recorded. We only mark change when documented evidence supports it — never by AI inference alone.",
    },
  ];

  const confirmed = stages.filter((s) => s.confirmed);
  const furthestConfirmed = (confirmed[confirmed.length - 1]?.id || "published") as ResolutionStageId;

  let statusLabel = "Published · outcome not on public record";
  if (furthestConfirmed === "outcome") statusLabel = "Outcome documented on public record";
  else if (furthestConfirmed === "evidence") statusLabel = "Evidence on record · outcome open";
  else if (furthestConfirmed === "response") statusLabel = "Response on record · outcome open";

  return {
    stages,
    furthestConfirmed,
    statusLabel,
    disclaimer:
      "Resolution tracker uses only published, human-reviewed fields. It is not a government performance score and does not mean a referral was sent.",
  };
}
