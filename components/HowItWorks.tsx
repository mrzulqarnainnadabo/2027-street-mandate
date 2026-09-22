import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="mx-4 mb-8 border-y border-forest-500/10 py-5">
      <h2 className="text-center font-display text-sm font-bold tracking-wide text-forest-800">
        How it works
      </h2>
      <ol className="mx-auto mt-3 max-w-md list-decimal space-y-2 pl-6 text-xs leading-relaxed text-forest-700">
        <li>Choose a duty of government.</li>
        <li>Name the office responsible — or say you are unsure.</li>
        <li>Add your state (and LGA if you know it).</li>
        <li>Write one concrete demand for a service or outcome.</li>
        <li>
          Submit. You get a status reference. The mandate stays <strong className="font-semibold">New</strong>{" "}
          until ISEYC review.
        </li>
        <li>
          Only <strong className="font-semibold">Published</strong> mandates appear on Civic Pulse and the{" "}
          <Link href="/brief" className="font-semibold underline underline-offset-2">
            State Civic Brief
          </Link>
          .
        </li>
      </ol>

      <div className="mx-auto mt-4 grid max-w-md gap-2 text-[11px] sm:grid-cols-2">
        <div className="rounded-md border border-forest-500/10 bg-white px-3 py-2">
          <p className="font-bold uppercase tracking-wide text-forest-600">We publish</p>
          <p className="mt-1 leading-snug text-forest-700">
            Specific service demands tied to public responsibility.
          </p>
        </div>
        <div className="rounded-md border border-forest-500/10 bg-white px-3 py-2">
          <p className="font-bold uppercase tracking-wide text-forest-600">We reject</p>
          <p className="mt-1 leading-snug text-forest-700">
            Threats, hate, party slogans, candidate promotion, empty noise.
          </p>
        </div>
      </div>

      <p className="mx-auto mt-3 max-w-md text-center text-[10px] leading-snug text-forest-500">
        Zero published is an empty public record — not a ranking and not a failure. Optional demographics
        stay private.{" "}
        <Link href="/about" className="font-semibold underline underline-offset-2">
          Charter &amp; methodology
        </Link>
      </p>
    </section>
  );
}
