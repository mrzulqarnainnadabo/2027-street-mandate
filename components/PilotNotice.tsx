export default function PilotNotice() {
  return (
    <aside
      role="note"
      aria-label="Pilot data limitation"
      className="mx-4 my-3 rounded-md border border-gold-500/30 bg-cream px-3 py-2.5 text-xs leading-relaxed text-forest-800"
    >
      <p className="font-semibold">National pilot · Published records only</p>
      <p className="mt-1">
        Counts and locations describe records published in this pilot. They are not a representative
        survey, national prevalence estimate, vote, or ranking. Empty or unavailable data must not be
        interpreted as absence of community need.
      </p>
    </aside>
  );
}
