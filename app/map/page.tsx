import Link from "next/link";
import type { Metadata } from "next";
import { ISEYC_SEAL_SRC } from "@/lib/brand";
import {
  RESPONSIBILITY_MAP_VERSION,
  RESPONSIBILITY_ROWS,
} from "@/lib/responsibility-map";
import { NOT_PUBLICLY_SPECIFIED } from "@/lib/record-classes";

export const metadata: Metadata = {
  title: "Responsibility map | ISEYC Civic Mandate",
  description:
    "Sample duty-to-office map for Nigerian public delivery. Not rankings. Not law. Pilot classification only.",
};

function confidenceClass(c: string) {
  if (c === "Primary") return "bg-forest-500/10 text-forest-800";
  if (c === "Shared") return "bg-gold-500/15 text-forest-800";
  return "bg-forest-500/5 text-forest-600";
}

export default function ResponsibilityMapPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <img
          src={ISEYC_SEAL_SRC}
          alt="ISEYC"
          width={64}
          height={64}
          className="mb-3 h-16 w-16 rounded-full bg-white object-contain ring-1 ring-forest-500/15"
        />
        <h1 className="font-display text-2xl font-bold text-forest-900">Responsibility map</h1>
        <p className="mt-1 text-sm text-forest-600">Duty → office (pilot)</p>
        <p className="mt-3 max-w-md text-xs leading-relaxed text-forest-600">
          This page helps citizens see <strong>which office might deliver</strong> a duty. It is an{" "}
          <strong>ISEYC classification</strong> for navigation — not a court judgment, not a ranking of
          politicians, and not a complete legal textbook.
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-wide text-forest-500">
          Map version {RESPONSIBILITY_MAP_VERSION}
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-forest-500/15 bg-white px-4 py-3 text-xs leading-relaxed text-forest-700">
        <p className="font-semibold text-forest-900">How to read confidence</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>
            <strong>Primary</strong> — usually the first office to look to for delivery.
          </li>
          <li>
            <strong>Shared</strong> — more than one level of government is involved.
          </li>
          <li>
            <strong>Unclear</strong> — law or practice does not point to one desk; say{" "}
            {NOT_PUBLICLY_SPECIFIED} rather than invent blame.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        {RESPONSIBILITY_ROWS.map((row) => (
          <article
            key={row.duty}
            className="rounded-xl border border-forest-500/12 bg-white p-4 shadow-sm"
          >
            <h2 className="font-display text-lg font-bold text-forest-900">{row.duty}</h2>
            <p className="mt-1 text-sm italic text-forest-700">“{row.exampleDemand}”</p>

            <ul className="mt-3 space-y-2">
              {row.offices.map((o) => (
                <li
                  key={o.office + o.role}
                  className="flex flex-col gap-1 rounded-lg border border-forest-500/8 bg-cream/50 px-3 py-2 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{o.office}</p>
                    <p className="text-xs text-forest-600">{o.role}</p>
                  </div>
                  <span
                    className={`mt-1 inline-flex shrink-0 self-start rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${confidenceClass(o.confidence)}`}
                  >
                    {o.confidence}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[11px] leading-snug text-forest-500">{row.note}</p>
            <p className="mt-1 text-[10px] text-forest-400">{row.legalBasisHint}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-forest-500">
        Missing duties will show as {NOT_PUBLICLY_SPECIFIED} until mapped. This map will be versioned
        when law or practice changes. LEGAL REVIEW REQUIRED before treating any row as definitive.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 text-sm">
        <Link
          href="/"
          className="w-full max-w-xs rounded-md bg-forest-500 py-3 text-center font-bold text-white"
        >
          State your mandate
        </Link>
        <Link href="/about" className="text-xs font-semibold text-forest-700 underline underline-offset-2">
          Non-partisan charter
        </Link>
        <Link href="/brief" className="text-xs text-forest-600 underline underline-offset-2">
          State Civic Brief
        </Link>
      </div>
    </div>
  );
}
