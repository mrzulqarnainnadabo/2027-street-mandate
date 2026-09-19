"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OfficeCards from "@/components/OfficeCards";
import FormPanel from "@/components/FormPanel";
import SuccessPanel from "@/components/SuccessPanel";
import LivePulse from "@/components/LivePulse";
import Footer from "@/components/Footer";

export default function Home() {
  const [office, setOffice] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [lastSentence, setLastSentence] = useState("");
  const [lastState, setLastState] = useState("");
  const [lastLga, setLastLga] = useState("");
  const [lastDuty, setLastDuty] = useState("");
  const [lastOffice, setLastOffice] = useState("");
  const [stats, setStats] = useState({ total: 0, lgas: 0 });

  useEffect(() => {
    fetch("/api/pulse")
      .then((r) => r.json())
      .then((d) => setStats({ total: d.total || 0, lgas: d.lgas || 0 }))
      .catch(() => {});
  }, [done]);

  function handleSuccess(
    sentence: string,
    state: string,
    lga: string,
    duty: string,
    selectedOffice: string
  ) {
    setLastSentence(sentence);
    setLastState(state);
    setLastLga(lga);
    setLastDuty(duty);
    setLastOffice(selectedOffice);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setOffice(null);
    setDone(false);
    setLastSentence("");
    setLastState("");
    setLastLga("");
    setLastDuty("");
    setLastOffice("");
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />

      <main>
        <Hero total={stats.total} lgas={stats.lgas} />

        {!done ? (
          <>
            <OfficeCards selected={office} onSelect={setOffice} />

            {office && (
              <FormPanel office={office} onSuccess={handleSuccess} />
            )}
          </>
        ) : (
          <SuccessPanel
            sentence={lastSentence}
            state={lastState}
            lga={lastLga}
            duty={lastDuty}
            office={lastOffice}
            onReset={reset}
          />
        )}

        <LivePulse />
      </main>

      <Footer />
    </div>
  );
}