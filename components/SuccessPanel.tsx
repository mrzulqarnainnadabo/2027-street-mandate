"use client";

export default function SuccessPanel({
  sentence,
  state,
  onReset,
}: {
  sentence: string;
  state: string;
  onReset: () => void;
}) {
  const shareText = `I just added my voice to The 2027 Street Mandate by ISEYC.\n\n"${sentence}"\n— from ${state}\n\nDon't tell them who you'll vote for. Tell them what they must deliver.\n\nJoin: `;

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const full = shareText + url;
    if (navigator.share) {
      try {
        await navigator.share({ text: full });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(full);
      alert("Copied to clipboard — paste it anywhere.");
    } catch {
      alert("Copy this:\n\n" + full);
    }
  }

  return (
    <section className="px-4 pt-8">
      <div className="paper-card rounded-2xl p-5 text-center">
        <div className="mb-2 text-3xl">✓</div>
        <h2 className="font-display text-xl font-bold text-forest-700">
          Your voice is in.
        </h2>
        <p className="mt-2 text-sm text-forest-700/80">
          It will appear on the public wall after a short review. Thank you for speaking.
        </p>
        <blockquote className="mt-4 rounded-xl bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1 text-xs not-italic text-forest-500">— {state}</footer>
        </blockquote>
        <button
          onClick={share}
          className="mt-5 w-full rounded-xl bg-gold-500 py-3 text-sm font-bold text-forest-900"
        >
          Share my voice
        </button>
        <button
          onClick={onReset}
          className="mt-2 w-full py-2 text-xs text-forest-500 underline"
        >
          Add another voice
        </button>
      </div>
    </section>
  );
}
