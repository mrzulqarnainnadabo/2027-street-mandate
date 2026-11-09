"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CitizenHome from "@/components/CitizenHome";
import PartnersStrip from "@/components/PartnersStrip";
import DutyCards from "@/components/DutyCards";
import FormPanel from "@/components/FormPanel";
import SuccessPanel from "@/components/SuccessPanel";
import LivePulse from "@/components/LivePulse";
import Footer from "@/components/Footer";
import { loadDraft } from "@/lib/draft";
import PilotNotice from "@/components/PilotNotice";

export default function Home() {
  const [duty, setDuty] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showDemandForm, setShowDemandForm] = useState(false);
  const [lastSentence, setLastSentence] = useState("");
  const [lastState, setLastState] = useState("");
  const [lastMandateId, setLastMandateId] = useState<string | undefined>(undefined);
  const [draftRestored, setDraftRestored] = useState(false);
  useEffect(() => {
    const d = loadDraft();
    if (d?.duty) {
      setDuty(d.duty);
      setShowDemandForm(true);
      setDraftRestored(true);
    }
  }, []);

  function handleSuccess(sentence: string, state: string, mandateId?: string) {
    setLastSentence(sentence);
    setLastState(state);
    setLastMandateId(mandateId);
    setDone(true);
    setDraftRestored(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setDuty(null);
    setDone(false);
    setShowDemandForm(false);
    setLastSentence("");
    setLastState("");
    setLastMandateId(undefined);
    setDraftRestored(false);
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl">
      <Header />
      <main>
        <PilotNotice />
        {!done ? (
          <>
            {showDemandForm ? (
              <section className="mx-auto max-w-5xl px-4 py-6" id="mandate-form">
                <button type="button" onClick={() => setShowDemandForm(false)} className="mb-4 min-h-10 text-xs font-semibold text-forest-800 underline underline-offset-4">← Back to citizen guide</button>
                {draftRestored && duty ? (
                  <p className="mb-3 rounded-md border border-forest-500/15 bg-forest-50 px-3 py-2 text-center text-[11px] text-forest-700">
                    Draft restored on this device. Nothing is public until ISEYC marks it Published.
                  </p>
                ) : null}
                <div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">Public participation</p><h1 className="mt-1 font-display text-2xl font-bold text-forest-900">Submit a public-service demand</h1><p className="mt-2 max-w-xl text-sm leading-5 text-forest-700">Describe a specific public-service issue, where it is happening and which duty may be involved. ISEYC reviews every submission before publication.</p></div>
                <DutyCards selected={duty} onSelect={setDuty} />
                {duty && <FormPanel duty={duty} onSuccess={handleSuccess} />}
              </section>
            ) : (
              <CitizenHome onSubmitDemand={() => setShowDemandForm(true)} />
            )}
            <PartnersStrip />
          </>
        ) : (
          <>
            <SuccessPanel
              sentence={lastSentence}
              state={lastState}
              mandateId={lastMandateId}
              onReset={reset}
            />
            <PartnersStrip />
          </>
        )}

        <div id="civic-pulse" className="scroll-mt-16">
          <LivePulse />
        </div>
      </main>
      <Footer />
    </div>
  );
}
