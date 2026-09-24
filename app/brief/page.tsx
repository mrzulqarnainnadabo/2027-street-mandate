"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DUTIES, STATES } from "@/lib/constants";
import {
  copyText,
  shareFacebook,
  shareLinkedIn,
  shareNative,
  shareWhatsApp,
  shareX,
} from "@/lib/share";

type Voice = {
  id: string;
  sentence: string;
  mandate: string;
  duty?: string;
  office?: string;
  state: string;
  lga?: string;
};

type Duty = (typeof DUTIES)[number];

function groupByOffice(items: Voice[]): { office: string; items: Voice[] }[] {
  const map = new Map<string, Voice[]>();
  for (const v of items) {
    const key = (v.office || "").trim() || "Office not specified";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(v);
  }
  return Array.from(map.entries())
    .map(([office, list]) => ({ office, items: list }))
    .sort((a, b) => a.office.localeCompare(b.office));
}

function briefUrl(state: string) {
  return `https://2027-street-mandate.vercel.app/brief?state=${encodeURIComponent(state)}`;
}

function buildPlainBrief(
  state: string,
  forState: Voice[],
  dutiesWithData: readonly Duty[],
  byDuty: Record<string, Voice[]>
): string {
  const lines: string[] = [
    `ISEYC 2027 Civic Mandate — State Civic Brief`,
    `State: ${state}`,
    `Published demands: ${forState.length}`,
    ``,
    `Not a poll. Not a ranking. Not an endorsement.`,
    `Public memory of what citizens asked public office to deliver.`,
    ``,
  ];

  for (const d of dutiesWithData) {
    const items = byDuty[d.id] || [];
    lines.push(`${d.label} (${items.length})`);
    for (const { office, items: officeItems } of groupByOffice(items)) {
      lines.push(`  [${office}]`);
      for (const v of officeItems) {
        const place = v.lga ? ` (${v.lga})` : "";
        lines.push(`  - "${v.sentence}"${place}`);
      }
    }
    lines.push("");
  }

  lines.push(`Brief: ${briefUrl(state)}`);
  lines.push(`Responsibility map: https://2027-street-mandate.vercel.app/map`);
  lines.push(`Submit: https://2027-street-mandate.vercel.app/`);
  return lines.join("\n");
}

function buildShortBrief(state: string, forState: Voice[]): string {
  const lines: string[] = [
    `ISEYC 2027 Civic Mandate — ${state}`,
    `${forState.length} published demand(s) for public delivery.`,
    `Not a poll. Not a ranking. Not an endorsement.`,
    ``,
  ];

  const preview = forState.slice(0, 5);
  for (const v of preview) {
    const duty = v.duty || v.mandate || "Duty";
    const place = v.lga ? ` · ${v.lga}` : "";
    const cut = v.sentence.length > 100 ? `${v.sentence.slice(0, 97)}…` : v.sentence;
    lines.push(`• [${duty}] "${cut}"${place}`);
  }
  if (forState.length > 5) {
    lines.push(`…and ${forState.length - 5} more on the full brief.`);
  }
  if (forState.length === 0) {
    lines.push(`No published mandates from ${state} yet. Add yours after ISEYC review.`);
  }

  lines.push(``);
  lines.push(`Full brief: ${briefUrl(state)}`);
  lines.push(`Submit a demand: https://2027-street-mandate.vercel.app/`);
  return lines.join("\n");
}

function BriefInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramState = searchParams.get("state");
  const initial =
    paramState && (STATES as readonly string[]).includes(paramState) ? paramState : "Kaduna";

  const [voices, setVoices] = useState<Voice[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (paramState && (STATES as readonly string[]).includes(paramState) && paramState !== state) {
      setState(paramState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramState]);

  useEffect(() => {
    let alive = true;
    fetch("/api/pulse")
      .then(async (r) => {
        if (!r.ok) throw new Error("Brief unavailable");
        return r.json();
      })
      .then((d) => {
        if (!alive) return;
        if (d?.error || !Array.isArray(d?.voices)) {
          throw new Error("Malformed pulse payload");
        }
        setError(false);
        setVoices(d.voices);
        setTotal(typeof d.total === "number" ? d.total : d.voices.length);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function onStateChange(next: string) {
    setState(next);
    router.replace(`/brief?state=${encodeURIComponent(next)}`, { scroll: false });
  }

  const forState = useMemo(
    () => voices.filter((v) => v.state === state),
    [voices, state]
  );

  const byDuty = useMemo(() => {
    const map: Record<string, Voice[]> = {};
    for (const d of DUTIES) map[d.id] = [];
    for (const v of forState) {
      const duty = v.duty || v.mandate || "Other";
      if (!map[duty]) map[duty] = [];
      map[duty].push(v);
    }
    return map;
  }, [forState]);

  const dutiesWithData = DUTIES.filter((d) => (byDuty[d.id] || []).length > 0);
  const shortText = useMemo(() => buildShortBrief(state, forState), [state, forState]);
  const url = briefUrl(state);

  async function copyBrief() {
    const text = buildPlainBrief(state, forState, dutiesWithData, byDuty);
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert(text);
    }
  }

  async function onNativeShare() {
    const result = await shareNative({
      title: `ISEYC Civic Brief — ${state}`,
      text: shortText,
      url,
    });
    if (result === "copied") {
      alert("Copied. Paste into Instagram, TikTok, or any app.");
    }
  }

  if (error) {
    return (
      <main className="px-4 py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
          Data for delivery
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-forest-900">State Civic Brief</h1>
        <div className="mt-6 border-y border-forest-500/15 bg-forest-50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-forest-800">
            State Civic Brief is temporarily unavailable.
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-forest-600">
            Published civic records could not be loaded. This is a service problem, not an empty
            state record. No zero count is shown as if no mandates exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600 no-print">
        Data for delivery
      </p>
      <h1 className="print-title mt-1 font-display text-2xl font-bold text-forest-900">
        State Civic Brief — {state}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-forest-700/90">
        Published citizen demands for one state, grouped by duty, then by office. Public memory —
        not a poll, ranking, or endorsement. Share with ward groups, not as a scoreboard.
      </p>
      <p className="mt-2 text-xs text-forest-600 no-print">
        Unsure which office owns a duty?{" "}
        <Link href="/map" className="font-semibold underline underline-offset-2">
          Open the responsibility map
        </Link>
        .
      </p>

      <label className="mt-6 block text-xs font-semibold text-forest-700 no-print">
        State
        <select
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          className="mt-1.5 min-h-[48px] w-full rounded-md border border-forest-500/15 bg-white px-3 text-sm text-forest-900 outline-none focus:border-forest-500"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-forest-500/10 py-3 text-xs text-forest-600">
        {loading ? (
          <span>Loading published records…</span>
        ) : (
          <span>
            <strong className="tabular-nums text-forest-800">{forState.length}</strong> published
            from {state}
            {total === 0 ? (
              <span className="text-forest-500"> · national wall is empty (not a failure)</span>
            ) : (
              <span className="text-forest-500"> · {total} published nationally on this wall</span>
            )}
          </span>
        )}
      </div>

      {!loading ? (
        <div className="mt-3 grid grid-cols-2 gap-2 no-print sm:grid-cols-3">
          <button
            type="button"
            onClick={() => shareWhatsApp(shortText)}
            className="min-h-[40px] rounded-md bg-forest-500 px-2 text-[11px] font-bold text-white"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() =>
              shareX(
                `ISEYC Civic Brief — ${state}: ${forState.length} published demand(s). Not a poll. ${url}`
              )
            }
            className="min-h-[40px] rounded-md bg-forest-900 px-2 text-[11px] font-bold text-cream"
          >
            X
          </button>
          <button
            type="button"
            onClick={() => shareFacebook(url)}
            className="min-h-[40px] rounded-md border border-forest-500/25 bg-white px-2 text-[11px] font-semibold text-forest-800"
          >
            Facebook
          </button>
          <button
            type="button"
            onClick={() => shareLinkedIn(url)}
            className="min-h-[40px] rounded-md border border-forest-500/25 bg-white px-2 text-[11px] font-semibold text-forest-800"
          >
            LinkedIn
          </button>
          <button
            type="button"
            onClick={onNativeShare}
            className="min-h-[40px] rounded-md border border-forest-500/25 bg-cream px-2 text-[11px] font-semibold text-forest-700"
          >
            Share more
          </button>
          <button
            type="button"
            onClick={copyBrief}
            className="min-h-[40px] rounded-md border border-forest-500/25 bg-white px-2 text-[11px] font-semibold text-forest-800"
          >
            {copied ? "Copied" : "Copy full text"}
          </button>
          {forState.length > 0 ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="col-span-2 min-h-[40px] rounded-md border border-forest-500/25 bg-white px-2 text-[11px] font-semibold text-forest-800 sm:col-span-3"
            >
              Print / PDF
            </button>
          ) : null}
        </div>
      ) : null}

      {!loading && forState.length === 0 ? (
        <div className="mt-8 border border-dashed border-forest-500/20 py-10 text-center">
          <p className="text-sm font-medium text-forest-800">No published mandates from {state} yet</p>
          <p className="mt-2 text-xs leading-relaxed text-forest-500">
            Empty for this state is not a ranking and not a system failure. After ISEYC sets Status to
            Published, demands group here by duty and office.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-forest-700 underline underline-offset-2 no-print"
          >
            Submit a mandate →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {dutiesWithData.map((d) => {
            const items = byDuty[d.id] || [];
            const officeGroups = groupByOffice(items);
            return (
              <section key={d.id} className="print-block">
                <div className="mb-3 flex items-baseline justify-between border-b border-forest-500/15 pb-2">
                  <h2 className="font-display text-base font-bold text-forest-800">{d.label}</h2>
                  <span className="text-[11px] tabular-nums text-forest-500">
                    {items.length} demand{items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="space-y-4">
                  {officeGroups.map(({ office, items: officeItems }) => (
                    <div key={office} className="print-block">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-forest-500">
                        {office}
                      </p>
                      <ul className="space-y-2.5">
                        {officeItems.map((v) => (
                          <li key={v.id}>
                            <div className="block border border-forest-500/12 bg-white px-3 py-3">
                              <p className="text-sm leading-snug text-forest-900">
                                “{v.sentence}”
                              </p>
                              {v.lga ? (
                                <p className="mt-1.5 text-[10px] text-forest-500">{v.lga}</p>
                              ) : null}
                              <Link
                                href={`/mandate/${v.id}`}
                                className="mt-1 inline-block text-[10px] text-forest-500 underline no-print"
                              >
                                Open record →
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-10 border-t border-forest-500/10 pt-6 text-xs leading-relaxed text-forest-500 no-print">
        <p className="font-semibold text-forest-700">How this helps in the field</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>WhatsApp, X, Facebook, LinkedIn — share the brief, not a scoreboard.</li>
          <li>Share more opens the phone sheet (Instagram, TikTok, Messages…).</li>
          <li>Copy full text or Print / PDF for offline meetings.</li>
          <li>Counts are published demands only — not votes or popularity.</li>
          <li>
            <Link href="/map" className="font-semibold underline underline-offset-2">
              Responsibility map
            </Link>{" "}
            shows Primary / Shared / Unclear offices for each duty.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-[10px] text-forest-500">
        Non-partisan public record · ISEYC · Not an election poll or endorsement
      </p>

      <p className="mt-8 text-center no-print">
        <Link href="/" className="text-sm font-semibold text-forest-600 underline underline-offset-2">
          ← Back to Civic Mandate
        </Link>
      </p>
    </main>
  );
}

export default function BriefPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <div className="no-print">
        <Header />
      </div>
      <Suspense fallback={<main className="px-4 py-8 text-sm text-forest-600">Loading brief…</main>}>
        <BriefInner />
      </Suspense>
      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
