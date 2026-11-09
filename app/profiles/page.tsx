import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCT_NAME } from "@/lib/brand";

export const metadata = {
  title: `Institutions & Offices | ${PRODUCT_NAME}`,
  description: "Understand the responsibilities of public institutions in Nigeria through source-linked, non-partisan profiles.",
};

const institutions = [
  {group:"Federal executive",name:"The Presidency",role:"Leads the federal executive and administers federal government policy and programmes.",source:"State House",url:"https://statehouse.gov.ng/",basis:"Constitution · Executive powers"},
  {group:"Federal legislature",name:"National Assembly",role:"Makes federal laws, authorises public expenditure and exercises legislative oversight.",source:"National Assembly",url:"https://www.nass.gov.ng/",basis:"Constitution · Sections 4 and 80"},
  {group:"Judiciary",name:"Supreme Court of Nigeria",role:"The apex court in the judicial system; decides appeals and constitutional questions within its jurisdiction.",source:"Supreme Court",url:"https://supremecourt.gov.ng/",basis:"Constitution · Chapter VII"},
  {group:"Independent constitutional body",name:"INEC",role:"Organises and oversees elections and provides official voter and election information.",source:"INEC",url:"https://www.inecnigeria.org/",basis:"Constitution · Section 153 and Third Schedule"},
  {group:"Human rights institution",name:"National Human Rights Commission",role:"Promotes and protects human rights, public enlightenment, research and dialogue.",source:"NHRC",url:"https://www.nhrc.gov.ng/",basis:"NHRC Act · official mandate"},
  {group:"Digital development institution",name:"NITDA",role:"Coordinates information technology development, standards, digital inclusion and IT regulation.",source:"NITDA",url:"https://nitda.gov.ng/",basis:"NITDA Act · 2007"},
  {group:"State & local government",name:"State institutions and local councils",role:"Deliver functions assigned by the Constitution and applicable state and federal laws. Responsibility depends on the service and location.",source:"Nigeria Government Portal",url:"https://services.gov.ng/about/government-and-politics",basis:"Constitution · Second and Fourth Schedules"},
];

export default function ProfilesPage() {
  return <div className="mx-auto min-h-screen max-w-5xl">
    <Header />
    <main className="px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">Civic understanding · source-linked</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-forest-950 sm:text-3xl">Public institutions & offices</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-forest-700">Understand who does what, where authority comes from and where to find official information. These are institutional profiles — not candidate pages, endorsements or rankings.</p>
        <p className="mt-3 rounded-md border border-forest-500/15 bg-forest-50 px-3 py-2 text-xs leading-5 text-forest-700">No ISEYC endorsement. A source-linked institutional profile is not a recommendation, quality rating or statement of support.</p>
        <div className="mt-5 flex flex-wrap gap-2"><Link href="/learn#government" className="inline-flex min-h-10 items-center rounded-md bg-forest-900 px-4 text-xs font-semibold text-white">How government works →</Link><Link href="/map" className="inline-flex min-h-10 items-center rounded-md border border-forest-500/20 bg-white px-4 text-xs font-semibold text-forest-900">Responsibility map</Link></div>
        <div className="mt-7 grid gap-3 md:grid-cols-2">
          {institutions.map((item,i)=><article key={item.name} className="motion-card rounded-xl border border-forest-500/12 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-700">{item.group}</span><span className="font-mono text-xs text-forest-400">0{i+1}</span></div>
            <h2 className="mt-3 font-display text-lg font-bold text-forest-950">{item.name}</h2>
            <p className="mt-2 text-sm leading-5 text-forest-700">{item.role}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-forest-500/10 pt-3"><span className="text-[10px] font-semibold text-forest-500">{item.basis}</span><a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-xs font-bold text-forest-800 underline underline-offset-4">Official source · {item.source} ↗</a></div>
          </article>)}
        </div>
        <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><strong>Responsibility is not always exclusive.</strong> Some public services involve federal, state, local and independent institutions together. ISEYC’s responsibility map is a pilot navigation aid, not a legal determination. Check the relevant law and official source before assigning responsibility.</aside>
        <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold text-forest-800"><Link href="/states" className="underline">Explore states →</Link><Link href="/explore" className="underline">Published community record →</Link><Link href="/methodology" className="underline">Evidence method →</Link></div>
      </div>
    </main>
    <Footer />
  </div>;
}
