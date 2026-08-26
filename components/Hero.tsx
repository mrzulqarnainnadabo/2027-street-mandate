"use client";

import { motion } from "framer-motion";

export default function Hero({ total, states }: { total: number; states: number }) {
  return (
    <section className="px-4 pb-6 pt-8 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold-600"
      >
        A civic instrument by ISEYC
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-display text-2xl font-bold leading-tight text-forest-900 sm:text-3xl"
      >
        Don’t tell us who you’ll vote for.
        <br />
        <span className="text-forest-500">Tell them what they must deliver.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-4 max-w-md text-sm text-forest-700/80"
      >
        One sentence. One issue. Your state.  
        The 2027 Street Mandate is the public voice wall for what Nigerians actually want fixed.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 flex justify-center gap-6"
      >
        <div className="paper-card rounded-xl px-5 py-3">
          <div className="font-display text-2xl font-bold text-forest-500">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-700/60">Voices so far</div>
        </div>
        <div className="paper-card rounded-xl px-5 py-3">
          <div className="font-display text-2xl font-bold text-forest-500">{states}</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-700/60">States heard</div>
        </div>
      </motion.div>
    </section>
  );
}
