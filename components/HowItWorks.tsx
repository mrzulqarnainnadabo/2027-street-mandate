import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="mx-4 mb-6 rounded-2xl border border-forest-500/15 bg-white/90 px-4 py-5 text-left shadow-sm">
      <h2 className="text-center font-display text-sm font-bold text-forest-800">How it works</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-forest-700">
        <li>Choose a duty of government (health, security, power…).</li>
        <li>Name the office that should deliver it — or say you are unsure.</li>
        <li>Add your state (and LGA if you know it).</li>
        <li>Write one concrete demand.</li>
        <li>ISEYC reviews. Only accepted mandates appear on Civic Pulse.</li>
      </ol>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-forest-50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-forest-600">We publish</p>
          <p className="mt-1 text-[11px] leading-snug text-forest-700">
            Specific service demands, measurable expectations, public-interest concerns tied to an
            office.
          </p>
        </div>
        <div className="rounded-xl bg-forest-50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-forest-600">We reject</p>
          <p className="mt-1 text-[11px] leading-snug text-forest-700">
            Threats, hate, personal attacks, party slogans, candidate promotion, harassment,
            empty noise.
          </p>
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-snug text-forest-500">
        Optional age/gender stay private. Device data is for spam control only. Mandate text becomes
        public only after Status is set to Published.{" "}
        <Link href="/about" className="font-semibold underline underline-offset-2">
          Full charter
        </Link>
      </p>
    </section>
  );
}
