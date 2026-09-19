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
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";

  const shareBody = `I just submitted a civic mandate on ISEYC’s 2027 Civic Mandate.\n\n"${sentence}"\n— from ${state}\n\nDon’t tell them who you’ll vote for. Tell them what they must deliver.\n\nAdd yours: ${siteUrl}`;

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ISEYC 2027 Civic Mandate",
          text: shareBody,
          url: siteUrl,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(shareBody);
      alert("Copied. Paste into WhatsApp, X, or anywhere.");
    } catch {
      alert(shareBody);
    }
  }

  function shareWhatsApp() {
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(shareBody),
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareX() {
    window.open(
      "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(
          `I submitted a civic mandate with ISEYC.\n\n"${sentence}" — ${state}\n\nTell them what they must deliver → ${siteUrl}`
        ),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="px-4 pt-6">
      <div className="paper-card rounded-2xl p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-500 text-2xl text-cream">
          ✓
        </div>
        <h2 className="font-display text-xl font-bold text-forest-700">Your mandate is in.</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-700/80">
          It will appear on the public wall after a short review.
          <br />
          Thank you for demanding delivery — not just elections.
        </p>

        <blockquote className="mt-4 rounded-xl border border-forest-500/10 bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1.5 text-xs not-italic text-forest-500">
            — {state} · pending review
          </footer>
        </blockquote>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white"
          >
            Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={shareX}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-900 py-3 text-sm font-bold text-cream"
          >
            Post on X
          </button>
          <button
            type="button"
            onClick={shareNative}
            className="w-full rounded-xl border border-forest-500/25 bg-cream py-2.5 text-sm font-semibold text-forest-700"
          >
            Share / Copy link
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-4 w-full py-2 text-xs text-forest-500 underline underline-offset-2"
        >
          Submit another mandate
        </button>
      </div>
    </section>
  );
}
