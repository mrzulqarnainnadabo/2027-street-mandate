import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCT_NAME } from "@/lib/brand";
import { VERIFICATION_STATES } from "@/lib/verification";

export const metadata = {
  title: `Public Profiles | ${PRODUCT_NAME}`,
  description:
    "Source-backed public information records — not endorsements, rankings, or campaign pages. ISEYC does not recommend who to vote for.",
};

export default function ProfilesPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main className="px-4 py-8">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gold-600">
          Layer 3 · foundation
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-forest-900">
          Public profiles
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-forest-700">
          Structured, source-backed information records for public-office seekers and related
          figures. <strong>Not campaign pages.</strong> Not rankings. Not "who to vote for."
        </p>

        <div className="paper-card mt-6 rounded-2xl p-5 text-sm text-forest-800">
          <h2 className="font-display text-base font-bold text-forest-900">
            Verification states (public meaning)
          </h2>
          <ul className="mt-3 space-y-3">
            {VERIFICATION_STATES.map((v) => (
              <li key={v.id} className="border-l-2 border-forest-500/30 pl-3">
                <div className="font-semibold text-forest-900">{v.label}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-forest-600">{v.meaning}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-medium text-forest-600">
            There is no "ISEYC endorsed" badge. Institution-reviewed never means support or
            electability.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-forest-500/25 bg-forest-50/50 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-forest-800">No public profiles published yet</p>
          <p className="mt-2 text-xs leading-relaxed text-forest-600">
            Profiles will appear here only after source-linked data and human review. Empty is
            honest. We will not invent candidates or parties.
          </p>
        </div>

        <div className="mt-8 space-y-2 text-center text-sm">
          <Link
            href="/blueprints"
            className="block font-semibold text-forest-700 underline underline-offset-2"
          >
            Public Blueprint Register
          </Link>
          <Link href="/" className="block font-semibold text-forest-600 underline underline-offset-2">
            ← Citizen demands (Mandate)
          </Link>
          <Link
            href="/methodology"
            className="block text-xs font-medium text-forest-500 underline underline-offset-2"
          >
            Methodology
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
