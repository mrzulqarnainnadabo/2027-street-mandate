"use client";

import { useState } from "react";
import {
  WILL_VOTE,
  STATES,
  AGE_BANDS,
  GENDERS,
  MAX_SENTENCE,
  PROMPT_EXAMPLES,
} from "@/lib/constants";
import { getDeviceId } from "@/lib/fingerprint";

export default function FormPanel({
  mandate,
  onSuccess,
}: {
  mandate: string;
  onSuccess: (sentence: string, state: string) => void;
}) {
  const [willVote, setWillVote] = useState("");
  const [state, setState] = useState("");
  const [sentence, setSentence] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = PROMPT_EXAMPLES[mandate] || PROMPT_EXAMPLES["Other"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!willVote || !state || sentence.trim().length < 5) {
      setError("Please complete the required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: sentence.trim(),
          mandate,
          willVote,
          state,
          ageBand: ageBand || undefined,
          gender: gender || undefined,
          deviceId: getDeviceId(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onSuccess(sentence.trim(), state);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 pt-6">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-forest-500">
        2 · Your voice
      </h2>
      <form onSubmit={handleSubmit} className="paper-card space-y-4 rounded-2xl p-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            Will you vote in 2027?
          </label>
          <div className="space-y-1.5">
            {WILL_VOTE.map((w) => (
              <label
                key={w.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  willVote === w.id
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-500/15"
                }`}
              >
                <input
                  type="radio"
                  name="willVote"
                  value={w.id}
                  checked={willVote === w.id}
                  onChange={() => setWillVote(w.id)}
                  className="accent-forest-500"
                />
                {w.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-forest-700">
            Your state
          </label>
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
            What must leaders deliver?{" "}
            <span className="font-normal text-forest-500">
              ({sentence.length}/{MAX_SENTENCE})
            </span>
          </label>
          <p className="mb-2 text-[11px] leading-snug text-forest-600/75">
            One clear demand in plain English — not a party slogan. Speak as if
            they are listening.
          </p>
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value.slice(0, MAX_SENTENCE))}
            required
            rows={3}
            placeholder="e.g. Power that stays on so small shops can open every day…"
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
            <label className="mb-1 block text-[10px] font-medium text-forest-700/70">
              Age (optional)
            </label>
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
            <label className="mb-1 block text-[10px] font-medium text-forest-700/70">
              Gender (optional)
            </label>
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
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-forest-500 py-3.5 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Adding your voice…" : "Add my voice"}
        </button>
      </form>
    </section>
  );
}
