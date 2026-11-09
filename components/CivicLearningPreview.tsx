import Link from "next/link";

const PILLARS = [
  { number: "01", label: "Your rights", title: "Know what protects you", description: "Understand the rights and freedoms set out in the Constitution.", href: "/learn#rights" },
  { number: "02", label: "Your duties", title: "Know your responsibilities", description: "Citizenship includes duties to the country and to one another.", href: "/learn#responsibilities" },
  { number: "03", label: "Public institutions", title: "Understand how government works", description: "Know the roles of federal, state and local institutions.", href: "/learn#government" },
  { number: "04", label: "Shared values", title: "Serve the country we share", description: "Build unity through integrity, dignity, tolerance and public responsibility.", href: "/learn#patriotism" },
] as const;

export default function CivicLearningPreview() {
  return (
    <section className="border-b border-forest-500/10 bg-forest-950 px-4 py-8 text-cream sm:py-10" aria-labelledby="civic-learning-heading">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">Civic learning · Start here</p>
            <h2 id="civic-learning-heading" className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">Citizenship begins with understanding.</h2>
            <p className="mt-2 text-sm leading-relaxed text-cream/75">Know your rights. Understand public responsibility. Take part in the country we share.</p>
          </div>
          <Link href="/learn" className="inline-flex min-h-11 items-center rounded-md border border-gold-400/50 px-4 text-xs font-bold text-gold-300 transition hover:bg-white/10">Open civic learning hub <span aria-hidden="true" className="ml-2">↗</span></Link>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((item) => (
            <Link key={item.number} href={item.href} className="group min-h-[150px] rounded-lg border border-white/12 bg-white/[0.045] p-4 transition hover:border-gold-400/50 hover:bg-white/[0.08]">
              <div className="flex items-center justify-between"><span className="font-display text-2xl font-bold text-gold-400">{item.number}</span><span className="text-[9px] font-bold uppercase tracking-[0.12em] text-cream/55">{item.label}</span></div>
              <h3 className="mt-4 text-sm font-bold text-cream">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-cream/65">{item.description}</p>
              <span className="mt-3 inline-flex text-[11px] font-semibold text-gold-300 group-hover:underline">Explore <span aria-hidden="true" className="ml-1">→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
