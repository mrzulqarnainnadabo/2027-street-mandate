import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublishedExplorer from "@/components/PublishedExplorer";
import Link from "next/link";
import PilotNotice from "@/components/PilotNotice";

export const metadata = {
  title: "Explore published demands · Civic Mandate Nigeria",
  description:
    "Browse human-reviewed published civic demands by duty and state. Pilot public record — not a poll or ranking.",
};

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <PilotNotice />
        <div className="border-b border-forest-500/10 px-4 py-5">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs text-forest-600">
                <Link href="/" className="font-semibold text-forest-800 underline-offset-2 hover:underline">
                  Home
                </Link>
                {" · "}
                Explore
              </p>
              <h1 className="mt-1 font-display text-xl font-bold text-forest-900 sm:text-2xl">
                Published civic demands
              </h1>
              <p className="mt-1 max-w-xl text-sm text-forest-700">
                Human-reviewed public records by duty and place. Not a poll, ranking or proof of delivery.
              </p>
            </div>
            <Link
              href="/#mandate-form"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-forest-800 px-4 text-sm font-semibold text-cream"
            >
              Submit a demand
            </Link>
          </div>
        </div>
        <PublishedExplorer />
        <div className="mx-auto max-w-3xl px-4 pb-10 text-xs leading-relaxed text-forest-600">
          <p>
            A published demand is what a citizen asked public office to deliver after ISEYC review.
            It is not proof of government action, not a vote, and not an endorsement.
          </p>
          <p className="mt-2">
            <Link href="/methodology" className="font-semibold underline underline-offset-2">
              Methodology
            </Link>
            {" · "}
            <Link href="/intelligence" className="font-semibold underline underline-offset-2">
              Civic intelligence aggregates
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
