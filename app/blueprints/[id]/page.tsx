import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlueprint } from "@/lib/civic-record/fetch-published-blueprints";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blueprint = await getPublishedBlueprint(id);
  return {
    title: blueprint ? `${blueprint.actorDisplayName} — Public Blueprint | ISEYC` : "Blueprint record | ISEYC",
    robots: blueprint ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function BlueprintDetailPage({ params }: Props) {
  const { id } = await params;
  const blueprint = await getPublishedBlueprint(id);
  if (!blueprint) notFound();

  const rows = [
    ["Office sought", blueprint.officeSought],
    ["Political platform", blueprint.politicalPlatform],
    ["Policy area", blueprint.dutyOrPolicyArea],
    ["Mechanism", blueprint.mechanism],
    ["Target", blueprint.target],
    ["Timeline", blueprint.timeline],
    ["Funding", blueprint.funding],
    ["Responsible institution", blueprint.responsibleInstitution],
    ["Geographic scope", blueprint.geographyScope],
  ];

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/blueprints" className="text-xs font-bold text-forest-700 underline underline-offset-2">← Public Blueprint Register</Link>
      <header className="mt-6 border-b border-forest-500/15 pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">Public record · Published</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900">{blueprint.actorDisplayName}</h1>
        <p className="mt-2 text-sm text-forest-600">{blueprint.officeSought} · {blueprint.dutyOrPolicyArea}</p>
      </header>

      <section className="mt-6 rounded-xl border border-forest-500/15 bg-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-forest-500">Documented proposal</p>
        <p className="mt-3 text-base leading-8 text-forest-900">{blueprint.proposalText}</p>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-forest-500/15 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-forest-500">{label}</p>
            <p className="mt-1 text-sm leading-relaxed text-forest-800">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-xl border border-forest-500/15 bg-white p-5">
        <h2 className="font-display text-base font-bold text-forest-900">Source & record metadata</h2>
        <dl className="mt-3 space-y-3 text-xs">
          <div><dt className="font-semibold text-forest-500">Source date</dt><dd className="mt-1 text-forest-800">{blueprint.sourceDate}</dd></div>
          <div><dt className="font-semibold text-forest-500">Version</dt><dd className="mt-1 text-forest-800">{blueprint.version}</dd></div>
          <div><dt className="font-semibold text-forest-500">Statement class</dt><dd className="mt-1 text-forest-800">{blueprint.statementClass.replaceAll("_", " ")}</dd></div>
          <div><dt className="font-semibold text-forest-500">Verification</dt><dd className="mt-1 text-forest-800">{blueprint.verification}</dd></div>
          <div><dt className="font-semibold text-forest-500">Source</dt><dd className="mt-1 break-all"><a className="text-forest-800 underline underline-offset-2" href={blueprint.sourceUrl} target="_blank" rel="noreferrer">{blueprint.sourceUrl}</a></dd></div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-forest-500/15 bg-cream/70 p-5 text-xs leading-relaxed text-forest-700">
        This page records what the cited source says. It is not an ISEYC endorsement, ranking, score, or voting recommendation.
      </section>
    </main>
  );
}
