import type { Metadata } from "next";
import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";
import {
  BLUEPRINT_PILOT_NOTION_URL,
  COMMITMENT_PILOT_NOTION_URL,
  EVIDENCE_PILOT_NOTION_URL,
  CIVIC_RECORD_OPS_HUB_URL,
  MANDATE_DATABASE_ID_KNOWN,
} from "@/lib/civic-record/notion-pilot-ids";

export const metadata: Metadata = {
  title: "Operators | ISEYC",
  robots: { index: false, follow: false },
};

export default function OperatorsIndexPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="" width={48} height={48} className="h-12 w-12" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC staff</p>
          <h1 className="font-display text-xl font-bold text-forest-900">Operator hub</h1>
        </div>
      </div>
      <p className="text-sm text-forest-700">
        Internal process pages and pilot databases. Not public product surfaces. Do not promote these
        URLs.
      </p>
      <ul className="mt-6 space-y-4 text-sm">
        <li className="rounded-xl border border-forest-500/15 bg-white p-4">
          <Link href="/operators/mandate-review" className="font-semibold text-forest-800 underline underline-offset-2">
            Mandate dual-review checklist
          </Link>
          <p className="mt-1 text-xs text-forest-600">Review before publishing citizen demands.</p>
        </li>
        <li className="rounded-xl border border-forest-500/15 bg-white p-4">
          <Link href="/operators/blueprint-pilot" className="font-semibold text-forest-800 underline underline-offset-2">
            Blueprint pilot checklist + JSON validator
          </Link>
          <p className="mt-1 text-xs text-forest-600">In-app Stage 2 workflow.</p>
        </li>
        <li className="rounded-xl border border-forest-500/15 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gold-600">Notion pilots</p>
          <ul className="mt-2 space-y-2 text-xs">
            <li><a href={CIVIC_RECORD_OPS_HUB_URL} className="font-semibold text-forest-800 underline underline-offset-2" target="_blank" rel="noreferrer">Civic Record ops hub page</a></li>
            <li><a href={BLUEPRINT_PILOT_NOTION_URL} className="font-semibold text-forest-800 underline underline-offset-2" target="_blank" rel="noreferrer">Public Blueprint Register</a></li>
            <li><a href={COMMITMENT_PILOT_NOTION_URL} className="font-semibold text-forest-800 underline underline-offset-2" target="_blank" rel="noreferrer">Accountability Commitments</a></li>
            <li><a href={EVIDENCE_PILOT_NOTION_URL} className="font-semibold text-forest-800 underline underline-offset-2" target="_blank" rel="noreferrer">Evidence Vault</a></li>
          </ul>
          <p className="mt-2 text-[10px] text-forest-500">Citizen Mandate DB (production): ${MANDATE_DATABASE_ID_KNOWN} — do not mix rows.</p>
        </li>
        <li className="rounded-xl border border-forest-500/15 bg-white p-4">
          <Link href="/" className="font-semibold text-forest-800 underline underline-offset-2">Civic Mandate (citizens)</Link>
          <p className="mt-1 text-xs text-forest-600">Live public demand product.</p>
        </li>
      </ul>
    </div>
  );
}
