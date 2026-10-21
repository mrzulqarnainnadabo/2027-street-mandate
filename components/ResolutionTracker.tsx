import type { ResolutionPublicFacts } from "@/lib/resolution-tracker";
import { buildResolutionSnapshot } from "@/lib/resolution-tracker";

export default function ResolutionTracker({ mandate }: { mandate: ResolutionPublicFacts }) {
  const snap = buildResolutionSnapshot(mandate);

  return (
    <section
      aria-labelledby="resolution-tracker-heading"
      className="mt-6 rounded-md border border-forest-500/15 bg-white px-4 py-4"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
        Resolution tracker
      </p>
      <h2 id="resolution-tracker-heading" className="mt-1 font-display text-base font-bold text-forest-900">
        Where this demand stands on the public record
      </h2>
      <p className="mt-1 text-xs leading-snug text-forest-600">{snap.statusLabel}</p>

      <ol className="mt-4 space-y-0">
        {snap.stages.map((s, i) => (
          <li key={s.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < snap.stages.length - 1 ? (
              <span
                className="absolute left-[11px] top-6 bottom-0 w-px bg-forest-500/20"
                aria-hidden
              />
            ) : null}
            <span
              className={`relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                s.confirmed
                  ? "border-forest-600 bg-forest-600 text-white"
                  : "border-forest-500/30 bg-cream text-forest-500"
              }`}
              aria-hidden
            >
              {s.confirmed ? "✓" : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold text-forest-900">{s.label}</span>
                <span
                  className={`text-[10px] font-bold uppercase ${
                    s.confirmed ? "text-forest-600" : "text-forest-400"
                  }`}
                >
                  {s.confirmed ? "On public record" : "Not on public record"}
                </span>
              </div>
              {s.at ? (
                <p className="text-[11px] text-forest-500">{new Date(s.at).toLocaleString()}</p>
              ) : null}
              <p className="mt-0.5 text-xs leading-snug text-forest-600">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-3 border-t border-forest-500/10 pt-3 text-[11px] leading-snug text-forest-500">
        {snap.disclaimer}
      </p>
    </section>
  );
}
