import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PilotNotice from "@/components/PilotNotice";
import { PRODUCT_NAME } from "@/lib/brand";

export const metadata = {
  title: `Citizen Guide | ${PRODUCT_NAME}`,
  description: "A concise, source-linked guide to constitutional rights, citizen responsibilities, public institutions and peaceful civic participation in Nigeria.",
};

const rights = [
  ["Life & dignity","Protection of life and human dignity.","Sections 33–34"],
  ["Liberty & fair hearing","Personal liberty, due process and fair hearing.","Sections 35–36"],
  ["Privacy & conscience","Private and family life; freedom of thought, conscience and religion.","Sections 37–38"],
  ["Expression & association","Freedom of expression, peaceful assembly and association.","Sections 39–40"],
  ["Movement & equality","Freedom of movement and protection from discrimination.","Sections 41–42"],
  ["Property & remedy","Property rights, lawful acquisition rules and access to court for rights enforcement.","Sections 43–46"],
] as const;
const duties = [
  ["Respect the Constitution","Abide by the Constitution and respect its ideals, institutions and legitimate authorities."],
  ["Defend the public good","Help protect Nigeria and render national service where lawfully required."],
  ["Respect other people","Respect the dignity, rights and legitimate interests of others."],
  ["Contribute to community","Make a positive and useful contribution to the community where you live."],
  ["Support lawful public order","Assist appropriate and lawful agencies in maintaining law and order."],
  ["Meet civic obligations","Declare income honestly and pay taxes promptly."],
] as const;
const sources = [
  {name:"Constitution of the Federal Republic of Nigeria",detail:"Chapter II, Section 24 and Chapter IV, Sections 33–46.",url:"https://nigeriarights.gov.ng/files/constitution.pdf"},
  {name:"Constitution Review — Senate Committee",detail:"Constitution chapters, institutions and amendment information.",url:"https://sccr.gov.ng/?page_id=111"},
  {name:"Updated Constitution — PLAC",detail:"1999 Constitution updated with the first to fifth alterations.",url:"https://placng.org/i/documents/constitution-of-the-federal-republic-of-nigeria-1999-updated-with-the-1st-2nd-3rd-4th-and-5th-alteration/"},
  {name:"Nigeria Government Portal",detail:"Overview of the executive, legislature, judiciary and federal system.",url:"https://services.gov.ng/about/government-and-politics"},
  {name:"National Orientation Agency",detail:"Public information, civic responsibility and national orientation resources.",url:"https://www.noa.gov.ng/about"},
];

