"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VoteCards from "@/components/VoteCards";
import FormPanel from "@/components/FormPanel";
import SuccessPanel from "@/components/SuccessPanel";
import LivePulse from "@/components/LivePulse";
import Footer from "@/components/Footer";

export default function Home() {
  const [mandate, setMandate] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [lastSentence, setLastSentence] = useState("");
  const [lastState, setLastState] = useState("");
  const [stats, setStats] = useState({ total: 0, states: 0 });

  useEffect(() => {
    fetch("/api/pulse")
      .then((r) => r.json())
      .then((d) => setStats({ total: d.total || 0, states: d.states || 0 }))
      .catch(() => {});
  }, [done]);

  function handleSuccess(sentence: string, state: string) {
    setLastSentence(sentence);
    setLastState(state);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setMandate(null);
    setDone(false);
    setLastSentence("");
    setLastState("");
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main>
        <Hero total={stats.total} states={stats.states} />

        {!done ? (
          <>
            <VoteCards selected={mandate} onSelect={setMandate} />
            {mandate && (
              <FormPanel mandate={mandate} onSuccess={handleSuccess} />
            )}
          </>
        ) : (
          <SuccessPanel
            sentence={lastSentence}
            state={lastState}
            onReset={reset}
          />
        )}

        <LivePulse />
      </main>
      <Footer />
    </div>
  );
}
