import type { Metadata } from "next";
import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";
import { NOT_PUBLICLY_SPECIFIED } from "@/lib/civic-record/types";
import BlueprintReviewConsole from "@/components/operators/BlueprintReviewConsole";
import OperatorStaffNav from "@/components/operators/OperatorStaffNav";

export const metadata: Metadata = {
  title: "Blueprint review | ISEYC operators",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const gates = [
  [
    "Reviewer A — source fidelity",
    [
      "The cited source is public and inspectable.",
      "The proposal text faithfully represents the source.",
      "One discrete proposal is recorded per row.",
      `Missing facts are recorded as ${NOT_PUBLICLY_SPECIFIED}.`,
      "Office, policy area and geography are supported by the source or methodology.",
    ],
  ],
  [
    "Reviewer B — neutrality & publication safety",
    [
      "No ISEYC praise, attack, endorsement or campaign framing.",
      "No ranking, score, match percentage or electability language.",
      "The record does not turn an actor statement into an ISEYC factual claim.",
      "No private/internal reviewer information is being placed in public fields.",
      "The source and version are sufficient for later audit.",
    ],
  ],
] as const;

export default function BlueprintReviewPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 pb-16">
      <OperatorStaffNav current="blueprint-review" />
      <div className="flex items-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="" width={48} height={48} className="h-12 w-12" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC staff</p>
          <h1 className="font-display text-xl font-bold text-forest-900">
            Blueprint publication review
          </h1>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-forest-700">
        Dual review → publish → public register. Server actions only; each step reloads authoritative Notion state.
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-forest-500">
        Order: 1 Approve A · 2 Approve B (different person) · 3 Publish · then Hold/Reject to clean up tests
      </p>

      <BlueprintReviewConsole />

      <div className="mt-10 space-y-4">
        {gates.map(([title, items]) => (
          <section key={title} className="rounded-xl border border-forest-500/15 bg-white p-5">
            <h2 className="font-display font-bold text-forest-900">{title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-forest-800">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-center text-xs">
        <Link href="/operators" className="font-semibold text-forest-700 underline underline-offset-2">
          ← Operator hub
        </Link>
      </p>
    </main>
  );
}
