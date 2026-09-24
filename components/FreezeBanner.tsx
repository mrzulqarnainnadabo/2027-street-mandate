/**
 * Optional election-period notice. Off unless NEXT_PUBLIC_CIVIC_FREEZE=1.
 * Does not hide existing published demands. Does not rank candidates.
 * LEGAL REVIEW REQUIRED before enabling near polling days.
 */
export default function FreezeBanner() {
  if (process.env.NEXT_PUBLIC_CIVIC_FREEZE !== "1") return null;

  return (
    <div
      role="status"
      className="border-b border-gold-600/30 bg-forest-900 px-4 py-2.5 text-center text-[11px] leading-snug text-cream"
    >
      <strong className="text-gold-400">Civic notice.</strong> ISEYC is not running candidate rankings or
      campaign promotions. This instrument records citizen demands on public office only. Counts are not
      votes.
    </div>
  );
}