export default function CitizenGuidePage() {
  return <div className="mx-auto min-h-screen max-w-5xl">
    <Header />
    <main>
      <section className="bg-gradient-to-br from-forest-950 via-forest-900 to-[#263d32] px-4 py-8 text-white sm:py-12">
        <div className="mx-auto max-w-4xl">
          <PilotNotice />
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[.18em] text-gold-300">ISEYC · Citizen learning</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">The Citizen Guide</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">Start with the Constitution. Understand who is responsible for public decisions. Learn how to participate peacefully and responsibly.</p>
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Citizen guide sections">
            {[["Rights","rights"],["Responsibilities","responsibilities"],["Government","government"],["Public resources","public-resources"],["Participation","participation"],["Patriotism","patriotism"]].map(([label,id])=><a key={id} href={`#${id}`} className="inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/5 px-3 text-xs font-semibold text-white hover:bg-white/10">{label}</a>)}
          </nav>
        </div>
      </section>

      <section id="rights" className="scroll-mt-24 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">01 · Constitutional protections</p><h2 className="mt-1 font-display text-2xl font-bold text-forest-950">Know your rights</h2></div><span className="rounded-full bg-forest-50 px-3 py-1.5 text-[10px] font-semibold text-forest-800">Chapter IV · Sections 33–46</span></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{rights.map(([title,description,section],i)=><article key={title} className="motion-card rounded-xl border border-forest-500/12 bg-white p-4 shadow-sm"><span className="font-mono text-xs font-bold text-gold-700">0{i+1}</span><h3 className="mt-3 font-display text-base font-bold text-forest-900">{title}</h3><p className="mt-2 text-sm leading-5 text-forest-700">{description}</p><p className="mt-4 border-t border-forest-500/10 pt-3 text-[10px] font-bold uppercase tracking-wide text-forest-500">{section}</p></article>)}</div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><strong>Important:</strong> The Constitution uses different wording across rights — some apply to “every person”, others specifically to citizens. Rights may be subject to lawful limitations under Section 45. Section 46 provides a route to seek enforcement through the courts. Read the actual provision before relying on a summary.</div>
        </div>
      </section>

      <section id="responsibilities" className="scroll-mt-24 border-y border-forest-500/10 bg-[#f1f2ec] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">02 · Citizenship in practice</p><div className="flex flex-wrap items-end justify-between gap-3"><h2 className="mt-1 font-display text-2xl font-bold text-forest-950">Know your responsibilities</h2><span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-forest-800">Section 24</span></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">{duties.map(([title,description],i)=><article key={title} className="flex gap-3 rounded-xl border border-forest-500/10 bg-white p-4"><span className="font-mono text-xs font-bold text-gold-700">0{i+1}</span><div><h3 className="text-sm font-bold text-forest-900">{title}</h3><p className="mt-1 text-sm leading-5 text-forest-700">{description}</p></div></article>)}</div>
          <p className="mt-4 text-xs leading-5 text-forest-600">These are constitutional duties. They do not cancel the rights of citizens or authorise unlawful conduct by any person or institution.</p>
        </div>
      </section>

      <section id="government" className="scroll-mt-24 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">03 · How public authority is organised</p><h2 className="mt-1 font-display text-2xl font-bold text-forest-950">Understand government</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-forest-500/12 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-700">Three arms</p><div className="mt-3 space-y-3"><div><h3 className="text-sm font-bold text-forest-900">Executive</h3><p className="mt-1 text-xs leading-5 text-forest-700">Implements laws and administers public programmes.</p></div><div><h3 className="text-sm font-bold text-forest-900">Legislature</h3><p className="mt-1 text-xs leading-5 text-forest-700">Makes laws, authorises public spending and exercises oversight.</p></div><div><h3 className="text-sm font-bold text-forest-900">Judiciary</h3><p className="mt-1 text-xs leading-5 text-forest-700">Interprets laws and determines disputes through the courts.</p></div></div></article>
            <article className="rounded-xl border border-forest-500/12 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-700">Three levels</p><div className="mt-3 space-y-3"><div><h3 className="text-sm font-bold text-forest-900">Federal</h3><p className="mt-1 text-xs leading-5 text-forest-700">National responsibilities assigned by the Constitution and federal laws.</p></div><div><h3 className="text-sm font-bold text-forest-900">State</h3><p className="mt-1 text-xs leading-5 text-forest-700">State responsibilities under the Constitution and state laws.</p></div><div><h3 className="text-sm font-bold text-forest-900">Local government</h3><p className="mt-1 text-xs leading-5 text-forest-700">Local council functions set out in the Constitution and applicable laws.</p></div></div></article>
          </div>
          <p className="mt-4 text-xs leading-5 text-forest-600">Responsibilities can be shared or depend on the subject and applicable law. Do not assume that every service problem belongs to one level of government.</p>
        </div>
      </section>

      <section id="public-resources" className="scroll-mt-24 border-y border-forest-500/10 bg-[#f1f2ec] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">04 · Public resources</p><h2 className="mt-1 font-display text-2xl font-bold text-forest-950">Follow public money and services</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[["Budget","What was approved for a public purpose?"],["Procurement","What was purchased, from whom and under which process?"],["Delivery","What was completed, where and with what evidence?"]].map(([title,desc],i)=><article key={title} className="rounded-xl border border-forest-500/10 bg-white p-4"><span className="font-mono text-xs text-gold-700">0{i+1}</span><h3 className="mt-3 text-sm font-bold text-forest-900">{title}</h3><p className="mt-2 text-sm leading-5 text-forest-700">{desc}</p></article>)}
          </div>
          <p className="mt-4 text-xs leading-5 text-forest-600">A budget allocation is not proof that money was released, spent correctly or converted into a functioning service. Follow each stage separately.</p>
        </div>
      </section>

      <section id="participation" className="scroll-mt-24 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">05 · Peaceful participation</p><h2 className="mt-1 font-display text-2xl font-bold text-forest-950">Ways to take part</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[["Learn","Read the Constitution and understand the institution responsible."],["Participate","Register and vote when eligible; engage in lawful public processes."],["Observe","Record what you directly experienced and distinguish it from what you heard."],["Follow up","Track published records, official responses and evidence of implementation."]].map(([title,desc],i)=><article key={title} className="rounded-xl border border-forest-500/12 bg-white p-4"><span className="font-mono text-xs font-bold text-gold-700">0{i+1}</span><h3 className="mt-3 text-sm font-bold text-forest-900">{title}</h3><p className="mt-2 text-sm leading-5 text-forest-700">{desc}</p></article>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-2"><Link href="/report" className="inline-flex min-h-11 items-center rounded-md border border-forest-500/20 bg-white px-4 text-xs font-semibold text-forest-900">Report an observation</Link><Link href="/explore" className="inline-flex min-h-11 items-center rounded-md bg-forest-900 px-4 text-xs font-semibold text-white">Explore published records</Link></div>
        </div>
      </section>

      <section id="patriotism" className="scroll-mt-24 bg-forest-950 px-4 py-8 text-white sm:py-10">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-300">06 · National ethics</p><h2 className="mt-2 font-display text-2xl font-bold">Patriotism without partisanship.</h2></div>
          <div><p className="text-sm leading-6 text-white/80">The Constitution lists discipline, integrity, dignity of labour, social justice, religious tolerance, self-reliance and patriotism as national ethics in Section 23.</p><p className="mt-3 text-sm leading-6 text-white/80">ISEYC frames patriotism as informed service: respect the Constitution and the rights of others, contribute to community well-being, protect shared resources and participate peacefully — including when asking institutions to account for their duties.</p><p className="mt-3 text-xs font-semibold text-gold-300">No party loyalty tests. No government endorsements. No silence in place of accountability.</p></div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">Source shelf</p><h2 className="mt-1 font-display text-xl font-bold text-forest-950">Read the original sources</h2>
          <div className="mt-4 divide-y divide-forest-500/10 rounded-xl border border-forest-500/12 bg-white">{sources.map((source)=><a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center justify-between gap-4 p-4 hover:bg-forest-50"><span><strong className="block text-sm text-forest-900">{source.name}</strong><span className="mt-1 block text-xs text-forest-600">{source.detail}</span></span><span className="shrink-0 text-forest-700" aria-hidden="true">↗</span></a>)}</div>
          <p className="mt-4 text-[11px] leading-5 text-forest-500">This guide is for civic education, not legal advice. Constitutional provisions, amendments and procedures should be checked against the current authoritative text. Seek qualified legal support for a specific case.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
