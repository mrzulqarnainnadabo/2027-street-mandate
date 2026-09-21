"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DUTIES, STATES } from "@/lib/constants";

type Voice = {
  id: string;
  sentence: string;
  mandate: string;
  duty?: string;
  office?: string;
  state: string;
  lga?: string;
};

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

function buildPlainBrief(
  state: string,
  forState: Voice[],
  dutiesWithData: typeof DUTIES,
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

  lines.push(
    `Brief: https://2027-street-mandate.vercel.app/brief?state=${encodeURIComponent(state)}`
  );
  lines.push(`Submit: https://2027-street-mandate.vercel.app/`);
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
        setError(false);
        setVoices(d.voices || []);
        setTotal(typeof d.total === "number" ? d.total : (d.voices || []).length);
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

  async function copyBrief() {
    const text = buildPlainBrief(state, forState, dutiesWithData, byDuty);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(text);
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
            Published civic records could not be loaded. No empty or zero count is shown as if no
            mandates exist.
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
        not a poll, ranking, or endorsement.
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
            {total > 0 ? (
              <span className="text-forest-500"> · {total} published nationally on this wall</span>
            ) : null}
          </span>
        )}
        <div className="flex flex-wrap gap-2 no-print">
          {!loading && forState.length > 0 ? (
            <>
              <button
                type="button"
                onClick={copyBrief}
                className="min-h-[40px] rounded-md border border-forest-500/25 bg-white px-3 py-1.5 text-[11px] font-semibold text-forest-800"
              >
                {copied ? "Copied" : "Copy brief text"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[40px] rounded-md border border-forest-500/25 bg-white px-3 py-1.5 text-[11px] font-semibold text-forest-800"
              >
                Print / PDF
              </button>
            </>
          ) : null}
        </div>
      </div>

      {!loading && forState.length === 0 ? (
        <div className="mt-8 border border-dashed border-forest-500/20 py-10 text-center">
          <p className="text-sm text-forest-600">No published mandates from {state} yet.</p>
          <p className="mt-2 text-xs text-forest-500">
            After ISEYC sets Status to Published, demands group here by duty and office.
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
        <p className="font-semibold text-forest-700">How this helps</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Shareable link: /brief?state={state}</li>
          <li>Copy brief text for WhatsApp or X without ranking language.</li>
          <li>Print / PDF for meetings and ward briefings.</li>
          <li>Counts are published demands only — not votes or popularity.</li>
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
      <Suspense
        fallback={
          <main className="px-4 py-8 text-sm text-forest-600">Loading brief…</main>
        }
      >
        <BriefInner />
      </Suspense>
      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
