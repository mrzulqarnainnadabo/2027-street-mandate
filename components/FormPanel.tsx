"use client";

import { useState } from "react";
import { DUTIES, KADUNA_LGAS, MAX_SENTENCE, PROMPT_EXAMPLES } from "@/lib/constants";
import { getDeviceId } from "@/lib/fingerprint";

export default function FormPanel({
  office,
  onSuccess,
}: {
  office: string;
  onSuccess: (sentence: string, state: string, lga: string, duty: string, office: string) => void;
}) {
  const [lga, setLga] = useState("");
  const [duty, setDuty] = useState("");
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = PROMPT_EXAMPLES[duty] || PROMPT_EXAMPLES.Health;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!lga || !duty || sentence.trim().length < 5) {
      setError("Choose your LGA, choose a duty, and write one concrete demand.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: sentence.trim(),
          office,
          lga,
          duty,
          state: "Kaduna",
          source: "Direct Link",
          deviceId: getDeviceId(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not submit your mandate.");
      }

      onSuccess(sentence.trim(), "Kaduna", lga, duty, office);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 pt-6">
      <div className="mb-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest-500">
          2 · Where and what?
        </p>
        <p className="mt-1 text-xs text-forest-600/70">
          Your demand is published only after moderation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="paper-card space-y-4 rounded-2xl p-4">
        <div className="rounded-xl bg-forest-50 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-forest-500">Selected office</p>
          <p className="mt-0.5 text-sm font-bold text-forest-800">{office}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            Kaduna LGA
          </label>
          <select
            value={lga}
            onChange={(e) => setLga(e.target.value)}
            required
            className="w-full rounded-lg border border-forest-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-500"
          >
            <option value="">Select LGA…</option>
            {KADUNA_LGAS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            Duty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DUTIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDuty(item.id)}
                className={`rounded-lg border px-2.5 py-2 text-left transition active:scale-[0.98] ${
                  duty === item.id
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-500/15 bg-white"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="text-xs font-medium text-forest-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            One concrete demand{" "}
            <span className="font-normal text-forest-500">
              ({sentence.length}/{MAX_SENTENCE})
            </span>
          </label>
          <p className="mb-2 text-[11px] leading-snug text-forest-600/75">
            Say what should be delivered, not who to support.
          </p>

          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value.slice(0, MAX_SENTENCE))}
            required
            rows={4}
            placeholder="e.g. Repair the main road serving our ward before the next rainy season."
            className="w-full resize-none rounded-lg border border-forest-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-500"
          />

          <div className="mt-2 flex flex-wrap gap-1.5">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setSentence(example.slice(0, MAX_SENTENCE))}
                className="rounded-full border border-forest-500/15 bg-forest-50/80 px-2.5 py-1 text-left text-[10px] leading-snug text-forest-700 transition active:bg-forest-100"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-forest-500 py-3.5 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Submitting mandate…" : "Submit this mandate"}
        </button>
      </form>
    </section>
  );
}