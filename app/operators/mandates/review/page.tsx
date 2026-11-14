"use client";

import { useCallback, useState } from "react";

type ReviewRecord = {
  id: string;
  fixture?: boolean;
  submissionText: string;
  state: string;
  lga?: string;
  duty: string;
  office: string;
  submittedAt: string;
  status: string;
  evidence: { id: string; label: string; sourceType: string; limitations: string[] }[];
  evidenceLimitations: string[];
  specialistRecommendations: {
    department: string;
    advisorLabel: string;
    recommendation: string;
  }[];
  draftMandateText?: string;
  responsibleInstitution?: string;
  audit: { at: string; actor: string; action: string; note?: string }[];
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  clarification_required: "Clarification required",
  under_review: "Under review",
  evidence_review: "Evidence review",
  awaiting_publication_decision: "Awaiting publication decision",
  published: "Published",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export default function MandateReviewWorkspacePage() {
  const [key, setKey] = useState("");
  const [record, setRecord] = useState<ReviewRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [institution, setInstitution] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const headers = useCallback(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (key.trim()) h.Authorization = `Bearer ${key.trim()}`;
    return h;
  }, [key]);

  async function load() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/operators/mandates/review", { headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Load failed");
      setRecord(data.record);
      setDraftText(data.record.draftMandateText || "");
      setInstitution(data.record.responsibleInstitution || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setBusy(false);
    }
  }

  async function act(body: Record<string, unknown>) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/operators/mandates/review", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const reasons = Array.isArray(data.reasons) ? data.reasons.join(" ") : "";
        throw new Error([data.error, reasons].filter(Boolean).join(" — "));
      }
      setRecord(data.record);
      setDraftText(data.record.draftMandateText || "");
      setInstitution(data.record.responsibleInstitution || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const status = record?.status || "—";

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <header className="mb-8 border-b border-stone-200 pb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Civic Mandate · Operator review
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Review workspace</h1>
          <p className="mt-2 text-sm text-stone-600">
            Submission → evidence → specialist advice → human publication decision. AI may draft;
            only a human can publish.
          </p>
        </header>

        <section className="mb-6 rounded-lg border border-stone-200 bg-white p-4">
          <label className="block text-xs font-medium text-stone-500">Operator key</label>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row">
            <input
              type="password"
              autoComplete="off"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              placeholder="Bearer token (not stored)"
            />
            <button
              type="button"
              onClick={load}
              disabled={busy}
              className="rounded bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Load fixture
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {record && (
          <div className="space-y-4">
            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium">
                  {STATUS_LABEL[status] || status}
                </span>
                {record.fixture && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                    TEST FIXTURE
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-base font-semibold leading-snug">{record.submissionText}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-stone-500">State</dt>
                  <dd>{record.state}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500">LGA</dt>
                  <dd>{record.lga || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500">Duty</dt>
                  <dd>{record.duty}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500">Office</dt>
                  <dd>{record.office}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold">Evidence</h3>
              {record.evidence.length === 0 ? (
                <p className="mt-1 text-sm text-stone-500">None attached.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-sm">
                  {record.evidence.map((e) => (
                    <li key={e.id} className="rounded border border-stone-100 px-3 py-2">
                      <span className="font-medium">{e.label}</span>
                      <span className="ml-2 text-xs text-stone-500">{e.sourceType}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                disabled={busy}
                className="mt-3 text-sm font-medium underline"
                onClick={() =>
                  act({
                    id: record.id,
                    action: "attach_evidence",
                    evidence: {
                      id: "ev-fixture-phc-info",
                      label: "Publisher-supported PHC public materials",
                      sourceType: "publisher_supported",
                      limitations: [
                        "Does not prove facility-level functionality.",
                        "Programme counts are not service availability.",
                      ],
                    },
                  })
                }
              >
                Attach sample evidence
              </button>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold">Draft public mandate</h3>
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                placeholder="Clear, specific, non-partisan demand"
              />
              <input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                placeholder="Responsible institution"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  className="rounded bg-stone-800 px-3 py-1.5 text-sm text-white"
                  onClick={() =>
                    act({
                      id: record.id,
                      action: "set_draft",
                      draftMandateText: draftText,
                      responsibleInstitution: institution,
                      evidenceLimitations: [
                        "Community report is not proof of facility failure.",
                      ],
                      actor: "human",
                    })
                  }
                >
                  Save draft
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="rounded border border-stone-300 px-3 py-1.5 text-sm"
                  onClick={() =>
                    act({
                      id: record.id,
                      action: "set_draft",
                      draftMandateText:
                        draftText ||
                        "Publish clear information on which primary healthcare services are available at public facilities in Jos North during stated clinic hours.",
                      responsibleInstitution:
                        institution || "Plateau State Primary Health Care Development Agency",
                      evidenceLimitations: [
                        "Does not assert that any named facility is non-functional.",
                      ],
                      actor: "ai",
                    })
                  }
                >
                  AI-assisted draft (cannot publish)
                </button>
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold">Workflow</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  ["under_review", "Under review"],
                  ["evidence_review", "Evidence review"],
                  ["awaiting_publication_decision", "Ready for decision"],
                ].map(([to, label]) => (
                  <button
                    key={to}
                    type="button"
                    disabled={busy}
                    className="rounded border border-stone-300 px-3 py-1.5 text-sm"
                    onClick={() =>
                      act({ id: record.id, action: "transition", toStatus: to, actor: "human" })
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-stone-100 pt-4 sm:flex-row">
                <button
                  type="button"
                  disabled={busy}
                  className="rounded bg-emerald-800 px-4 py-2 text-sm font-medium text-white"
                  onClick={() =>
                    act({
                      id: record.id,
                      action: "publication_decision",
                      decision: "approve",
                      actor: "human",
                    })
                  }
                >
                  Human approve (fixture only)
                </button>
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
                  placeholder="Rejection reason (internal)"
                />
                <button
                  type="button"
                  disabled={busy}
                  className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-800"
                  onClick={() =>
                    act({
                      id: record.id,
                      action: "publication_decision",
                      decision: "reject",
                      actor: "human",
                      rejectionReason: rejectReason,
                    })
                  }
                >
                  Reject
                </button>
              </div>
              <p className="mt-3 text-xs text-stone-500">
                Approve requires awaiting_publication_decision, human actor, institution, draft, and
                evidence or limitations. Fixture path only — not written to production Notion.
              </p>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold">Audit</h3>
              <ol className="mt-2 space-y-1 text-xs text-stone-600">
                {record.audit.map((a, i) => (
                  <li key={i}>
                    <span className="font-medium">{a.action}</span> · {a.actor}
                    {a.note ? ` — ${a.note}` : ""}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
