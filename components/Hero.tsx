"use client";

import { motion } from "framer-motion";
import { ISEYC_SEAL_SRC, CIVIC_BRAIN_URL } from "@/lib/brand";

export default function Hero({ total, lgas }: { total: number; lgas: number }) {
  return (
    <section className="px-4 pb-6 pt-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4 flex justify-center"
      >
        <img
          src={ISEYC_SEAL_SRC}
          alt="ISEYC"
          width={88}
          height={88}
          className="h-[88px] w-[88px] rounded-full bg-white object-contain p-0.5 shadow-md ring-2 ring-gold-400/50"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold-600"
      >
        ISEYC 2027 Civic Mandate · Phase 0
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-display text-2xl font-bold leading-tight text-forest-900 sm:text-3xl"
      >
        Tell public office what must be delivered.
        <br />
        <span className="text-forest-500">Not who to vote for.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-forest-700/80"
      >
        Choose the office, Kaduna LGA and duty. Then state one concrete demand.
        Published voices are moderated before they appear on the public wall.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 flex justify-center gap-4"
      >
        <div className="paper-card min-w-[110px] rounded-xl px-5 py-3">
          <div className="font-display text-2xl font-bold text-forest-500">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-700/60">
            Published mandates
          </div>
        </div>

        <div className="paper-card min-w-[110px] rounded-xl px-5 py-3">
          <div className="font-display text-2xl font-bold text-forest-500">{lgas}</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-700/60">
            LGAs heard
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-auto mt-5 max-w-md rounded-xl border border-forest-500/10 bg-white/70 px-4 py-3 text-left"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
          Non-partisan civic instrument
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-forest-600/80">
          ISEYC does not endorse candidates or parties through this platform.
          It records citizen demands and connects them to a selected public office.
        </p>
      </motion.div>

      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        href={CIVIC_BRAIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-forest-500/20 bg-white/80 px-3 py-1.5 text-[11px] font-medium text-forest-600 shadow-sm transition hover:border-forest-500/40"
      >
        Explore ISEYC Civic Brain
        <span aria-hidden>↗</span>
      </motion.a>
    </section>
  );
}