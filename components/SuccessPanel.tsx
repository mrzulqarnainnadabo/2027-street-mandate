"use client";

export default function SuccessPanel({
  sentence,
  state,
  lga,
  duty,
  office,
  onReset,
}: {
  sentence: string;
  state: string;
  lga: string;
  duty: string;
  office: string;
  onReset: () => void;
}) {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?lga=${encodeURIComponent(lga)}&office=${encodeURIComponent(
          office
        )}&duty=${encodeURIComponent(duty)}`
      : siteUrl;

  const shareBody = `I added a public demand to The 2027 Civic Mandate by ISEYC.

Demand: "${sentence}"
Duty: ${duty}
Office: ${office}
Location: ${lga}, ${state}

This is non-partisan. It is about what citizens want delivered — not who to vote for.

Add your own mandate: ${shareUrl}`;

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ISEYC 2027 Civic Mandate",
          text: shareBody,
          url: shareUrl,
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
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(shareBody),
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareX() {
    const text = `My LGA's 2027 civic demand: "${sentence}" — ${lga}, ${state}. ${office} delivery. ${shareUrl}`;
    window.open(
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text),
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

        <h2 className="font-display text-xl font-bold text-forest-700">
          Your mandate is recorded.
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-forest-700/80">
          It will appear on the public wall only after moderation.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-left">
          <div className="rounded-lg bg-forest-50 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-wider text-forest-500">Office</p>
            <p className="mt-0.5 text-xs font-semibold text-forest-800">{office}</p>
          </div>
          <div className="rounded-lg bg-forest-50 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-wider text-forest-500">LGA</p>
            <p className="mt-0.5 text-xs font-semibold text-forest-800">{lga}</p>
          </div>
          <div className="rounded-lg bg-forest-50 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-wider text-forest-500">Duty</p>
            <p className="mt-0.5 text-xs font-semibold text-forest-800">{duty}</p>
          </div>
        </div>

        <blockquote className="mt-4 rounded-xl border border-forest-500/10 bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1.5 text-xs not-italic text-forest-500">
            — {lga}, {state} · pending review
          </footer>
        </blockquote>

        <p className="mt-5 text-[11px] font-medium uppercase tracking-wider text-gold-600">
          Share the mandate
        </p>

        <p className="mt-1 text-xs text-forest-600/80">
          Bring more measurable demands from your LGA.
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
            <span aria-hidden>𝕏</span> Share on X
          </button>

          <button
            type="button"
            onClick={shareNative}
            className="w-full rounded-xl border border-forest-500/25 bg-cream py-2.5 text-sm font-semibold text-forest-700 active:scale-[0.99]"
          >
            Copy share text
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