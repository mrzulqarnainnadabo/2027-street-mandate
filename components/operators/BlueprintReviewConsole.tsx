"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { OperatorBlueprintRecord } from "@/lib/civic-record/operator-blueprint";
import { NOT_PUBLICLY_SPECIFIED } from "@/lib/civic-record/types";
import {
  loadBlueprintQueueAction,
  operatorLoginAction,
  operatorLogoutAction,
  refreshBlueprintAction,
  sessionStatusAction,
  submitBlueprintReviewAction,
} from "@/app/operators/blueprint-review/actions";

function Mark({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`text-xs ${ok ? "text-forest-800" : "text-forest-500"}`}>
      <span className="font-mono">{ok ? "✓" : "·"}</span> {label}
    </li>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-forest-500">{label}</p>
      <p className="mt-0.5 break-words text-sm text-forest-900">{value || NOT_PUBLICLY_SPECIFIED}</p>
    </div>
  );
}

export default function BlueprintReviewConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [records, setRecords] = useState<OperatorBlueprintRecord[]>([]);
  const [configured, setConfigured] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reviewerAName, setReviewerAName] = useState("");
  const [reviewerBName, setReviewerBName] = useState("");
  const [notesA, setNotesA] = useState("");
  const [notesB, setNotesB] = useState("");
  const [notesReject, setNotesReject] = useState("");

  const clearFlash = () => {
    setMessage(null);
    setError(null);
  };

  const applyRecord = useCallback((record: OperatorBlueprintRecord | null | undefined) => {
    if (!record) return;
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id);
      if (idx < 0) return [record, ...prev];
      const next = [...prev];
      next[idx] = record;
      return next;
    });
  }, []);

  const reloadQueue = useCallback(() => {
    startTransition(async () => {
      clearFlash();
      const res = await loadBlueprintQueueAction();
      if (!res.ok) {
        setError(res.error);
        if (res.status === 401) setUnlocked(false);
        return;
      }
      setRecords(res.data.records);
      setConfigured(res.data.configured);
    });
  }, []);

  useEffect(() => {
    startTransition(async () => {
      const s = await sessionStatusAction();
      setUnlocked(s.unlocked);
      if (s.unlocked) {
        const res = await loadBlueprintQueueAction();
        if (res.ok) {
          setRecords(res.data.records);
          setConfigured(res.data.configured);
        } else if (res.status === 401) setUnlocked(false);
        else setError(res.error);
      }
    });
  }, []);

  function onLogin(formData: FormData) {
    startTransition(async () => {
      clearFlash();
      const res = await operatorLoginAction(formData);
      if (!res.ok) {
        setError(res.error);
        setUnlocked(false);
        return;
      }
      setUnlocked(true);
      setMessage("Operator session established (httpOnly cookie).");
      const queue = await loadBlueprintQueueAction();
      if (queue.ok) {
        setRecords(queue.data.records);
        setConfigured(queue.data.configured);
      } else setError(queue.error);
    });
  }

  function onLogout() {
    startTransition(async () => {
      await operatorLogoutAction();
      setUnlocked(false);
      setRecords([]);
      setMessage("Operator session cleared.");
    });
  }

  function runMutation(
    id: string,
    payload: {
      action: "review_a" | "review_b" | "publish" | "reject";
      reviewer?: string;
      notes?: string;
      decision?: "Approved" | "Rejected";
    },
  ) {
    startTransition(async () => {
      clearFlash();
      setActiveId(id);
      const res = await submitBlueprintReviewAction({ id, ...payload });
      if (!res.ok) {
        setError(res.reasons?.length ? `${res.error} ${res.reasons.join(" ")}` : res.error);
        if (res.record) applyRecord(res.record);
        else {
          const refreshed = await refreshBlueprintAction(id);
          if (refreshed.ok && refreshed.data.record) applyRecord(refreshed.data.record);
        }
        if (res.status === 401) setUnlocked(false);
        setActiveId(null);
        return;
      }
      if (res.data.record) applyRecord(res.data.record);
      else {
        const refreshed = await refreshBlueprintAction(id);
        if (refreshed.ok && refreshed.data.record) applyRecord(refreshed.data.record);
      }
      setMessage(`Action "${res.data.action}" recorded. Showing authoritative server state.`);
      setActiveId(null);
      if (payload.action === "review_a") setNotesA("");
      if (payload.action === "review_b") setNotesB("");
      if (payload.action === "reject") setNotesReject("");
    });
  }

  if (!unlocked) {
    return (
      <section className="mt-8 rounded-xl border border-forest-500/15 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-forest-900">Operator access</h2>
        <p className="mt-2 text-xs leading-relaxed text-forest-600">
          Enter the server-side operator key. It is checked only on the server and stored as an
          httpOnly session cookie — never as a public env var, never persisted in browser storage APIs.
        </p>
        <form action={onLogin} className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-forest-800">
            Operator key
            <input
              type="password"
              name="operatorKey"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-forest-500/20 bg-cream/40 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-forest-800 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {pending ? "Checking…" : "Unlock review console"}
          </button>
        </form>
        {error ? <p className="mt-3 text-xs text-red-800">{error}</p> : null}
        {message ? <p className="mt-3 text-xs text-forest-700">{message}</p> : null}
      </section>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-forest-600">
          Session active. Shared operator key is interim; reviewer names are recorded per action.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={reloadQueue} disabled={pending}
            className="rounded-lg border border-forest-500/20 px-3 py-2 text-xs font-semibold text-forest-800">
            Refresh queue
          </button>
          <button type="button" onClick={onLogout}
            className="rounded-lg border border-forest-500/20 px-3 py-2 text-xs font-semibold text-forest-800">
            End session
          </button>
        </div>
      </div>
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">{error}</p> : null}
      {message ? <p className="rounded-lg border border-forest-500/15 bg-cream/80 px-3 py-2 text-xs text-forest-800">{message}</p> : null}
      {!configured ? <p className="text-sm text-forest-700">Notion is not configured on this server.</p> : null}
      {records.length === 0 ? (
        <p className="rounded-xl border border-forest-500/15 bg-white p-5 text-sm text-forest-700">
          No Blueprint pilot rows loaded. Add draft rows in Notion, then refresh.
        </p>
      ) : null}
      {records.map((r) => (
        <article key={r.id} className="rounded-xl border border-forest-500/15 bg-white p-4 shadow-sm sm:p-5">
          <header className="border-b border-forest-500/10 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600">Status · {r.status}</p>
            <h2 className="mt-1 font-display text-lg font-bold text-forest-900">{r.name}</h2>
            <p className="text-sm text-forest-700">{r.actorDisplayName} · {r.officeSought} · {r.dutyOrPolicyArea}</p>
          </header>
          <section className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Proposal" value={r.proposalText} />
            <Field label="Mechanism" value={r.mechanism} />
            <Field label="Target" value={r.target} />
            <Field label="Timeline" value={r.timeline} />
            <Field label="Funding" value={r.funding} />
            <Field label="Responsible institution" value={r.responsibleInstitution} />
          </section>
          <section className="mt-4 rounded-lg border border-forest-500/10 bg-cream/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-forest-500">Provenance</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Field label="Source date" value={r.sourceDate} />
              <Field label="Statement class" value={r.statementClass} />
              <Field label="Verification" value={r.verification} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-forest-500">Source</p>
                {r.sourceUrl ? (
                  <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="mt-0.5 block break-all text-sm font-semibold text-forest-800 underline">{r.sourceUrl}</a>
                ) : (
                  <p className="text-sm text-forest-900">{NOT_PUBLICLY_SPECIFIED}</p>
                )}
              </div>
            </div>
          </section>
          <section className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-forest-500/10 p-3">
              <p className="text-[10px] font-bold uppercase text-forest-500">Reviewer A</p>
              <p className="text-sm text-forest-900">{r.reviewerA}</p>
              <p className="text-xs text-forest-600">{r.reviewerADecision} · {r.reviewerADate}</p>
            </div>
            <div className="rounded-lg border border-forest-500/10 p-3">
              <p className="text-[10px] font-bold uppercase text-forest-500">Reviewer B</p>
              <p className="text-sm text-forest-900">{r.reviewerB}</p>
              <p className="text-xs text-forest-600">{r.reviewerBDecision} · {r.reviewerBDate}</p>
            </div>
            <div className="rounded-lg border border-forest-500/10 p-3 sm:col-span-2">
              <p className="text-[10px] font-bold uppercase text-forest-500">Publication</p>
              <p className="text-sm text-forest-900">Decision: {r.publicationDecision} · Date: {r.publicationDate}</p>
            </div>
          </section>
          <ul className="mt-3 space-y-1 rounded-lg bg-cream/40 p-3">
            <Mark ok={r.readiness.sourcePresent} label="Source present" />
            <Mark ok={r.readiness.verificationAcceptable} label="Verification acceptable" />
            <Mark ok={r.readiness.reviewerAApproved} label="Reviewer A approved" />
            <Mark ok={r.readiness.reviewerBApproved} label="Reviewer B approved" />
            <Mark ok={r.readiness.reviewersDifferent} label="Reviewers different" />
            <Mark ok={r.readiness.statusAllowsPublish} label="Status allows publish action" />
            <Mark ok={r.readiness.publishable} label="Server publish gate would pass" />
          </ul>
          <div className="mt-4 space-y-4 border-t border-forest-500/10 pt-4">
            <div>
              <h3 className="text-sm font-bold text-forest-900">Reviewer A</h3>
              <div className="mt-2 space-y-2">
                <input value={reviewerAName} onChange={(e) => setReviewerAName(e.target.value)} placeholder="Reviewer identity" className="w-full rounded-lg border border-forest-500/20 px-3 py-2.5 text-sm" />
                <textarea value={notesA} onChange={(e) => setNotesA(e.target.value)} placeholder="Internal notes (required if rejecting)" rows={2} className="w-full rounded-lg border border-forest-500/20 px-3 py-2 text-sm" />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" disabled={pending} onClick={() => runMutation(r.id, { action: "review_a", reviewer: reviewerAName, notes: notesA, decision: "Approved" })} className="flex-1 rounded-lg bg-forest-800 py-3 text-sm font-bold text-white disabled:opacity-60">{pending && activeId === r.id ? "Working…" : "Approve Review A"}</button>
                  <button type="button" disabled={pending} onClick={() => runMutation(r.id, { action: "review_a", reviewer: reviewerAName, notes: notesA, decision: "Rejected" })} className="flex-1 rounded-lg border border-forest-500/30 py-3 text-sm font-bold text-forest-900 disabled:opacity-60">Reject / Flag (A)</button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-forest-900">Reviewer B</h3>
              <p className="mt-1 text-[11px] text-forest-600">Reviewer B cannot act until Reviewer A has approved. Must be a different person.</p>
              <div className="mt-2 space-y-2">
                <input value={reviewerBName} onChange={(e) => setReviewerBName(e.target.value)} placeholder="Reviewer identity" className="w-full rounded-lg border border-forest-500/20 px-3 py-2.5 text-sm" />
                <textarea value={notesB} onChange={(e) => setNotesB(e.target.value)} placeholder="Internal notes (required if rejecting)" rows={2} className="w-full rounded-lg border border-forest-500/20 px-3 py-2 text-sm" />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" disabled={pending || r.reviewerADecision !== "Approved"} onClick={() => runMutation(r.id, { action: "review_b", reviewer: reviewerBName, notes: notesB, decision: "Approved" })} className="flex-1 rounded-lg bg-forest-800 py-3 text-sm font-bold text-white disabled:opacity-60">Approve Review B</button>
                  <button type="button" disabled={pending || r.reviewerADecision !== "Approved"} onClick={() => runMutation(r.id, { action: "review_b", reviewer: reviewerBName, notes: notesB, decision: "Rejected" })} className="flex-1 rounded-lg border border-forest-500/30 py-3 text-sm font-bold text-forest-900 disabled:opacity-60">Reject / Flag (B)</button>
                </div>
              </div>
            </div>
            <button type="button" disabled={pending || !r.readiness.publishable} onClick={() => runMutation(r.id, { action: "publish" })} className="w-full rounded-lg bg-gold-600 py-3 text-sm font-bold text-forest-950 disabled:opacity-50">Publish (server re-checks full gate)</button>
            <div>
              <textarea value={notesReject} onChange={(e) => setNotesReject(e.target.value)} placeholder="Internal hold/rejection reason (required)" rows={2} className="w-full rounded-lg border border-forest-500/20 px-3 py-2 text-sm" />
              <button type="button" disabled={pending} onClick={() => runMutation(r.id, { action: "reject", notes: notesReject })} className="mt-2 w-full rounded-lg border border-red-300 py-3 text-sm font-bold text-red-900 disabled:opacity-60">Hold / Reject record</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
