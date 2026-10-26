import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublishedExplorer from "@/components/PublishedExplorer";
import Link from "next/link";

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
        <div className="border-b border-forest-500/10 px-4 py-4">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-forest-600">
              <Link href="/" className="font-semibold text-forest-800 underline-offset-2 hover:underline">
                Home
              </Link>
              {" · "}
              Explore
            </p>
            <Link
              href="/#mandate-form"
              className="inline-flex min-h-[40px] items-center rounded-md bg-forest-800 px-3 text-xs font-semibold text-cream"
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
