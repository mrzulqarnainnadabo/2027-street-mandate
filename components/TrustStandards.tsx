import Link from "next/link";

/**
 * Compact institutional trust strip for the public homepage.
 * Visible standards without dashboard clutter.
 */
export default function TrustStandards() {
  return (
    <section
      className="border-b border-forest-500/10 px-4 py-6"
      aria-labelledby="standards-heading"
    >
      <h2
        id="standards-heading"
        className="text-center font-display text-sm font-bold tracking-wide text-forest-800"
      >
        Our standards
      </h2>
      <ul className="mx-auto mt-4 grid max-w-xl gap-2 text-[12px] leading-snug text-forest-700 sm:grid-cols-2">
        <li className="rounded-md border border-forest-500/10 bg-white px-3 py-2.5">
          <span className="font-semibold text-forest-900">Non-partisan</span>
          <span className="mt-0.5 block text-forest-600">
            No candidate rankings, endorsements, or vote advice.
          </span>
        </li>
        <li className="rounded-md border border-forest-500/10 bg-white px-3 py-2.5">
          <span className="font-semibold text-forest-900">Human-reviewed</span>
          <span className="mt-0.5 block text-forest-600">
            Only Published records appear on the public surfaces.
          </span>
        </li>
        <li className="rounded-md border border-forest-500/10 bg-white px-3 py-2.5">
          <span className="font-semibold text-forest-900">Traceable claims</span>
          <span className="mt-0.5 block text-forest-600">
            Civic intelligence is built from published records, with methodology and limits shown.
          </span>
        </li>
        <li className="rounded-md border border-forest-500/10 bg-white px-3 py-2.5">
          <span className="font-semibold text-forest-900">Privacy-conscious</span>
          <span className="mt-0.5 block text-forest-600">
            Optional demographics and device signals stay off the public record.
          </span>
        </li>
      </ul>
      <p className="mx-auto mt-4 max-w-md text-center text-[11px] text-forest-500">
        <Link href="/about" className="font-semibold underline underline-offset-2">
          Non-partisan charter
        </Link>
        {" · "}
        <Link href="/methodology" className="font-semibold underline underline-offset-2">
          Methodology
        </Link>
        {" · "}
        <Link href="/intelligence" className="font-semibold underline underline-offset-2">
          What published records show
        </Link>
      </p>
    </section>
  );
}
