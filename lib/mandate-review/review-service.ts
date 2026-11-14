/**
 * In-memory / test-friendly mandate review service.
 * Does not write to production Notion unless a persistence adapter is injected.
 * AI actor can draft but cannot publish.
 */

import {
  publicationGate,
  transition,
  type ReviewStatus,
} from "./lifecycle";
import type {
  AuditEntry,
  EvidenceAttachment,
  MandateReviewRecord,
  SpecialistRecommendation,
} from "./types";
import { toPublicMandateView } from "./types";

export type ReviewStore = {
  get(id: string): MandateReviewRecord | null;
  save(record: MandateReviewRecord): void;
  list(filter?: { status?: ReviewStatus }): MandateReviewRecord[];
};

export function createMemoryStore(seed: MandateReviewRecord[] = []): ReviewStore {
  const map = new Map<string, MandateReviewRecord>();
  for (const r of seed) map.set(r.id, structuredClone(r));
  return {
    get(id) {
      const r = map.get(id);
      return r ? structuredClone(r) : null;
    },
    save(record) {
      map.set(record.id, structuredClone(record));
    },
    list(filter) {
      const all = [...map.values()].map((r) => structuredClone(r));
      if (filter?.status) return all.filter((r) => r.status === filter.status);
      return all;
    },
  };
}

function audit(record: MandateReviewRecord, entry: AuditEntry): MandateReviewRecord {
  return { ...record, audit: [...record.audit, entry] };
}

export type MutationResult =
  | { ok: true; record: MandateReviewRecord }
  | { ok: false; status: number; error: string; reasons?: string[]; record: MandateReviewRecord | null };

export function applyStatusChange(
  store: ReviewStore,
  input: { id: string; toStatus: ReviewStatus; actor: "human" | "ai" | "system"; note?: string },
): MutationResult {
  const current = store.get(input.id);
  if (!current) return { ok: false, status: 404, error: "Record not found.", record: null };

  if (input.actor === "ai" && (input.toStatus === "published" || input.toStatus === "rejected")) {
    return {
      ok: false,
      status: 403,
      error: "AI cannot approve, reject, or publish mandates.",
      record: current,
    };
  }

  const t = transition(current.status, input.toStatus);
  if (!t.ok) {
    return { ok: false, status: 409, error: t.error, record: current };
  }

  let next: MandateReviewRecord = { ...current, status: input.toStatus };
  next = audit(next, {
    at: new Date().toISOString(),
    actor: input.actor,
    action: "status_change",
    fromStatus: current.status,
    toStatus: input.toStatus,
    note: input.note,
  });
  store.save(next);
  return { ok: true, record: next };
}

export function attachEvidence(
  store: ReviewStore,
  input: { id: string; evidence: EvidenceAttachment; actor: "human" | "ai" | "system" },
): MutationResult {
  const current = store.get(input.id);
  if (!current) return { ok: false, status: 404, error: "Record not found.", record: null };
  if (current.status === "published" || current.status === "rejected" || current.status === "withdrawn") {
    return {
      ok: false,
      status: 409,
      error: "Cannot attach evidence in terminal or published state without reopen protocol.",
      record: current,
    };
  }
  let next: MandateReviewRecord = {
    ...current,
    evidence: [...current.evidence, input.evidence],
  };
  next = audit(next, {
    at: new Date().toISOString(),
    actor: input.actor,
    action: "attach_evidence",
    note: input.evidence.id,
  });
  store.save(next);
  return { ok: true, record: next };
}

export function addSpecialistRecommendation(
  store: ReviewStore,
  input: { id: string; recommendation: SpecialistRecommendation; actor: "human" | "system" },
): MutationResult {
  const current = store.get(input.id);
  if (!current) return { ok: false, status: 404, error: "Record not found.", record: null };
  let next: MandateReviewRecord = {
    ...current,
    specialistRecommendations: [...current.specialistRecommendations, input.recommendation],
  };
  next = audit(next, {
    at: new Date().toISOString(),
    actor: input.actor,
    action: "specialist_recommendation",
    note: `${input.recommendation.department}: ${input.recommendation.advisorLabel}`,
  });
  store.save(next);
  return { ok: true, record: next };
}

export function setDraftMandate(
  store: ReviewStore,
  input: {
    id: string;
    draftMandateText: string;
    responsibleInstitution: string;
    evidenceLimitations?: string[];
    actor: "human" | "ai";
  },
): MutationResult {
  const current = store.get(input.id);
  if (!current) return { ok: false, status: 404, error: "Record not found.", record: null };
  if (current.status === "published" || current.status === "rejected") {
    return { ok: false, status: 409, error: "Cannot edit draft after publication or rejection.", record: current };
  }
  let next: MandateReviewRecord = {
    ...current,
    draftMandateText: input.draftMandateText.trim(),
    responsibleInstitution: input.responsibleInstitution.trim(),
    evidenceLimitations: input.evidenceLimitations ?? current.evidenceLimitations,
  };
  next = audit(next, {
    at: new Date().toISOString(),
    actor: input.actor,
    action: "set_draft_mandate",
    note: input.actor === "ai" ? "AI-assisted draft — not a publication decision." : undefined,
  });
  store.save(next);
  return { ok: true, record: next };
}

export function humanPublicationDecision(
  store: ReviewStore,
  input: {
    id: string;
    decision: "approve" | "reject";
    actor: "human" | "ai" | "system";
    rejectionReason?: string;
  },
): MutationResult {
  const current = store.get(input.id);
  if (!current) return { ok: false, status: 404, error: "Record not found.", record: null };

  const gate = publicationGate({
    status: current.status,
    humanDecision: input.decision,
    actor: input.actor,
    hasResponsibleInstitution: Boolean(current.responsibleInstitution?.trim()),
    hasDraftMandateText: Boolean(current.draftMandateText?.trim()),
    hasEvidenceOrExplicitLimitation:
      current.evidence.length > 0 || current.evidenceLimitations.length > 0,
  });

  if (!gate.allowed) {
    return {
      ok: false,
      status: 403,
      error: "Publication gate failed.",
      reasons: gate.reasons,
      record: current,
    };
  }

  if (input.decision === "reject") {
    const reason = (input.rejectionReason || "").trim();
    if (reason.length < 8) {
      return {
        ok: false,
        status: 400,
        error: "Rejection requires an internal reason (at least 8 characters).",
        record: current,
      };
    }
    let next: MandateReviewRecord = {
      ...current,
      status: "rejected",
      humanPublicationDecision: "reject",
      internalNotes: [...current.internalNotes, reason],
    };
    next = audit(next, {
      at: new Date().toISOString(),
      actor: "human",
      action: "reject_publication",
      fromStatus: current.status,
      toStatus: "rejected",
      note: reason,
    });
    store.save(next);
    return { ok: true, record: next };
  }

  let next: MandateReviewRecord = {
    ...current,
    status: "published",
    humanPublicationDecision: "approve",
  };
  next = audit(next, {
    at: new Date().toISOString(),
    actor: "human",
    action: "approve_publication",
    fromStatus: current.status,
    toStatus: "published",
  });
  store.save(next);
  return { ok: true, record: next };
}

export function publicView(store: ReviewStore, id: string) {
  const r = store.get(id);
  if (!r) return null;
  return toPublicMandateView(r);
}

export function operatorSafeRecord(
  r: MandateReviewRecord,
): Omit<MandateReviewRecord, "contributorPrivate"> {
  const { contributorPrivate: _private, ...rest } = r;
  return rest;
}
