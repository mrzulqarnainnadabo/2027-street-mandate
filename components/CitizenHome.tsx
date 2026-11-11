"use client";

import Link from "next/link";
import { CIVIC_BRAIN_URL } from "@/lib/brand";

const GUIDES = [
  {number:"01",title:"Know your rights",description:"Understand the protections in Chapter IV of the Constitution.",href:"/learn#rights",meta:"Constitution · Sections 33–46"},
  {number:"02",title:"Know your responsibilities",description:"Explore the duties every citizen is asked to uphold.",href:"/learn#responsibilities",meta:"Constitution · Section 24"},
  {number:"03",title:"Understand government",description:"See how federal, state and local institutions work.",href:"/learn#government",meta:"Constitution · Chapters I, V–VII"},
  {number:"04",title:"Participate responsibly",description:"Learn how elections, public records and community reporting work.",href:"/learn#participation",meta:"INEC · Public institutions"},
  {number:"05",title:"Understand public resources",description:"Follow budgets, public services and the duties attached to public office.",href:"/learn#public-resources",meta:"Public finance · Accountability"},
  {number:"06",title:"Practise active citizenship",description:"Turn knowledge into peaceful, useful community participation.",href:"/learn#patriotism",meta:"Service · Integrity · Unity"},
];

export default function CitizenHome({onSubmitDemand}:{onSubmitDemand:()=>void}) {
  return <div className="mx-auto min-h-screen max-w-5xl">
    <section className="relative overflow-hidden border-b border-forest-500/10 bg-forest-950 px-4 py-9 text-white sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rounded-full border border-gold-400/20" />
      <div className="relative mx-auto grid max-w-4xl gap-8 md:grid-cols-[1.2fr_.8fr] md:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold-300">ISEYC · Civic Mandate Nigeria · Non-partisan</p>
          <h1 className="mt-4 max-w-2xl font-display text-[2.15rem] font-bold leading-[1.06] tracking-tight sm:text-5xl">Know your rights. Understand public duty. Take part in Nigeria.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">A citizen’s guide to the Constitution, public institutions, civic responsibilities and the evidence shaping our communities.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn" className="inline-flex min-h-12 items-center rounded-md bg-gold-400 px-5 text-sm font-bold text-forest-950 transition hover:bg-gold-300">Start the citizen guide <span className="ml-2" aria-hidden="true">→</span></Link>
            <Link href="/states" className="inline-flex min-h-12 items-center rounded-md border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10">Explore Nigeria by state</Link>
          </div>
          <p className="mt-4 text-[11px] text-white/60">Knowledge first · Evidence always · Participation without partisanship</p>
        </div>
        <div className="relative rounded-2xl border border-white/15 bg-white/[.07] p-5 backdrop-blur-sm sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-300">The citizen pathway</p>
          <ol className="mt-5 space-y-4">
            {[
              ["01","Know","Your rights and responsibilities"],
              ["02","Understand","Who is responsible for what"],
              ["03","Participate","Use lawful, peaceful civic channels"],
              ["04","Follow through","Read evidence and track public action"],
            ].map(([n,title,detail],i)=><li key={n} className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold-300/40 font-mono text-[10px] text-gold-300">{n}</span><div><p className="text-sm font-semibold text-white">{title}</p><p className="mt-0.5 text-xs text-white/65">{detail}</p></div>{i<3?<span className="sr-only">Then</span>:null}</li>)}
          </ol>
          <div className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/65">Citizens are not spectators. Public institutions exist to serve the people under the Constitution.</div>
        </div>
      </div>
    </section>

    <section className="px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-600">Begin with what matters</p><h2 className="mt-1 font-display text-xl font-bold text-forest-900 sm:text-2xl">Your citizen guide</h2></div>
        <Link href="/learn" className="text-xs font-semibold text-forest-800 underline underline-offset-4">All learning topics →</Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((item)=><Link key={item.number} href={item.href} className="motion-card group rounded-xl border border-forest-500/12 bg-white p-4 shadow-sm transition hover:border-forest-500/25">
          <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-gold-700">{item.number}</span><span className="text-forest-700 transition group-hover:translate-x-1" aria-hidden="true">↗</span></div>
          <h3 className="mt-4 font-display text-lg font-bold text-forest-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-5 text-forest-700">{item.description}</p>
          <p className="mt-4 border-t border-forest-500/10 pt-3 text-[10px] font-semibold uppercase tracking-wide text-forest-500">{item.meta}</p>
        </Link>)}
      </div>
    </section>

    <section className="border-y border-forest-500/10 bg-[#f1f2ec] px-4 py-8 sm:py-10" id="patriotism">
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-[.8fr_1.2fr] md:items-center">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">ISEYC civic learning principle</p><h2 className="mt-2 font-display text-2xl font-bold leading-tight text-forest-950">Patriotism is active citizenship.</h2></div>
        <div><p className="text-sm leading-6 text-forest-800">It means serving your community, respecting the rights of others, protecting shared resources, engaging peacefully and asking public institutions to account for their duties.</p><p className="mt-3 text-xs font-semibold text-forest-700">Not party loyalty. Not silence. Not uncritical support for any government.</p><Link href="/learn#patriotism" className="mt-4 inline-flex min-h-10 items-center text-xs font-bold text-forest-900 underline underline-offset-4">Explore citizenship in practice →</Link></div>
      </div>
    </section>

    <section className="px-4 py-8 sm:py-10">
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-forest-500/15 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-700">Community experience</p>
          <h2 className="mt-2 font-display text-xl font-bold text-forest-950">What are people experiencing?</h2>
          <p className="mt-2 text-sm leading-5 text-forest-700">Read published observations and demands. Each record keeps its source, review status and limitations.</p>
          <Link href="/explore" className="mt-4 inline-flex min-h-10 items-center text-xs font-bold text-forest-800 underline">Explore the public record →</Link>
        </article>
        <article className="rounded-xl border border-forest-500/15 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-700">Public participation</p>
          <h2 className="mt-2 font-display text-xl font-bold text-forest-950">Make your contribution useful.</h2>
          <p className="mt-2 text-sm leading-5 text-forest-700">Report what you observed or submit a specific public-service demand. Human review comes before publication.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/report" className="inline-flex min-h-10 items-center rounded-md border border-forest-500/20 px-3 text-xs font-semibold text-forest-900">Report an observation</Link>
            <button type="button" onClick={onSubmitDemand} className="inline-flex min-h-10 items-center rounded-md bg-forest-900 px-3 text-xs font-semibold text-white">Submit a public demand</button>
          </div>
        </article>
      </div>
    </section>
    <section className="border-t border-forest-500/10 bg-white px-4 py-8 sm:py-10" aria-labelledby="systems-heading">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-700">ISEYC civic intelligence system</p><h2 id="systems-heading" className="mt-1 font-display text-2xl font-bold text-forest-950">One mission. Three connected products.</h2></div><span className="text-[10px] text-forest-500">Record · Interpret · Explore</span></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-forest-500/12 bg-cream p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-700">01 · Citizen entry</p><h3 className="mt-2 font-display text-lg font-bold text-forest-950">Civic Mandate Nigeria</h3><p className="mt-2 text-xs leading-5 text-forest-700">Citizens learn, report what they experience and submit specific public-service demands. Human review comes before publication.</p><Link href="/explore" className="mt-3 inline-flex text-xs font-bold text-forest-900 underline underline-offset-4">Explore public records →</Link></article>
          <article className="rounded-xl border border-forest-500/12 bg-cream p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-700">02 · Interpretation</p><h3 className="mt-2 font-display text-lg font-bold text-forest-950">Civic Brain</h3><p className="mt-2 text-xs leading-5 text-forest-700">Connects published community records with available official evidence and explains what is known, uncertain and missing.</p><a href={CIVIC_BRAIN_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-bold text-forest-900 underline underline-offset-4">Open Civic Brain ↗</a></article>
          <article className="rounded-xl border border-forest-500/12 bg-cream p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gold-700">03 · Evidence foundation</p><h3 className="mt-2 font-display text-lg font-bold text-forest-950">Civic Intelligence Observatory</h3><p className="mt-2 text-xs leading-5 text-forest-700">The national evidence library will connect official statistics, source records, geography and departmental research. Public release is in development.</p><span className="mt-3 inline-flex text-[10px] font-bold uppercase tracking-wide text-forest-500">In development</span></article>
        </div>
      </div>
    </section>
  </div>;
}
