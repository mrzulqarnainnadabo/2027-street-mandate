import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CIVIC_BRAIN_URL, ISEYC_SEAL_SRC } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Civic Learning | Civic Mandate Nigeria",
  description: "Understand constitutional rights, citizen responsibilities, public institutions and non-partisan civic participation in Nigeria.",
};

const VALUES = ["Discipline", "Integrity", "Dignity of labour", "Social justice", "Religious tolerance", "Self-reliance", "Patriotism"];

const SOURCES = [
  { title: "Constitution of the Federal Republic of Nigeria", publisher: "Federal Government of Nigeria · National Library repository", href: "https://nigeriareposit.nln.gov.ng/items/399df25a-52d0-4972-9365-c618cd3ddf5f", note: "Fundamental rights, duties of citizens, institutions and distribution of powers" },
  { title: "Constitution chapters and schedules", publisher: "Senate Committee on Constitution Review", href: "https://sccr.gov.ng/?page_id=111", note: "Federal, state and local government structures and legislative powers" },
  { title: "Freedom of Information Act 2011", publisher: "Federal Ministry of Justice", href: "https://www.justice.gov.ng/freedom-of-information-portal/", note: "Public access to records held by public institutions" },
  { title: "Voter education and guidelines", publisher: "Independent National Electoral Commission", href: "https://www.inecnigeria.org/voters/education", note: "Voter rights, electoral procedures and official guidance" },
  { title: "National Orientation Agency", publisher: "Federal Government of Nigeria", href: "https://www.noa.gov.ng/about", note: "Citizenship, national values, unity and civic responsibilities" },
  { title: "National Ethics and Integrity Policy", publisher: "Independent Corrupt Practices Commission", href: "https://icpc.gov.ng/wp-content/uploads/2024/10/National-Ethics-and-Integrity-Policy_Nigeria-at-60.pdf", note: "National ethics and the values named in Section 23 of the Constitution" },
];

