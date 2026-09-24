import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlueprints } from "@/lib/civic-record/fetch-published-blueprints";
import { CIVIC_RECORD_DUTY_OPTIONS } from "@/lib/civic-record/duties";

export const metadata: Metadata = {
  title: "Public Blueprint Register | ISEYC",
  description: "A neutral public record of documented proposals from public office seekers.",
};

type Props = { searchParams: Promise<{ state?: string; office?: string; duty?: string }> };

export default async function BlueprintsPage({ searchParams }: Props) {
  const params = await searchParams;
  const data = await getPublishedBlueprints({
    state: params.state,
    office: params.office,
    duty: params.duty,
  });

  const offices = Array.from(new Set(data.proposals.map((p) => p.officeSought))).sort();
  const states = Array.from(new Set(data.proposals.map((p) => p.geographyScope))).sort();
  const duties = Array.from(new Set(data.proposals.map((p) => p.dutyOrPolicyArea))).sort();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="border-b border-forest-500/15 pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">ISEYC Civic Record</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900">Public Blueprint Register</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-forest-700">
          Documented public proposals, presented as public records rather than endorsements or rankings.
          Each published record has a source and a publication review.
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-forest-500/15 bg-white p-4">
        <form className="grid gap-3 sm:grid-cols-3" method="get">
          <label className="text-xs font-semibold text-forest-800">
            State / scope
            <select name="state" defaultValue={params.state || ""} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3">
              <option value="">All published</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-forest-800">
            Office
            <select name="office" defaultValue={params.office || ""} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3">
              <option value="">All offices</option>
              {offices.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-forest-800">
            Policy area
            <select name="duty" defaultValue={params.duty || ""} className="mt-1 min-h-11 w-full rounded-lg border border-forest-500/20 bg-white px-3">
              <option value="">All areas</option>
              {(duties.length ? duties : CIVIC_RECORD_DUTY_OPTIONS.map((d) => d.id)).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <div className="sm:col-span-3 flex gap-2">
            <button className="min-h-10 rounded-lg bg-forest-800 px-4 text-xs font-bold text-white" type="submit">Apply filters</button>
            <Link href="/blueprints" className="flex min-h-10 items-center rounded-lg border border-forest-500/20 px-4 text-xs font-semibold text-forest-800">Clear</Link>
          </div>
        </form>
      </section>

      <div className="mt-6 flex items-center justify-between text-xs text-forest-600">
        <span>{data.total} published record{data.total === 1 ? "" : "s"}</span>
        {data.truncated ? <span>Showing the current public record window.</span> : null}
      </div>

      {data.total === 0 ? (
        <section className="mt-4 rounded-xl border border-dashed border-forest-500/25 bg-cream/50 p-8">
          <h2 className="font-display text-lg font-bold text-forest-900">No published blueprint records yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-forest-700">
            This register only displays records that have completed the ISEYC publication process.
            Draft or unverified material is intentionally not shown.
          </p>
        </section>
      ) : (
        <section className="mt-4 grid gap-4">
          {data.proposals.map((p) => (
            <article key={p.id} className="rounded-xl border border-forest-500/15 bg-white p-5">
              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-forest-500">
                <span>{p.officeSought}</span><span>·</span><span>{p.dutyOrPolicyArea}</span><span>·</span><span>Version {p.version}</span>
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-forest-900">{p.actorDisplayName}</h2>
              <p className="mt-2 text-sm leading-relaxed text-forest-800">{p.proposalText}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-forest-600">
                <span>Source: {p.statementClass.replaceAll("_", " ")}</span>
                <span>{p.sourceDate}</span>
                <span>Verification: {p.verification}</span>
              </div>
              <Link href={`/blueprints/${p.id}`} className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-forest-500/20 px-4 text-xs font-bold text-forest-800">
                View public record
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
