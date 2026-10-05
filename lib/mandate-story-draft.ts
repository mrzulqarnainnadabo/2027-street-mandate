/**
 * MANDATE_STORY draft — structured from Published record only.
 * AI must not invent quotes, responses, or statistics.
 * Human editorial approval required before any media publication.
 */

import type { MediaContentTypeId } from "@/lib/media-content-types";
import { mediaTypeRequiresHumanApproval } from "@/lib/media-content-types";

export type MandateStoryDraft = {
  contentType: "MANDATE_STORY";
  sourceRecordId: string;
  generatedAt: string;
  requiresHumanApproval: boolean;
  editorialStatus: "draft_pending_human_approval";
  headline: string;
  summary: string;
  whatCitizensRequested: string;
  location: string;
  duty: string;
  office: string;
  currentPublicStatus: string;
  evidenceOrResponse: string;
  sourceReferences: string[];
  unavailable: string[];
};

export function buildMandateStoryDraft(input: {
  id: string;
  sentence: string;
  state: string;
  lga?: string;
  duty: string;
  office: string;
  created: string;
}): MandateStoryDraft {
  const typeId: MediaContentTypeId = "MANDATE_STORY";
  const location = [input.state, input.lga].filter(Boolean).join(" · ") || "Location not publicly specified";
  const unavailable: string[] = [];

  if (!input.office) unavailable.push("Responsible office not publicly specified");
  if (!input.duty) unavailable.push("Duty category not publicly specified");
  unavailable.push("No institutional response is published on this record yet");
  unavailable.push("No public evidence attachment is listed on this record yet");

  const headline = input.duty
    ? `Published civic demand · ${input.duty}${input.state ? ` · ${input.state}` : ""}`
    : `Published civic demand${input.state ? ` · ${input.state}` : ""}`;

  const summary = [
    "ISEYC published a citizen delivery demand after human review.",
    "This is not a poll, ranking, or endorsement.",
    input.state ? `Geography: ${location}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    contentType: "MANDATE_STORY",
    sourceRecordId: input.id.replace(/-/g, ""),
    generatedAt: new Date().toISOString(),
    requiresHumanApproval: mediaTypeRequiresHumanApproval(typeId),
    editorialStatus: "draft_pending_human_approval",
    headline,
    summary,
    whatCitizensRequested: input.sentence,
    location,
    duty: input.duty || "Not publicly specified",
    office: input.office || "Not publicly specified",
    currentPublicStatus: "Published (human-reviewed civic record)",
    evidenceOrResponse:
      "Unavailable on the public record at draft time — do not invent a response.",
    sourceReferences: [
      `Published mandate id: ${input.id.replace(/-/g, "")}`,
      input.created ? `Record created: ${input.created}` : "",
    ].filter(Boolean),
    unavailable,
  };
}
