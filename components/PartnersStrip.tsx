"use client";

import Link from "next/link";

/**
 * Credibility without fake endorsements.
 * Institutions request a conversation — we do not list unverified partner logos.
 */
export default function PartnersStrip() {
  return (
    <section
      className="border-b border-forest-500/10 bg-forest-900 px-4 py-6 text-cream"
      aria-labelledby="partners-heading"
    >
      <h2
        id="partners-heading"
        className="motion-fade-up text-center font-display text-sm font-bold tracking-wide"
      >
        For institutions & partners
      </h2>
      <p className="motion-fade-up motion-delay-1 mx-auto mt-2 max-w-md text-center text-[12px] leading-snug text-cream/85">
        CSOs, universities, journalists and public offices can request a conversation about methodology,
        data access, or collaboration. Equal process. No paid rankings. We do not display unverified logos.
      </p>
      <div className="motion-fade-up motion-delay-2 mt-4 flex flex-wrap justify-center gap-2">
        <a
          href="mailto:iseycglobal@gmail.com?subject=ISEYC%20Civic%20Mandate%20conversation"
          className="inline-flex min-h-[44px] items-center rounded-md bg-gold-600 px-4 text-sm font-bold text-forest-900 transition hover:brightness-110 active:translate-y-px"
        >
          Request a conversation
        </a>
        <Link
          href="/methodology"
          className="inline-flex min-h-[44px] items-center rounded-md border border-cream/30 px-4 text-sm font-semibold text-cream transition hover:border-cream/60 hover:bg-white/5"
        >
          Read methodology
        </Link>
      </div>
    </section>
  );
}
