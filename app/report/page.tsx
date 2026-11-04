"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STATES } from "@/lib/constants";

const REPORT_TYPES = [
  "Service access gap",
  "Service quality concern",
  "Facility condition",
  "Public project or commitment",
  "Environmental condition",
  "Safety concern",
  "Other",
];

const SECTORS = [
  "Health",
  "Education",
  "Security",
  "Infrastructure",
  "Water and sanitation",
  "Employment",
  "Public finance",
  "Governance",
  "Agriculture",
  "Environment",
];

const EVIDENCE_TYPES = [
  "First-hand observation",
  "Photograph or document",
  "Official record",
  "Witness account",
  "Public media report",
  "Other",
];

export default function CommunityReportPage() {
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [sector, setSector] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [placeOrFacility, setPlaceOrFacility] = useState("");
  const [observedOn, setObservedOn] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceTypes, setEvidenceTypes] = useState<string[]>([]);
  const [evidenceLink, setEvidenceLink] = useState("");
  const [sourceContext, setSourceContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggleEvidence(value: string) {
    setEvidenceTypes((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/community-observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          reportType,
          sector,
          state,
          lga,
          ward,
          placeOrFacility,
          observedOn: observedOn || undefined,
          description,
          evidenceTypes,
          evidenceLink: evidenceLink || undefined,
          sourceContext,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your report could not be submitted.");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Your report could not be submitted.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-cream">
      <Header />
      <main className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">ISEYC · Community intelligence</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-forest-900">Report a community observation</h1>
          <p className="mt-2 text-sm leading-relaxed text-forest-700">
            Share a specific condition or service issue you observed, where it happened, and how you know about it.
          </p>

          <div className="mt-5 border border-forest-500/20 bg-white p-4 text-xs leading-relaxed text-forest-700">
            <p className="font-bold text-forest-900">Before you submit</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>This is separate from a civic demand or petition.</li>
              <li>Your report is private until a human reviewer approves a redacted public version.</li>
              <li>Submitting a report does not mean the claim has been verified.</li>
              <li>Do not include names, phone numbers, email addresses or other personal information.</li>
              <li>Do not submit emergency reports here. Contact the relevant emergency service.</li>
            </ul>
          </div>

          {submitted ? (
            <section role="status" className="mt-6 border border-forest-500/20 bg-white p-5">
              <h2 className="font-display text-lg font-bold text-forest-900">Report received</h2>
              <p className="mt-2 text-sm leading-relaxed text-forest-700">
                Your report has been saved privately for review. It is not public, and no verification or government response is implied.
              </p>
              <button
                type="button"
                onClick={() => window.location.assign("/")}
                className="mt-5 rounded-md bg-forest-800 px-4 py-3 text-sm font-semibold text-white"
              >
                Return to Civic Mandate
              </button>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5 border-y border-forest-500/15 bg-white px-4 py-6 sm:px-5">
              <div>
                <label htmlFor="report-title" className="mb-1.5 block text-sm font-semibold text-forest-900">Short title</label>
                <input id="report-title" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 120))} minLength={5} maxLength={120} required className="field-control w-full px-3 text-sm" placeholder="e.g. Water supply has stopped at the community borehole" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="report-type" className="mb-1.5 block text-sm font-semibold text-forest-900">Type of observation</label>
                  <select id="report-type" value={reportType} onChange={(e) => setReportType(e.target.value)} required className="field-control w-full px-3 text-sm">
                    <option value="">Select type</option>
                    {REPORT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="report-sector" className="mb-1.5 block text-sm font-semibold text-forest-900">Sector</label>
                  <select id="report-sector" value={sector} onChange={(e) => setSector(e.target.value)} required className="field-control w-full px-3 text-sm">
                    <option value="">Select sector</option>
                    {SECTORS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="report-state" className="mb-1.5 block text-sm font-semibold text-forest-900">State</label>
                <select id="report-state" value={state} onChange={(e) => setState(e.target.value)} required className="field-control w-full px-3 text-sm">
                  <option value="">Select state</option>
                  {STATES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="report-lga" className="mb-1.5 block text-sm font-semibold text-forest-900">LGA <span className="font-normal text-forest-500">optional</span></label>
                  <input id="report-lga" value={lga} onChange={(e) => setLga(e.target.value.slice(0, 120))} maxLength={120} className="field-control w-full px-3 text-sm" />
                </div>
                <div>
                  <label htmlFor="report-ward" className="mb-1.5 block text-sm font-semibold text-forest-900">Ward <span className="font-normal text-forest-500">optional</span></label>
                  <input id="report-ward" value={ward} onChange={(e) => setWard(e.target.value.slice(0, 120))} maxLength={120} className="field-control w-full px-3 text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="report-place" className="mb-1.5 block text-sm font-semibold text-forest-900">Facility or place <span className="font-normal text-forest-500">optional</span></label>
                <input id="report-place" value={placeOrFacility} onChange={(e) => setPlaceOrFacility(e.target.value.slice(0, 180))} maxLength={180} className="field-control w-full px-3 text-sm" placeholder="Facility, road, school, market or neighbourhood" />
              </div>

              <div>
                <label htmlFor="observed-on" className="mb-1.5 block text-sm font-semibold text-forest-900">When did you observe this? <span className="font-normal text-forest-500">optional</span></label>
                <input id="observed-on" type="date" value={observedOn} onChange={(e) => setObservedOn(e.target.value)} className="field-control w-full px-3 text-sm" />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <label htmlFor="report-description" className="text-sm font-semibold text-forest-900">What happened or what did you observe?</label>
                  <span className="text-[10px] tabular-nums text-forest-500">{description.length}/1500</span>
                </div>
                <textarea id="report-description" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 1500))} minLength={30} maxLength={1500} rows={5} required className="field-control w-full resize-y px-3 py-3 text-sm leading-relaxed" placeholder="Describe the condition, service, location and what you personally know. Separate what you saw from what you heard." />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-forest-900">What is the basis of this report?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EVIDENCE_TYPES.map((item) => (
                    <label key={item} className="flex items-center gap-2 border border-forest-500/15 px-3 py-2.5 text-xs text-forest-800">
                      <input type="checkbox" checked={evidenceTypes.includes(item)} onChange={() => toggleEvidence(item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="source-context" className="mb-1.5 block text-sm font-semibold text-forest-900">How do you know? What is the source context?</label>
                <textarea id="source-context" value={sourceContext} onChange={(e) => setSourceContext(e.target.value.slice(0, 500))} minLength={15} maxLength={500} rows={3} required className="field-control w-full resize-y px-3 py-3 text-sm" placeholder="For example: I visited the facility on the date above; or this is from the linked official report." />
              </div>

              <div>
                <label htmlFor="evidence-link" className="mb-1.5 block text-sm font-semibold text-forest-900">Public evidence link <span className="font-normal text-forest-500">optional · HTTPS only</span></label>
                <input id="evidence-link" type="url" value={evidenceLink} onChange={(e) => setEvidenceLink(e.target.value.slice(0, 2000))} maxLength={2000} className="field-control w-full px-3 text-sm" placeholder="https://..." />
              </div>

              {error ? <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p> : null}
              <button type="submit" disabled={loading} className="w-full rounded-md bg-forest-800 px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60">
                {loading ? "Submitting…" : "Submit report privately"}
              </button>
              <p className="text-[10px] leading-relaxed text-forest-500">
                No name, phone number, email, demographic profile or device fingerprint is requested. The report remains unpublished until reviewed.
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
