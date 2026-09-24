import type { Metadata } from "next";
import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";
import { BLUEPRINT_DB_TITLE, BLUEPRINT_NOTION_PROPERTIES, BLUEPRINT_PILOT_RULES } from "@/lib/civic-record/blueprint-fields";
import { CIVIC_RECORD_MISSION, FORBIDDEN_PUBLIC_FEATURES, PAYMENT_NEVER_CHANGES } from "@/lib/civic-record/firewall";
import { NOT_PUBLICLY_SPECIFIED } from "@/lib/civic-record/types";

export const metadata: Metadata = {
  title: "Blueprint pilot | ISEYC operators",
  robots: { index: false, follow: false },
};

/**
 * Stage 2 — manual Public Blueprint pilot.
 * Staff only. Not linked from public nav.
 */
export default function BlueprintPilotPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="" width={48} height={48} className="h-12 w-12" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC staff · Stage 2</p>
          <h1 className="font-display text-xl font-bold text-forest-900">Public Blueprint pilot</h1>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-forest-700">{CIVIC_RECORD_MISSION}</p>

      <section className="mt-6 rounded-xl border border-forest-500/15 bg-white p-4 text-xs leading-relaxed text-forest-800">
        <h2 className="font-display text-base font-bold text-forest-900">Goal of this pilot</h2>
        <p className="mt-2">
          Document <strong>one</strong> public-figure dossier (e.g. published agenda / LabourDirect-style
          materials) into a <strong>separate</strong> Notion database using the fields below. Discover
          which fields are empty in the wild. Do not build ranking UI. Do not mix rows into the citizen
          Mandate database.
        </p>
        <p className="mt-2 font-semibold text-forest-900">Database title: {BLUEPRINT_DB_TITLE}</p>
      </section>

      <section className="mt-4 rounded-xl border border-forest-500/15 bg-white p-4">
        <h2 className="font-display text-base font-bold text-forest-900">Hard rules</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs text-forest-800">
          {BLUEPRINT_PILOT_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-forest-600">
          Empty public facts → write <code className="text-forest-900">{NOT_PUBLICLY_SPECIFIED}</code>
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-forest-500/15 bg-white p-4">
        <h2 className="font-display text-base font-bold text-forest-900">Notion properties to create</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs text-forest-800">
          {BLUEPRINT_NOTION_PROPERTIES.map((p) => (
            <li key={p.name}>
              <strong>{p.name}</strong> <span className="text-forest-500">({p.type})</span>
              <span className="block text-forest-600">{p.notes}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-4 rounded-xl border border-forest-500/15 bg-cream/80 p-4 text-xs">
        <h2 className="font-display text-base font-bold text-forest-900">Operator sequence</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-forest-800">
          <li>Collect public sources only (or written permission + public mirror).</li>
          <li>Create the Blueprint Notion DB; share with the same integration if desired.</li>
          <li>One row per discrete proposal (not one row for an entire manifesto).</li>
          <li>Dual review before Status = Published (substance + neutrality).</li>
          <li>Note which fields stayed {NOT_PUBLICLY_SPECIFIED} — that trains the real schema.</li>
          <li>No public website page until methodology is stable and counsel boundary is clear.</li>
        </ol>
      </section>

      <section className="mt-4 rounded-xl border border-dashed border-forest-500/25 p-4 text-xs text-forest-600">
        <h2 className="font-semibold text-forest-800">Forbidden on any future public Blueprint UI</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {FORBIDDEN_PUBLIC_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <h2 className="mt-3 font-semibold text-forest-800">Payment never changes</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {PAYMENT_NEVER_CHANGES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 flex flex-col items-center gap-2 text-center text-xs">
        <Link href="/operators" className="font-semibold text-forest-700 underline underline-offset-2">
          Mandate dual-review checklist
        </Link>
        <Link href="/" className="text-forest-600 underline underline-offset-2">
          Civic Mandate (citizens)
        </Link>
      </p>
    </div>
  );
}
