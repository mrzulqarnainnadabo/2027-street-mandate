"use client";

import { useState } from "react";
import {
  OFFICES,
  STATES,
  AGE_BANDS,
  GENDERS,
  MAX_SENTENCE,
  PROMPT_EXAMPLES,
} from "@/lib/constants";
import { getDeviceId } from "@/lib/fingerprint";

export default function FormPanel({
  duty,
  onSuccess,
}: {
  duty: string;
  onSuccess: (sentence: string, state: string, mandateId?: string) => void;
}) {
  const [office, setOffice] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [sentence, setSentence] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = PROMPT_EXAMPLES[duty] || PROMPT_EXAMPLES["Other"];
  const officeMeta = OFFICES.find((o) => o.id === office);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!office || !state || sentence.trim().length < 5) {
      setError("Please choose an office, your state, and write a clear demand.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: sentence.trim(),
          duty,
          office,
          state,
          lga: lga.trim() || undefined,
          ageBand: ageBand || undefined,
          gender: gender || undefined,
          deviceId: getDeviceId(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const rawId = typeof data.id === "string" ? data.id.replace(/-/g, "") : undefined;
      onSuccess(sentence.trim(), state, rawId);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 pt-6">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-forest-500">
        2 · Your civic mandate
      </h2>
      <form onSubmit={handleSubmit} className="paper-card space-y-4 rounded-2xl p-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            Which office must deliver this?
          </label>
          <select
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            required
            className="w-full rounded-lg border border-forest-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-500"
          >
            <option value="">Select office…</option>
            {OFFICES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          {officeMeta && (
            <p className="mt-1.5 text-[11px] leading-snug text-forest-600/80">{officeMeta.hint}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">Your state</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="w-full rounded-lg border border-forest-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-500"
          >
            <option value="">Select state…</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            LGA <span className="font-normal text-forest-500">(optional)</span>
          </label>
          <input
            type="text"
            value={lga}
            onChange={(e) => setLga(e.target.value.slice(0, 120))}
            placeholder="e.g. Kaduna South"
            className="w-full rounded-lg border border-forest-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            What must they deliver?{" "}
            <span className="font-normal text-forest-500">
              ({sentence.length}/{MAX_SENTENCE})
            </span>
          </label>
          <p className="mb-2 text-[11px] leading-snug text-forest-600/75">
            One concrete demand — measurable if possible. Not a party slogan.
          </p>
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value.slice(0, MAX_SENTENCE))}
            required
            rows={3}
            placeholder="e.g. Primary health centres stocked with essential medicines…"
            className="w-full resize-none rounded-lg border border-forest-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-500"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setSentence(ex.slice(0, MAX_SENTENCE))}
                className="rounded-full border border-forest-500/15 bg-forest-50/80 px-2.5 py-1 text-left text-[10px] leading-snug text-forest-700 transition active:bg-forest-100"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-forest-700/70">Age (optional)</label>
            <select
              value={ageBand}
              onChange={(e) => setAgeBand(e.target.value)}
              className="w-full rounded-lg border border-forest-500/15 bg-white px-2 py-2 text-xs"
            >
              <option value="">—</option>
              {AGE_BANDS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-forest-700/70">Gender (optional)</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border border-forest-500/15 bg-white px-2 py-2 text-xs"
            >
              <option value="">—</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
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
          {loading ? "Submitting mandate…" : "Submit my mandate"}
        </button>

        <p className="text-center text-[10px] leading-snug text-forest-500">
          Non-partisan. No candidate rankings. Your text appears only after moderation.
        </p>
      </form>
    </section>
  );
}
