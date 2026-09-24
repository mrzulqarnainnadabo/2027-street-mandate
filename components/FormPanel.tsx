"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  OFFICES,
  STATES,
  AGE_BANDS,
  GENDERS,
  MIN_SENTENCE,
  MAX_SENTENCE,
  PROMPT_EXAMPLES,
} from "@/lib/constants";
import { getDeviceId } from "@/lib/fingerprint";
import { useLang } from "@/components/LanguageProvider";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft";
import { rowsForDuty, suggestedPrimaryOffice } from "@/lib/responsibility-map";

export default function FormPanel({
  duty,
  onSuccess,
}: {
  duty: string;
  onSuccess: (sentence: string, state: string, mandateId?: string) => void;
}) {
  const { t } = useLang();
  const [office, setOffice] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [sentence, setSentence] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [gender, setGender] = useState("");
  const [showOptionalDemo, setShowOptionalDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const examples = PROMPT_EXAMPLES[duty] || PROMPT_EXAMPLES["Other"];
  const officeMeta = OFFICES.find((o) => o.id === office);
  const mapRow = rowsForDuty(duty);
  const suggested = suggestedPrimaryOffice(duty);
  const suggestedValid =
    suggested && OFFICES.some((o) => o.id === suggested) ? suggested : null;

  useEffect(() => {
    const d = loadDraft();
    if (d && d.duty === duty) {
      setOffice(d.office || "");
      setState(d.state || "");
      setLga(d.lga || "");
      setSentence(d.sentence || "");
      setAgeBand(d.ageBand || "");
      setGender(d.gender || "");
      if (d.ageBand || d.gender) setShowOptionalDemo(true);
    }
    setHydrated(true);
  }, [duty]);

  useEffect(() => {
    if (!hydrated) return;
    const hasContent =
      Boolean(office || state || lga.trim() || sentence.trim() || ageBand || gender);
    if (!hasContent) return;
    saveDraft({
      duty,
      office,
      state,
      lga,
      sentence,
      ageBand,
      gender,
    });
  }, [duty, office, state, lga, sentence, ageBand, gender, hydrated]);

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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status >= 500 || res.status === 503) {
          throw new Error(
            data.error ||
              "Network or server problem. Your draft is saved on this phone — try again in a moment."
          );
        }
        throw new Error(data.error || "Failed");
      }
      const rawId = typeof data.id === "string" ? data.id.replace(/-/g, "") : undefined;
      clearDraft();
      onSuccess(text, state, rawId);
    } catch (err: any) {
      setError(
        err.message ||
          "Something went wrong. Your draft is saved on this phone — try again when the network is stable."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="mandate-form" className="scroll-mt-4 px-4 pt-7">
      <div className="mx-auto max-w-xl border-y border-forest-500/15 bg-white px-4 py-5 sm:px-5">
        <div className="mb-5 border-b border-forest-500/10 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
            {t("form.step")}
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-forest-900">{t("form.title")}</h2>
          <p className="mt-1 text-xs leading-relaxed text-forest-600">{t("form.intro")}</p>
          <p className="mt-2 text-[10px] leading-snug text-forest-500">
            Drafts stay on this phone only until you submit. Closing the tab will not erase them.
          </p>
        </div>

        <div className="mb-5 grid gap-2 text-[11px] leading-snug sm:grid-cols-2">
          <div className="border border-forest-500/12 bg-forest-50/50 px-3 py-2.5">
            <p className="font-bold uppercase tracking-wide text-forest-600">{t("form.publishLikely")}</p>
            <p className="mt-1 text-forest-700">{t("form.publishLikelyBody")}</p>
          </div>
          <div className="border border-forest-500/12 bg-forest-50/50 px-3 py-2.5">
            <p className="font-bold uppercase tracking-wide text-forest-600">{t("form.rejectLikely")}</p>
            <p className="mt-1 text-forest-700">{t("form.rejectLikelyBody")}</p>
          </div>
        </div>

        {mapRow ? (
          <div className="mb-5 border border-forest-500/12 bg-cream/80 px-3 py-2.5 text-[11px] leading-snug text-forest-700">
            <p className="font-bold text-forest-800">Offices often linked to {duty}</p>
            <ul className="mt-1.5 space-y-0.5">
              {mapRow.offices.slice(0, 3).map((o) => (
                <li key={o.office}>
                  {o.office} <span className="text-forest-500">({o.confidence})</span>
                </li>
              ))}
            </ul>
            {suggestedValid ? (
              <button
                type="button"
                onClick={() => setOffice(suggestedValid)}
                className="mt-2 w-full rounded-md border border-forest-500/20 bg-white px-3 py-2 text-left text-[11px] font-semibold text-forest-800 active:bg-forest-50"
              >
                Use suggested office: {suggestedValid}
                <span className="mt-0.5 block font-normal text-forest-500">
                  Pilot map · you can change it · not a ranking
                </span>
              </button>
            ) : null}
            <Link
              href="/map"
              className="mt-1.5 inline-block font-semibold text-forest-800 underline underline-offset-2"
            >
              Full responsibility map
            </Link>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-bold text-forest-900">{t("form.office")}</label>
            <select
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              required
              className="field-control w-full px-3 text-sm outline-none"
            >
              <option value="">{t("form.officePlaceholder")}</option>
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
            <label className="mb-2 block text-[13px] font-bold text-forest-900">{t("form.state")}</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="field-control w-full px-3 text-sm outline-none"
            >
              <option value="">{t("form.statePlaceholder")}</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-bold text-forest-900">
              {t("form.lga")}{" "}
              <span className="font-normal text-forest-500">{t("form.lgaOptional")}</span>
            </label>
            <input
              type="text"
              value={lga}
              onChange={(e) => setLga(e.target.value.slice(0, 120))}
              placeholder="e.g. Kaduna South"
              className="field-control w-full px-3 text-sm outline-none"
            />
            <p className="mt-1 text-[10px] text-forest-500">{t("form.lgaHint")}</p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label className="text-[13px] font-bold text-forest-900">{t("form.demand")}</label>
              <span className="shrink-0 text-[10px] tabular-nums text-forest-500">
                {sentence.length}/{MAX_SENTENCE}
              </span>
            </div>
            <p className="mb-2 text-[11px] leading-snug text-forest-600">{t("form.demandHint")}</p>
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
                {t("form.examples")}
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
            <button
              type="button"
              onClick={() => setShowOptionalDemo((v) => !v)}
              className="flex w-full items-center justify-between text-left text-[11px] font-semibold text-forest-700"
            >
              <span>Optional details — never published on the public wall</span>
              <span className="text-forest-500">{showOptionalDemo ? "Hide" : "Show"}</span>
            </button>
            {showOptionalDemo ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-forest-700">
                    {t("form.age")}
                  </label>
                  <select
                    value={ageBand}
                    onChange={(e) => setAgeBand(e.target.value)}
                    className="min-h-[46px] w-full rounded-md border border-forest-500/15 bg-white px-2 text-xs outline-none focus:border-forest-500"
                  >
                    <option value="">{t("form.preferNot")}</option>
                    {AGE_BANDS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-forest-700">
                    {t("form.gender")}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="min-h-[46px] w-full rounded-md border border-forest-500/15 bg-white px-2 text-xs outline-none focus:border-forest-500"
                  >
                    <option value="">{t("form.preferNot")}</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
          </div>

          {error && (
            <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="min-h-[52px] w-full rounded-md bg-forest-500 px-4 text-sm font-bold text-white transition hover:bg-forest-700 active:translate-y-px disabled:opacity-60"
          >
            {loading ? t("form.submitting") : t("form.submit")}
          </button>

          <p className="text-center text-[10px] leading-snug text-forest-500">{t("form.disclaimer")}</p>
          <p className="text-center text-[10px] leading-snug text-forest-500">{t("form.emergency")}</p>
        </form>
      </div>
    </section>
  );
}
