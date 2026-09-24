import type { Metadata } from "next";
import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Operator checklist | ISEYC",
  robots: { index: false, follow: false },
};

/**
 * Staff process page. Not linked from public header/footer.
 * Not a substitute for Notion access control or dual accounts.
 */
export default function OperatorsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="" width={48} height={48} className="h-12 w-12" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC staff</p>
          <h1 className="font-display text-xl font-bold text-forest-900">
            Dual-review checklist
          </h1>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-forest-700">
        Use this before setting Notion <strong>Status = Published</strong>. This page is for operators
        only. It is not a public product surface and must not be promoted as a citizen feature.
      </p>

      <div className="mt-6 space-y-5 text-sm text-forest-800">
        <section className="rounded-xl border border-forest-500/15 bg-white p-4">
          <h2 className="font-display text-base font-bold text-forest-900">Reviewer A — Substance</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>Demand is a concrete service or outcome (not a party slogan or empty insult)</li>
            <li>Duty matches the demand</li>
            <li>Office is plausible, or left as Not sure</li>
            <li>State (and LGA if any) coherent</li>
            <li>Not framed as an emergency ISEYC will dispatch</li>
          </ul>
        </section>

        <section className="rounded-xl border border-forest-500/15 bg-white p-4">
          <h2 className="font-display text-base font-bold text-forest-900">
            Reviewer B — Safety &amp; neutrality
          </h2>
          <p className="mt-1 text-[11px] text-forest-500">Different person from Reviewer A when possible.</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>Does not name a private individual as wrongdoer</li>
            <li>Does not allege a crime as verified fact</li>
            <li>Does not promote or attack a named candidate or party</li>
            <li>No hate or tribe/religion as campaign frame</li>
            <li>Text would not embarrass ISEYC if quoted on X</li>
          </ul>
        </section>

        <section className="rounded-xl border border-forest-500/15 bg-white p-4">
          <h2 className="font-display text-base font-bold text-forest-900">Publish</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>Record both reviewers (Notion comment: names + date)</li>
            <li>Set Status = Published</li>
            <li>Do not fill response-tracking fields unless running the five-record pilot</li>
          </ul>
        </section>

        <section className="rounded-xl border border-forest-500/15 bg-cream/80 p-4">
          <h2 className="font-display text-base font-bold text-forest-900">Solo operator</h2>
          <p className="mt-2 text-xs leading-relaxed">
            Publish only clean office/duty demands. Hold anything that names a person, party, or
            serious allegation until a second reviewer or counsel is available.
          </p>
        </section>

        <section className="rounded-xl border border-forest-500/15 bg-white p-4">
          <h2 className="font-display text-base font-bold text-forest-900">Reject or leave New</h2>
          <p className="mt-2 text-xs leading-relaxed">
            Slogans · pure attacks · incoherent text · content that is only campaign material.
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-forest-500/20 p-4 text-xs text-forest-600">
          <p className="font-semibold text-forest-800">Public product links (for checking after Publish)</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/" className="underline underline-offset-2">
                Civic Mandate home
              </Link>
            </li>
            <li>
              <Link href="/map" className="underline underline-offset-2">
                Responsibility map
              </Link>
            </li>
            <li>
              <Link href="/brief" className="underline underline-offset-2">
                State Civic Brief
              </Link>
            </li>
            <li>
              <Link href="/about" className="underline underline-offset-2">
                Charter
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-8 text-center text-[10px] text-forest-500">
        Process aid only · Not legal advice · Boundary Package dual-gate (EF-1)
      </p>
    </div>
  );
}
