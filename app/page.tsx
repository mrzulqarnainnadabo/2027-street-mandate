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

export default function Home() {
  const [duty, setDuty] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [lastSentence, setLastSentence] = useState("");
  const [lastState, setLastState] = useState("");
  const [lastMandateId, setLastMandateId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState({ total: 0, states: 0 });

  useEffect(() => {
    fetch("/api/pulse")
      .then((r) => r.json())
      .then((d) => setStats({ total: d.total || 0, states: d.states || 0 }))
      .catch(() => {});
  }, [done]);

  function handleSuccess(sentence: string, state: string, mandateId?: string) {
    setLastSentence(sentence);
    setLastState(state);
    setLastMandateId(mandateId);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setDuty(null);
    setDone(false);
    setLastSentence("");
    setLastState("");
    setLastMandateId(undefined);
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main>
        <Hero total={stats.total} states={stats.states} />

        {!done ? (
          <>
            <HowItWorks />
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
