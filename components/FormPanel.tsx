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

const MIN_SENTENCE = 20;

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
    const text = sentence.trim();
    if (!office || !state) {
      setError("Please choose the responsible office and your state.");
      return;
    }
    if (text.length < MIN_SENTENCE) {
      setError(
        `Write a clearer demand (at least ${MIN_SENTENCE} characters). Name a service or outcome — not a party slogan.`
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: text,
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
      onSuccess(text, state, rawId);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 pt-7">
      <div className="mx-auto max-w-xl border-y border-forest-500/15 bg-white px-4 py-5 sm:px-5">
        <div className="mb-5 border-b border-forest-500/10 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">Step 2</p>
          <h2 className="mt-1 font-display text-lg font-bold text-forest-900">
            State your civic mandate
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-forest-600">
            Tie the demand to an office and a place so it can enter the public record as data — not
            noise.
          </p>
        </div>

        <div className="mb-5 grid gap-2 text-[11px] leading-snug sm:grid-cols-2">
          <div className="border border-forest-500/12 bg-forest-50/50 px-3 py-2.5">
            <p className="font-bold uppercase tracking-wide text-forest-600">More likely published</p>
            <p className="mt-1 text-forest-700">
              Specific service or outcome (e.g. medicines at the PHC, teachers present, cleared drains).
            </p>
          </div>
          <div className="border border-forest-500/12 bg-forest-50/50 px-3 py-2.5">
            <p className="font-bold uppercase tracking-wide text-forest-600">Usually rejected</p>
            <p className="mt-1 text-forest-700">
              Party slogans, candidate promotion, threats, personal attacks, empty insults.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-bold text-forest-900">
              Which office must deliver this?
            </label>
            <select
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              required
              className="field-control w-full px-3 text-sm outline-none"
            >
              <option value="">Select responsible office…</option>
              {OFFICES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            {officeMeta && (
              <p className="mt-1.5 text-[11px] leading-snug text-forest-600">{officeMeta.hint}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-bold text-forest-900">Your state</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="field-control w-full px-3 text-sm outline-none"
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
            <label className="mb-2 block text-[13px] font-bold text-forest-900">
              LGA <span className="font-normal text-forest-500">(optional but useful)</span>
            </label>
            <input
              type="text"
              value={lga}
              onChange={(e) => setLga(e.target.value.slice(0, 120))}
              placeholder="e.g. Kaduna South"
              className="field-control w-full px-3 text-sm outline-none"
            />
            <p className="mt-1 text-[10px] text-forest-500">
              LGA helps the brief connect demands to the right local place.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label className="text-[13px] font-bold text-forest-900">
                What must they deliver?
              </label>
              <span className="shrink-0 text-[10px] tabular-nums text-forest-500">
                {sentence.length}/{MAX_SENTENCE}
              </span>
            </div>
            <p className="mb-2 text-[11px] leading-snug text-forest-600">
              One concrete demand. Prefer something you could check in 6–12 months. Not a campaign
              slogan.
            </p>
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value.slice(0, MAX_SENTENCE))}
              required
              rows={4}
              minLength={MIN_SENTENCE}
              placeholder="e.g. Primary health centres stocked with essential medicines…"
              className="field-control min-h-[120px] w-full resize-none px-3 py-3 text-sm leading-relaxed outline-none"
            />
            <div className="mt-2 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-forest-500">
                Tap an example to start (edit before submit)
              </p>
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setSentence(ex.slice(0, MAX_SENTENCE))}
                  className="block w-full border border-forest-500/12 bg-forest-50/60 px-3 py-2 text-left text-[11px] leading-snug text-forest-700 transition hover:border-forest-500/25 active:bg-forest-50"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-forest-500/10 pt-4">
            <p className="mb-3 text-[11px] font-semibold text-forest-700">
              Optional demographics · not shown on the public wall
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-forest-700">Age</label>
                <select
                  value={ageBand}
                  onChange={(e) => setAgeBand(e.target.value)}
                  className="min-h-[46px] w-full rounded-md border border-forest-500/15 bg-white px-2 text-xs outline-none focus:border-forest-500"
                >
                  <option value="">Prefer not to say</option>
                  {AGE_BANDS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-forest-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="min-h-[46px] w-full rounded-md border border-forest-500/15 bg-white px-2 text-xs outline-none focus:border-forest-500"
                >
                  <option value="">Prefer not to say</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p className="border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="min-h-[52px] w-full rounded-md bg-forest-500 px-4 text-sm font-bold text-white transition hover:bg-forest-700 active:translate-y-px disabled:opacity-60"
          >
            {loading ? "Submitting mandate…" : "Submit my mandate"}
          </button>

          <p className="text-center text-[10px] leading-snug text-forest-500">
            Non-partisan. No candidate rankings. Text appears on Civic Pulse only after ISEYC
            publishes it.
          </p>
        </form>
      </div>
    </section>
  );
}
