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
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main className="px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-forest-900">Methodology</h1>
        <p className="mt-2 text-sm text-forest-600">{PRODUCT_NAME} · ISEYC</p>

        <div className="paper-card mt-6 space-y-5 rounded-2xl p-5 text-sm leading-relaxed text-forest-800">
          <section>
            <h2 className="font-display text-base font-bold text-forest-900">What ISEYC publishes</h2>
            <p className="mt-2">
              <strong>Published citizen demands</strong> ({PUBLISHED_DEMAND_LABEL}) after human
              review. Over time: source-backed <strong>Blueprints</strong> and{" "}
              <strong>Profiles</strong> under the same non-partisan rules.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-forest-900">What "Published" means</h2>
            <p className="mt-2">
              A submission was reviewed for clarity, public interest, safety, and non-partisanship,
              then marked Published. It is not proof of delivery, not a vote, and not an endorsement
              of any person or party.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-forest-900">Verification labels</h2>
            <ul className="mt-2 space-y-2">
              {VERIFICATION_STATES.map((v) => (
                <li key={v.id}>
                  <strong>{v.label}:</strong> {v.meaning}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-forest-900">What ISEYC does not endorse</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Candidates, parties, or tickets</li>
              <li>Rankings, match scores, or "best candidate" claims</li>
              <li>Pay-for-visibility or preferential publication</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-forest-900">Sources and corrections</h2>
            <p className="mt-2">
              Public political claims should carry inspectable sources. Request corrections via{" "}
              <a className="underline" href={`mailto:${ISEYC_EMAIL}`}>
                {ISEYC_EMAIL}
              </a>
              . We assess errors and safety issues; we do not silently rewrite history without a
              process.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-forest-900">Partnerships</h2>
            <p className="mt-2">
              Government, CSOs, NGOs, and parties may participate through equal process. Partners do
              not own the record, moderate competitors, or buy preferential ranking.
            </p>
          </section>
        </div>

        <p className="mt-8 text-center text-sm">
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
