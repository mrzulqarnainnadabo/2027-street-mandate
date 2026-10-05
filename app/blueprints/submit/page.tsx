"use client";

import Link from "next/link";
import { useState } from "react";
import { DUTIES, OFFICES, STATES } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OFFICE_OPTIONS = OFFICES.filter((o) => o.id !== "Unsure");

export default function BlueprintSubmitPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      actorDisplayName: String(fd.get("actorDisplayName") || ""),
      officeSought: String(fd.get("officeSought") || ""),
      dutyOrPolicyArea: String(fd.get("dutyOrPolicyArea") || ""),
      proposalText: String(fd.get("proposalText") || ""),
      sourceUrlOrCitation: String(fd.get("sourceUrlOrCitation") || ""),
      politicalPlatform: String(fd.get("politicalPlatform") || ""),
      mechanism: String(fd.get("mechanism") || ""),
      target: String(fd.get("target") || ""),
      timeline: String(fd.get("timeline") || ""),
      funding: String(fd.get("funding") || ""),
      geographyScope: String(fd.get("geographyScope") || "Nigeria"),
      statementClass: String(fd.get("statementClass") || "ACTOR_STATEMENT"),
      sourceDate: String(fd.get("sourceDate") || ""),
      contactEmail: String(fd.get("contactEmail") || ""),
    };
    try {
      const res = await fetch("/api/blueprints/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Submission failed.");
        setBusy(false);
        return;
      }
      setDone({ id: data.id });
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">
          ISEYC Public Blueprint Register
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900">Submit a public blueprint</h1>
        <p className="mt-3 text-sm leading-relaxed text-forest-700">
          For public-office seekers and parties documenting an official proposal already on the public record.
          This is <strong>not</strong> an endorsement, ranking, campaign page, or faster path to visibility.
          Equal process applies to every submitter. Dual human review is required before any record is Published.
        </p>

        <section className="mt-6 rounded-xl border border-forest-500/15 bg-cream/60 p-4 text-xs leading-relaxed text-forest-700">
          <p className="font-bold text-forest-900">Requirements</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>One concrete proposal tied to a duty of government (not slogans).</li>
            <li>Source URL or clear public citation (speech, PDF, interview, manifesto page).</li>
            <li>Office sought and geography scope.</li>
            <li>No ranking language, donate buttons, or attacks on opponents.</li>
            <li>Submission creates status <strong>New</strong> only — never auto-Published.</li>
          </ul>
        </section>

        {done ? (
          <section className="mt-8 rounded-xl border border-forest-500/20 bg-white p-6">
            <h2 className="font-display text-xl font-bold text-forest-900">Received — not yet public</h2>
            <p className="mt-3 text-sm leading-relaxed text-forest-700">
              Your blueprint entered the review queue as <strong>New / UNVERIFIED</strong>. It will appear on the
              public register only after independent dual review. Reference:{" "}
              <span className="font-mono text-xs">{done.id}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/blueprints"
                className="inline-flex min-h-11 items-center rounded-lg bg-forest-800 px-4 text-xs font-bold text-white"
              >
                Public register
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center rounded-lg border border-forest-500/20 px-4 text-xs font-semibold text-forest-800"
              >
                Citizen mandates
              </Link>
            </div>
          </section>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <label className="block text-xs font-semibold text-forest-800">
              Public display name
              <input
                name="actorDisplayName"
                required
                minLength={2}
                maxLength={120}
                className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                placeholder="Name as it should appear on the public record"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-forest-800">
                Office sought
                <select
                  name="officeSought"
                  required
                  className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select office
                  </option>
                  {OFFICE_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-forest-800">
                Policy area
                <select
                  name="dutyOrPolicyArea"
                  required
                  className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select duty
                  </option>
                  {DUTIES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-xs font-semibold text-forest-800">
              Geography scope
              <select
                name="geographyScope"
                className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                defaultValue="Nigeria"
              >
                <option value="Nigeria">Nigeria (national)</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-semibold text-forest-800">
              Party / platform (optional)
              <input
                name="politicalPlatform"
                maxLength={120}
                className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                placeholder="Leave blank if not publicly specified"
              />
            </label>

            <label className="block text-xs font-semibold text-forest-800">
              Proposal text (exact public statement)
              <textarea
                name="proposalText"
                required
                minLength={20}
                maxLength={1800}
                rows={5}
                className="mt-1 w-full rounded-lg border border-forest-500/20 bg-white px-3 py-2 text-sm leading-relaxed"
                placeholder="Concrete delivery commitment — not a slogan"
              />
            </label>

            <label className="block text-xs font-semibold text-forest-800">
              Source URL or citation
              <input
                name="sourceUrlOrCitation"
                required
                minLength={12}
                maxLength={2000}
                className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                placeholder="https://… or clear citation of a public document"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-forest-800">
                Source date (optional)
                <input
                  name="sourceDate"
                  maxLength={40}
                  className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                  placeholder="e.g. 2026-09-15"
                />
              </label>
              <label className="block text-xs font-semibold text-forest-800">
                Statement class
                <select
                  name="statementClass"
                  className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                  defaultValue="ACTOR_STATEMENT"
                >
                  <option value="ACTOR_STATEMENT">Aspirant / actor statement</option>
                  <option value="OFFICIAL_RECORD">Official record / party document</option>
                  <option value="MEDIA_REPORT">Media report of a public statement</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-forest-800">
                Mechanism (optional)
                <input name="mechanism" maxLength={200} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm" />
              </label>
              <label className="block text-xs font-semibold text-forest-800">
                Target (optional)
                <input name="target" maxLength={200} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm" />
              </label>
              <label className="block text-xs font-semibold text-forest-800">
                Timeline (optional)
                <input name="timeline" maxLength={200} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm" />
              </label>
              <label className="block text-xs font-semibold text-forest-800">
                Funding (optional)
                <input name="funding" maxLength={200} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm" />
              </label>
            </div>

            <label className="block text-xs font-semibold text-forest-800">
              Contact email (optional, internal only — never published)
              <input
                name="contactEmail"
                type="email"
                maxLength={120}
                className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3 text-sm"
                autoComplete="email"
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-lg bg-forest-800 px-4 text-sm font-bold text-white disabled:opacity-60 sm:w-auto"
            >
              {busy ? "Submitting…" : "Submit for review"}
            </button>
            <p className="text-[11px] leading-relaxed text-forest-600">
              By submitting you confirm the proposal is already public or you are authorized to document it.
              ISEYC may request clarification, hold, or decline publication under equal process rules.
            </p>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
