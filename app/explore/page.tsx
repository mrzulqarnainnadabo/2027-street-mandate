import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublishedExplorer from "@/components/PublishedExplorer";
import Link from "next/link";
import PilotNotice from "@/components/PilotNotice";

export const metadata = {
  title: "Explore Civic Mandate Nigeria",
  description:
    "Browse human-reviewed published civic demands by duty and state. Pilot public record — not a poll or ranking.",
};

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <PilotNotice />
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
        <section className="mx-auto max-w-3xl px-4 pb-5" aria-labelledby="explore-tools-heading">
          <div className="mb-3"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">Explore the public record</p><h1 id="explore-tools-heading" className="mt-1 font-display text-2xl font-bold text-forest-950">Civic tools & records</h1><p className="mt-1 text-xs text-forest-600">Move from community records to state briefs, public sources and methods.</p></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["/states", "States & FCT", "Browse public records by place."],
              ["/blueprints", "Public blueprints", "Read documented public proposals."],
              ["/profiles", "Public profiles", "Source-linked public information."],
              ["/intelligence", "Civic intelligence", "Understand published-record patterns."],
              ["/brief", "State briefs", "Create a brief from published records."],
              ["/tracked", "Tracked records", "Keep records on this device."],
            ].map(([href, title, description]) => <Link key={href} href={href} className="group rounded-lg border border-forest-500/12 bg-white p-3 transition hover:border-forest-500/35 hover:bg-forest-50/60"><span className="block text-sm font-bold text-forest-900">{title}</span><span className="mt-1 block text-[11px] leading-relaxed text-forest-600">{description}</span><span className="mt-2 block text-[10px] font-bold text-gold-700 group-hover:underline">Open ↗</span></Link>)}
          </div>
        </section>
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
