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

  const shareBody = `I just added my voice to The 2027 Street Mandate by ISEYC.\n\n"${sentence}"\n— from ${state}\n\nDon't tell them who you'll vote for. Tell them what they must deliver.\n\nAdd yours: ${siteUrl}`;

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "2027 Street Mandate — ISEYC",
          text: shareBody,
          url: siteUrl,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copyText();
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareBody);
      alert("Copied. Paste it into WhatsApp, X, or anywhere.");
    } catch {
      alert(shareBody);
    }
  }

  function shareWhatsApp() {
    const url =
      "https://wa.me/?text=" + encodeURIComponent(shareBody);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareX() {
    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(
        `I just spoke on The 2027 Street Mandate by ISEYC.\n\n"${sentence}" — ${state}\n\nTell them what they must deliver → ${siteUrl}`
      );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="px-4 pt-6">
      <div className="paper-card rounded-2xl p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-500 text-2xl text-cream">
          ✓
        </div>
        <h2 className="font-display text-xl font-bold text-forest-700">
          Your voice is in.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-700/80">
          It will appear on the public wall after a short review.
          <br />
          Thank you for speaking for your community.
        </p>

        <blockquote className="mt-4 rounded-xl border border-forest-500/10 bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1.5 text-xs not-italic text-forest-500">
            — {state} · pending review
          </footer>
        </blockquote>

        <p className="mt-5 text-[11px] font-medium uppercase tracking-wider text-gold-600">
          Multiply your impact
        </p>
        <p className="mt-1 text-xs text-forest-600/80">
          One share can bring ten more voices from your state.
        </p>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-sm active:scale-[0.99]"
          >
            <span aria-hidden>💬</span> Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={shareX}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-900 py-3 text-sm font-bold text-cream active:scale-[0.99]"
          >
            <span aria-hidden>𝕏</span> Post on X
          </button>
          <button
            type="button"
            onClick={shareNative}
            className="w-full rounded-xl border border-forest-500/25 bg-cream py-2.5 text-sm font-semibold text-forest-700 active:scale-[0.99]"
          >
            Share / Copy link
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-4 w-full py-2 text-xs text-forest-500 underline underline-offset-2"
        >
          Submit another voice (different device)
        </button>
      </div>
    </section>
  );
}
