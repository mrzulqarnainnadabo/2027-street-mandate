/** Env-gated banner: set NEXT_PUBLIC_CIVIC_FREEZE=1 to show. Off by default. */

export default function FreezeBanner() {
  if (process.env.NEXT_PUBLIC_CIVIC_FREEZE !== "1") return null;
  return (
    <div className="border-b border-gold-600/30 bg-gold-500/15 px-4 py-2 text-center text-xs leading-snug text-forest-900">
      Civic Mandate is in a careful operating window. Submissions still open; publication follows ISEYC
      review. This is not an election poll.
    </div>
  );
}
