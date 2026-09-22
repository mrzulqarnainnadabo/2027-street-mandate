"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import DutyCards from "@/components/DutyCards";
import FormPanel from "@/components/FormPanel";
import SuccessPanel from "@/components/SuccessPanel";
import LivePulse from "@/components/LivePulse";
import Footer from "@/components/Footer";
import { loadDraft } from "@/lib/draft";

export default function Home() {
  const [duty, setDuty] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [lastSentence, setLastSentence] = useState("");
  const [lastState, setLastState] = useState("");
  const [lastMandateId, setLastMandateId] = useState<string | undefined>(undefined);
  const [draftRestored, setDraftRestored] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    states: number;
    status: "loading" | "ready" | "unavailable";
  }>({ total: 0, states: 0, status: "loading" });

  useEffect(() => {
    const d = loadDraft();
    if (d?.duty) {
      setDuty(d.duty);
      setDraftRestored(true);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/pulse")
      .then(async (r) => {
        if (!r.ok) throw new Error("pulse unavailable");
        return r.json();
      })
      .then((d) => {
        if (!alive) return;
        if (d?.error || !Array.isArray(d?.voices)) {
          throw new Error("malformed pulse");
        }
        setStats({
          total: typeof d.total === "number" ? d.total : d.voices.length,
          states: typeof d.states === "number" ? d.states : 0,
          status: "ready",
        });
      })
      .catch(() => {
        if (alive) setStats((s) => ({ ...s, status: "unavailable" }));
      });
    return () => {
      alive = false;
    };
  }, [done]);

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
    setLastSentence("");
    setLastState("");
    setLastMandateId(undefined);
    setDraftRestored(false);
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main>
        <Hero total={stats.total} states={stats.states} pulseStatus={stats.status} />

        {!done ? (
          <>
            <HowItWorks />
            {draftRestored && duty ? (
              <p className="mx-4 mb-2 rounded-md border border-forest-500/15 bg-forest-50 px-3 py-2 text-center text-[11px] text-forest-700">
                Draft restored on this phone. Finish and submit when ready — nothing is public until
                you submit and ISEYC publishes.
              </p>
            ) : null}
            <DutyCards selected={duty} onSelect={setDuty} />
            {duty && <FormPanel duty={duty} onSuccess={handleSuccess} />}
          </>
        ) : (
          <SuccessPanel
            sentence={lastSentence}
            state={lastState}
            mandateId={lastMandateId}
            onReset={reset}
          />
        )}

        <LivePulse />
      </main>
      <Footer />
    </div>
  );
}
