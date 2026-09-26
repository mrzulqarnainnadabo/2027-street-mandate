import type { Metadata } from "next";
import Link from "next/link";
import OperatorStaffNav from "@/components/operators/OperatorStaffNav";
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

function ToolCard({
  href,
  title,
  body,
  primary,
}: {
  href: string;
  title: string;
  body: string;
  primary?: boolean;
}) {
  return (
    <li
      className={
        primary
          ? "rounded-xl border-2 border-forest-700 bg-white p-4 shadow-sm"
          : "rounded-xl border border-forest-500/15 bg-white p-4"
      }
    >
      <Link
        href={href}
        className="block text-base font-bold text-forest-900 underline decoration-forest-500/30 underline-offset-2"
      >
        {title}
      </Link>
      <p className="mt-1.5 text-xs leading-relaxed text-forest-600">{body}</p>
      {primary ? (
        <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-gold-600">
          Primary review console
        </p>
      ) : null}
    </li>
  );
}

export default function OperatorsIndexPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8 pb-16">
      <OperatorStaffNav current="hub" />
      <div className="mb-6 flex items-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="" width={48} height={48} className="h-12 w-12" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC staff</p>
          <h1 className="font-display text-xl font-bold text-forest-900">Operator hub</h1>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-forest-700">
        Internal tools only. Do not share these URLs publicly.
      </p>

      <div className="mt-4 rounded-xl border border-forest-500/20 bg-cream/80 px-4 py-3 text-xs leading-relaxed text-forest-800">
        <p className="font-bold text-forest-900">Status</p>
        <p className="mt-1">
          Blueprint dual-review pilot: <strong>complete</strong>.
        </p>
        <p className="mt-1">
          Weekly State Civic Brief: <strong>live</strong>. Kaduna field seeds: Health, Power, Water
          (Published) — brief is no longer empty.
        </p>
        <p className="mt-1">
          Next: more real citizen demands via the public form → dual-review checklist → Status =
          Published. Share the brief with Street Reps as public memory, not a scoreboard.
        </p>
      </div>

      <h2 className="mt-8 text-[10px] font-bold uppercase tracking-widest text-forest-500">
        Review consoles
      </h2>
      <ul className="mt-3 space-y-3 text-sm">
        <ToolCard
          primary
          href="/operators/blueprint-review"
          title="Blueprint publication review"
          body="Dual review → publish → unpublish with reason. Requires operator session."
        />
        <ToolCard
          href="/operators/mandate-review"
          title="Mandate dual-review checklist"
          body="Review citizen demands before setting Notion Status = Published."
        />
        <ToolCard
          href="/operators/blueprint-pilot"
          title="Blueprint pilot checklist"
          body="Field contract and JSON validator for Stage 2 drafts."
        />
      </ul>

      <h2 className="mt-8 text-[10px] font-bold uppercase tracking-widest text-forest-500">
        Public surfaces
      </h2>
      <ul className="mt-3 space-y-3 text-sm">
        <ToolCard
          href="/brief?state=Kaduna"
          title="State Civic Brief (Kaduna)"
          body="Weekly field instrument — published demands by duty and office."
        />
        <ToolCard
          href="/blueprints"
          title="Public Blueprint Register"
          body="Published records only — what citizens see."
        />
        <ToolCard href="/" title="Civic Mandate" body="Citizen demand product." />
      </ul>

      <h2 className="mt-8 text-[10px] font-bold uppercase tracking-widest text-forest-500">
        Notion pilots
      </h2>
      <ul className="mt-3 space-y-2 rounded-xl border border-forest-500/15 bg-cream/50 p-4 text-xs">
        <li>
          <a
            href={CIVIC_RECORD_OPS_HUB_URL}
            className="font-semibold text-forest-800 underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Civic Record ops hub
          </a>
        </li>
        <li>
          <a
            href={BLUEPRINT_PILOT_NOTION_URL}
            className="font-semibold text-forest-800 underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Public Blueprint Register (Notion)
          </a>
        </li>
        <li>
          <a
            href={COMMITMENT_PILOT_NOTION_URL}
            className="font-semibold text-forest-800 underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Accountability Commitments
          </a>
        </li>
        <li>
          <a
            href={EVIDENCE_PILOT_NOTION_URL}
            className="font-semibold text-forest-800 underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Evidence Vault
          </a>
        </li>
        <li className="pt-2 text-[10px] text-forest-500">
          Mandate DB (production): {MANDATE_DATABASE_ID_KNOWN} — do not mix with Blueprint rows.
        </li>
      </ul>
    </div>
  );
}
