"use client";

import { useMemo, useState } from "react";
import { buildMandateStoryDraft } from "@/lib/mandate-story-draft";

type Props = {
  id: string;
  sentence: string;
  state: string;
  lga?: string;
  duty: string;
  office: string;
  created: string;
};

export default function MandateStoryDraftPanel(props: Props) {
  const [open, setOpen] = useState(false);
  const draft = useMemo(() => buildMandateStoryDraft(props), [props]);

  return (
    <section className="mt-4 rounded-xl border border-dashed border-forest-500/25 bg-cream/60 px-4 py-4">
      <h2 className="text-[10px] font-bold uppercase tracking-wide text-gold-600">
        ISEYC Media · Mandate Story draft
      </h2>
      <p className="mt-1 text-[11px] leading-snug text-forest-600">
        Structured draft from this published record only. Requires human editorial approval before any
        media publication. AI must not invent responses or statistics.
      </p>
      <button
        type="button"
        className="mt-3 min-h-[44px] w-full rounded-md border border-forest-500/25 bg-white px-3 text-sm font-semibold text-forest-800"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide draft" : "Generate draft for editorial queue"}
      </button>
      {open ? (
        <div className="mt-3 space-y-2 text-xs text-forest-800">
          <p>
            <span className="font-semibold">Status:</span> {draft.editorialStatus}
          </p>
          <p>
            <span className="font-semibold">Headline:</span> {draft.headline}
          </p>
          <p>
            <span className="font-semibold">Summary:</span> {draft.summary}
          </p>
          <p>
            <span className="font-semibold">What was requested:</span> {draft.whatCitizensRequested}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {draft.location}
          </p>
          <p>
            <span className="font-semibold">Evidence / response:</span> {draft.evidenceOrResponse}
          </p>
          <p>
            <span className="font-semibold">Sources:</span> {draft.sourceReferences.join(" · ")}
          </p>
          <p className="text-forest-500">
            Unavailable (do not invent): {draft.unavailable.join("; ")}
          </p>
          <p className="text-[10px] text-forest-500">Generated {draft.generatedAt}</p>
        </div>
      ) : null}
    </section>
  );
}
