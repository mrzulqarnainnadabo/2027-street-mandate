/**
 * CommunityRecord v0.1 — public published community intelligence unit.
 * Aligns with Observatory contracts/shared/community-record.v0.1.schema.json
 * Source data: Published-only pulse mapping (never unpublished Notion pages).
 */
import type { PulseVoice } from "@/lib/notion";
import { PUBLIC_VOICE_KEYS } from "@/lib/public-voice";

export const COMMUNITY_RECORD_CONTRACT_VERSION = "0.1.0" as const;

export type VerificationStatus =
  | "unverified"
  | "partially-verified"
  | "independently-verified"
  | "unknown";

export type FollowUpStatus =
  | "none"
  | "under-review"
  | "response-documented"
  | "outcome-unknown"
  | "unknown";

/** Public CommunityRecord — allowlisted fields only. */
export type CommunityRecordV01 = {
  id: string;
  contractVersion: typeof COMMUNITY_RECORD_CONTRACT_VERSION;
  publicationStatus: "published";
  verificationStatus: VerificationStatus;
  text: string;
  sector: string | null;
  duty: string | null;
  issueCategory: string | null;
  state: string | null;
  lga: string | null;
  ward: string | null;
  facilityRef: string | null;
  officeLabel: string | null;
  reportedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  evidenceRefIds: string[];
  followUpStatus: FollowUpStatus;
  relatedSuggestedIds: string[];
};

/** Fields that must never appear on the public CommunityRecord surface. */
export const COMMUNITY_RECORD_PRIVATE_DENYLIST = [
  "Device Fingerprint",
  "Age Band",
  "Gender",
  "email",
  "phone",
  "contact",
  "Responsible Institution",
  "Response Requested",
  "Response Received",
  "Follow-up Date",
  "Resolution Status",
  "Response Evidence",
  "deviceId",
  "fingerprint",
] as const;

/**
 * Map a published pulse voice to CommunityRecord.
 * Missing structured fields → null / empty / unverified — never invented.
 */
export function pulseVoiceToCommunityRecord(v: PulseVoice): CommunityRecordV01 {
  const text = (v.sentence || "").trim();
  const duty = emptyToNull(v.duty);
  const state = emptyToNull(v.state);
  const lga = emptyToNull(v.lga);
  const office = emptyToNull(v.office);
  return {
    id: String(v.id),
    contractVersion: COMMUNITY_RECORD_CONTRACT_VERSION,
    publicationStatus: "published",
    verificationStatus: "unverified",
    text,
    sector: null,
    duty,
    issueCategory: null,
    state,
    lga,
    ward: null,
    facilityRef: null,
    officeLabel: office,
    reportedAt: null,
    publishedAt: null,
    createdAt: v.created || "",
    evidenceRefIds: [],
    followUpStatus: "none",
    relatedSuggestedIds: [],
  };
}

function emptyToNull(s: string | undefined | null): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t.length ? t : null;
}

export type CommunityRecordsQuery = {
  page?: number;
  pageSize?: number;
  state?: string;
  lga?: string;
  duty?: string;
  sector?: string;
  since?: string;
  until?: string;
};

export type CommunityRecordsResponse = {
  contractVersion: typeof COMMUNITY_RECORD_CONTRACT_VERSION;
  publicationBoundary: "published-only";
  verificationNote: string;
  prevalenceNote: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  truncatedUpstream: boolean;
  filters: Record<string, string | null>;
  records: CommunityRecordV01[];
};

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export function buildCommunityRecordsResponse(
  voices: PulseVoice[],
  query: CommunityRecordsQuery,
  upstream: { total: number; truncated: boolean },
): CommunityRecordsResponse {
  let records = voices.map(pulseVoiceToCommunityRecord).filter((r) => r.text.length > 0);

  const state = query.state?.trim().toLowerCase() || null;
  const lga = query.lga?.trim().toLowerCase() || null;
  const duty = query.duty?.trim().toLowerCase() || null;
  const sector = query.sector?.trim().toLowerCase() || null;
  const since = query.since?.trim() || null;
  const until = query.until?.trim() || null;

  if (state) {
    records = records.filter((r) => (r.state || "").toLowerCase() === state);
  }
  if (lga) {
    records = records.filter((r) => (r.lga || "").toLowerCase() === lga);
  }
  if (duty) {
    records = records.filter((r) => (r.duty || "").toLowerCase() === duty);
  }
  if (sector) {
    records = records.filter((r) => (r.sector || "").toLowerCase() === sector);
  }
  if (since) {
    records = records.filter((r) => r.createdAt && r.createdAt >= since);
  }
  if (until) {
    records = records.filter((r) => r.createdAt && r.createdAt <= until);
  }

  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(query.pageSize) || DEFAULT_PAGE_SIZE),
  );
  const page = Math.max(1, Number(query.page) || 1);
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = records.slice(start, start + pageSize);

  return {
    contractVersion: COMMUNITY_RECORD_CONTRACT_VERSION,
    publicationBoundary: "published-only",
    verificationNote:
      "verificationStatus defaults to unverified. Publication after human review is not independent verification of the underlying claim.",
    prevalenceNote:
      "Counts and lists describe published Civic Mandate records only. They are not a measure of national need or public opinion.",
    page: safePage,
    pageSize,
    total,
    totalPages,
    truncatedUpstream: Boolean(upstream.truncated),
    filters: {
      state,
      lga,
      duty,
      sector,
      since,
      until,
    },
    records: slice,
  };
}

/** Assert object keys stay within CommunityRecord allowlist (runtime guard for tests). */
export function assertNoPrivateKeys(record: Record<string, unknown>): void {
  const keys = Object.keys(record);
  for (const blocked of COMMUNITY_RECORD_PRIVATE_DENYLIST) {
    for (const k of keys) {
      if (k.toLowerCase().includes(blocked.toLowerCase().replace(/\s+/g, ""))) {
        throw new Error(`Private key leaked: ${k}`);
      }
    }
  }
  void PUBLIC_VOICE_KEYS;
}
