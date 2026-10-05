import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STATES } from "@/lib/constants";
import { PRODUCT_NAME } from "@/lib/brand";
import StatesSearch from "@/components/StatesSearch";

export const metadata = {
  title: `States & FCT | ${PRODUCT_NAME}`,
  description:
    "Browse Nigeria's 36 states and the FCT. Open a State Civic Brief of published citizen demands — not votes or rankings.",
};

export default function StatesPage() {
  const list = [...STATES];

  return (
    <div className="mx-auto min-h-screen max-w-3xl">
      <Header />
      <main className="px-4 py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          National civic directory
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-bold text-forest-900">
          States &amp; FCT
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-forest-700">
          Select a state to open its <strong>State Civic Brief</strong> — published delivery demands
          only. Counts are not votes. This is public memory, not a scoreboard.
        </p>

        <div className="mt-6">
          <StatesSearch states={list} />
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {list.map((state) => (
            <li key={state}>
              <Link
                href={`/brief?state=${encodeURIComponent(state)}`}
                className="flex min-h-[48px] items-center justify-between rounded-md border border-forest-500/12 bg-white px-3 py-2.5 text-sm font-semibold text-forest-800 transition hover:border-forest-500/30 hover:bg-forest-50"
              >
                <span>{state}</span>
                <span className="text-[10px] font-medium text-forest-400" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-xs text-forest-600">
          <Link href="/" className="font-semibold underline underline-offset-2">
            Submit a demand
          </Link>
          {" · "}
          <Link href="/methodology" className="font-semibold underline underline-offset-2">
            Methodology
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