function LearningCard({ number, title, subtitle, children, id }: { number: string; title: string; subtitle: string; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-forest-500/12 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-950 font-display text-sm font-bold text-gold-300">{number}</span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-700">{subtitle}</p>
          <h2 className="mt-1 font-display text-xl font-bold text-forest-950">{title}</h2>
          <div className="mt-3 text-sm leading-relaxed text-forest-700">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function CivicLearningPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-forest-950 px-4 py-10 text-cream sm:py-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-gold-400/15" />
          <div className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rounded-full border border-gold-400/10" />
          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-center gap-3">
              <img src={ISEYC_SEAL_SRC} alt="ISEYC official seal" width={42} height={42} className="h-10 w-10 rounded-full bg-white object-contain p-0.5" />
              <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">ISEYC · Civic Mandate Nigeria</p><p className="text-[10px] text-cream/60">Non-partisan civic learning</p></div>
            </div>
            <div className="mt-8 max-w-3xl">
              <h1 className="font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Know your rights. Understand your duties. Shape the country we share.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">Civic life is more than elections. It is understanding the Constitution, knowing how public institutions work, taking part responsibly and holding public service to account.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#rights" className="inline-flex min-h-11 items-center rounded-md bg-gold-400 px-4 text-sm font-bold text-forest-950">Start learning <span aria-hidden="true" className="ml-2">↓</span></a>
                <Link href="/#mandate-form" className="inline-flex min-h-11 items-center rounded-md border border-white/25 px-4 text-sm font-semibold text-cream hover:bg-white/10">Submit a public-service demand</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <div className="grid gap-3 lg:grid-cols-2">
            <LearningCard number="01" title="Your rights" subtitle="The Constitution · Chapter IV" id="rights">
              <p>The Constitution sets out fundamental rights and protections. Learn what they cover, where they apply and which public institutions have responsibilities to respect them.</p>
              <a className="mt-3 inline-flex text-xs font-bold text-forest-800 underline underline-offset-4" href={SOURCES[0].href} target="_blank" rel="noreferrer">Read the Constitution ↗</a>
            </LearningCard>

            <LearningCard number="02" title="Your responsibilities" subtitle="The Constitution · Section 24" id="responsibilities">
              <p>Citizenship carries responsibilities as well as rights. Section 24 sets out duties of citizens, including respect for the Constitution, national ideals and the rights of others.</p>
              <a className="mt-3 inline-flex text-xs font-bold text-forest-800 underline underline-offset-4" href={SOURCES[0].href} target="_blank" rel="noreferrer">Read the constitutional duties ↗</a>
            </LearningCard>

            <LearningCard number="03" title="How government works" subtitle="Federal · State · Local" id="government">
              <p>Nigeria's Constitution distributes powers and responsibilities across different levels and institutions. Before directing a concern, understand whether it belongs to a federal, state or local responsibility — and when duties are shared.</p>
              <a className="mt-3 inline-flex text-xs font-bold text-forest-800 underline underline-offset-4" href={SOURCES[1].href} target="_blank" rel="noreferrer">Explore the constitutional structure ↗</a>
            </LearningCard>

            <LearningCard number="04" title="How to participate" subtitle="Informed · Peaceful · Accountable" id="participation">
              <p>Participate through informed voting, public hearings, community engagement, responsible reporting and lawful requests for public information. Check official instructions before acting.</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold">
                <a className="text-forest-800 underline underline-offset-4" href={SOURCES[3].href} target="_blank" rel="noreferrer">INEC voter education ↗</a>
                <a className="text-forest-800 underline underline-offset-4" href={SOURCES[2].href} target="_blank" rel="noreferrer">Freedom of Information ↗</a>
              </div>
            </LearningCard>

            <LearningCard number="05" title="Patriotism & shared values" subtitle="National ethics · Section 23" id="patriotism">
              <p>Patriotism is not party loyalty. It is a commitment to the common good, expressed through service, integrity, respect, tolerance and responsibility for the country we share.</p>
              <div className="mt-3 flex flex-wrap gap-2">{VALUES.map((value) => <span key={value} className="rounded-full border border-forest-500/15 bg-forest-50 px-2.5 py-1 text-[10px] font-semibold text-forest-800">{value}</span>)}</div>
              <a className="mt-3 inline-flex text-xs font-bold text-forest-800 underline underline-offset-4" href={SOURCES[5].href} target="_blank" rel="noreferrer">Read the National Ethics and Integrity Policy ↗</a>
            </LearningCard>

            <LearningCard number="06" title="Understand public information" subtitle="Evidence before conclusion" id="public-information">
              <p>Separate an announcement from implementation, a published report from independent verification, and a national estimate from a local fact. Ask: who published it, when, for which place and using what method?</p>
              <Link className="mt-3 inline-flex text-xs font-bold text-forest-800 underline underline-offset-4" href="/methodology">How Civic Mandate reviews public records ↗</Link>
            </LearningCard>
          </div>

          <section className="mt-10" aria-labelledby="pathway-heading">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">From understanding to action</p>
            <h2 id="pathway-heading" className="mt-1 font-display text-2xl font-bold text-forest-950">A practical civic pathway</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {[
                ["01", "Learn", "Know your rights and responsibilities."],
                ["02", "Observe", "Describe a condition clearly and safely."],
                ["03", "Ask", "State what a public institution should deliver."],
                ["04", "Follow", "Track public records and evidence over time."],
              ].map(([number, title, description]) => <div key={number} className="rounded-lg border border-forest-500/12 bg-white p-4"><span className="font-display text-xl font-bold text-gold-700">{number}</span><h3 className="mt-2 text-sm font-bold text-forest-950">{title}</h3><p className="mt-1 text-xs leading-relaxed text-forest-600">{description}</p></div>)}
            </div>
          </section>

          <section className="mt-10 rounded-xl bg-forest-950 p-5 text-cream sm:p-7" aria-labelledby="systems-heading">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">ISEYC civic systems</p>
            <h2 id="systems-heading" className="mt-1 font-display text-2xl font-bold">One civic journey. Three connected layers.</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-white/12 bg-white/[0.05] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-300">01 · Record</p><h3 className="mt-2 font-display text-lg font-bold">Civic Mandate Nigeria</h3><p className="mt-2 text-xs leading-relaxed text-cream/70">Citizens record what their communities experience and what public institutions are asked to address.</p><Link href="/#mandate-form" className="mt-3 inline-flex text-xs font-bold text-gold-300 underline underline-offset-4">Submit a demand ↗</Link></div>
              <div className="rounded-lg border border-white/12 bg-white/[0.05] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-300">02 · Interpret</p><h3 className="mt-2 font-display text-lg font-bold">Civic Brain</h3><p className="mt-2 text-xs leading-relaxed text-cream/70">Understand published records, compare them with available evidence and see what remains unknown.</p><a href={CIVIC_BRAIN_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gold-300 underline underline-offset-4">Open Civic Brain ↗</a></div>
              <div className="rounded-lg border border-white/12 bg-white/[0.05] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-300">03 · Explore</p><h3 className="mt-2 font-display text-lg font-bold">Civic Intelligence Observatory</h3><p className="mt-2 text-xs leading-relaxed text-cream/70">The national evidence library is being built to connect official data, community records and transparent research methods.</p><span className="mt-3 inline-flex text-xs font-semibold text-cream/55">Evidence foundation in development</span></div>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="source-heading">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">Primary references</p><h2 id="source-heading" className="mt-1 font-display text-xl font-bold text-forest-950">Learn from authoritative sources</h2></div><span className="text-[10px] text-forest-500">Official and legal references</span></div>
            <div className="mt-3 divide-y divide-forest-500/10 rounded-xl border border-forest-500/12 bg-white px-4">
              {SOURCES.map((source) => <a key={source.title} href={source.href} target="_blank" rel="noreferrer" className="flex flex-wrap items-center justify-between gap-3 py-3"><span className="min-w-0"><strong className="block text-sm text-forest-900">{source.title}</strong><span className="mt-0.5 block text-[11px] text-forest-500">{source.publisher} · {source.note}</span></span><span className="shrink-0 text-xs font-bold text-forest-800">Open ↗</span></a>)}
            </div>
          </section>

          <p className="mt-8 rounded-lg border border-forest-500/15 bg-white p-4 text-xs leading-relaxed text-forest-600">This learning hub provides general civic education, not legal advice. Constitutional provisions, electoral procedures and administrative rules may be amended. Always consult the current law and official notices before relying on a specific rule.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#mandate-form" className="inline-flex min-h-11 items-center rounded-md bg-forest-900 px-4 text-sm font-bold text-white">Submit a public-service demand</Link>
            <Link href="/report" className="inline-flex min-h-11 items-center rounded-md border border-forest-500/20 bg-white px-4 text-sm font-semibold text-forest-800">Report a community observation</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
