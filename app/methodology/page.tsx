import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCT_NAME, ISEYC_EMAIL } from "@/lib/brand";
import { PUBLISHED_DEMAND_LABEL } from "@/lib/record-classes";
import { VERIFICATION_STATES } from "@/lib/verification";

export const metadata = {
  title: `Methodology | ${PRODUCT_NAME}`,
  description:
    "What ISEYC publishes, reviews, and does not endorse. Published demands, source-linked records, and institution-reviewed meaning.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl">
      <Header />
      <main className="px-4 py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          Institutional charter
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-bold text-forest-900">Methodology</h1>
        <p className="mt-1 text-sm text-forest-600">{PRODUCT_NAME} · ISEYC</p>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-forest-800">
          <section className="border-b border-forest-500/10 pb-5">
            <h2 className="font-display text-base font-bold text-forest-900">What we publish</h2>
            <p className="mt-2">
              <strong>Published citizen demands</strong> ({PUBLISHED_DEMAND_LABEL}) after human
              review. Over time: source-backed <strong>Blueprints</strong> and{" "}
              <strong>Profiles</strong> under the same non-partisan rules.
            </p>
          </section>

          <section className="border-b border-forest-500/10 pb-5">
            <h2 className="font-display text-base font-bold text-forest-900">How review works</h2>
            <p className="mt-2">
              A submission is reviewed for clarity, public interest, safety, and non-partisanship,
              then marked Published. It is not proof of delivery, not a vote, and not an endorsement
              of any person or party.
            </p>
          </section>

          <section className="border-b border-forest-500/10 pb-5">
            <h2 className="font-display text-base font-bold text-forest-900">Verification</h2>
            <ul className="mt-2 space-y-2">
              {VERIFICATION_STATES.map((v) => (
                <li key={v.id}>
                  <strong>{v.label}:</strong> {v.meaning}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-b border-forest-500/10 pb-5">
            <h2 className="font-display text-base font-bold text-forest-900">What we do not do</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Endorse candidates, parties, or tickets</li>
              <li>Publish rankings, match scores, or "best candidate" claims</li>
              <li>Sell pay-for-visibility or preferential publication</li>
            </ul>
          </section>

          <section className="border-b border-forest-500/10 pb-5">
            <h2 className="font-display text-base font-bold text-forest-900">Corrections &amp; sources</h2>
            <p className="mt-2">
              Public political claims should carry inspectable sources. Request corrections via{" "}
              <a className="font-semibold underline" href={`mailto:${ISEYC_EMAIL}`}>
                {ISEYC_EMAIL}
              </a>
              . We assess errors and safety issues; we do not silently rewrite history without a
              process.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-forest-900">Non-partisanship</h2>
            <p className="mt-2">
              Government, CSOs, NGOs, and parties may participate through equal process. Partners do
              not own the record, moderate competitors, or buy preferential ranking.
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-sm">
          <Link href="/about" className="font-semibold underline underline-offset-2">
            Full non-partisan charter
          </Link>
          {" · "}
          <Link href="/" className="font-semibold underline underline-offset-2">
            Home
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
