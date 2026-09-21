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
  const [stats, setStats] = useState<{
    total: number;
    states: number;
    status: "loading" | "ready" | "unavailable";
  }>({ total: 0, states: 0, status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/pulse")
      .then(async (r) => {
        if (!r.ok) throw new Error("pulse unavailable");
        const data = await r.json();
        if (
          !Array.isArray(data.voices) ||
          !data.tally ||
          typeof data.total !== "number" ||
          typeof data.states !== "number" ||
          data.total < 0 ||
          data.states < 0
        ) {
          throw new Error("pulse response invalid");
        }
        return data;
      })
      .then((d) => {
        if (!alive) return;
        setStats({
          total: typeof d.total === "number" ? d.total : 0,
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
        <Hero
          total={stats.total}
          states={stats.states}
          pulseStatus={stats.status}
        />

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
