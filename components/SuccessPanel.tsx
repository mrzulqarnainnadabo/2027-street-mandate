"use client";

export default function SuccessPanel({
  sentence,
  state,
  mandateId,
  onReset,
}: {
  sentence: string;
  state: string;
  mandateId?: string;
  onReset: () => void;
}) {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://2027-street-mandate.vercel.app";
  const homeUrl = origin + "/";
  const detailUrl = mandateId ? `${origin}/mandate/${mandateId}` : null;
  const statusUrl = mandateId ? `${origin}/status/${mandateId}` : null;
  const reference = mandateId ? `ISEYC-${mandateId.slice(0, 8).toUpperCase()}` : null;

  const shareBody = [
    "I submitted a civic mandate on ISEYC’s 2027 Civic Mandate (under review).",
    "",
    `"${sentence}"`,
    `— from ${state}`,
    "",
    "Don’t tell them who you’ll vote for. Tell them what they must deliver.",
    "",
    `Add yours: ${homeUrl}`,
  ].join("\n");

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ISEYC 2027 Civic Mandate",
          text: shareBody,
          url: homeUrl,
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
          `I submitted a civic mandate with ISEYC (under review).\n\n"${sentence}" — ${state}\n\nTell them what they must deliver → ${homeUrl}`
        ),
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyDetailHint() {
    if (!detailUrl) return;
    try {
      await navigator.clipboard.writeText(detailUrl);
      alert("Link copied. It only opens publicly after ISEYC sets Status to Published.");
    } catch {
      alert(`After review, public link:\n${detailUrl}`);
    }
  }

  return (
    <section className="px-4 pt-7">
      <div className="mx-auto max-w-xl border-y border-forest-500/15 bg-white px-4 py-6 text-center sm:px-6">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center border-2 border-forest-500 text-xl font-bold text-forest-500">
          ✓
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">Receipt</p>
        <h2 className="mt-1 font-display text-xl font-bold text-forest-900">Submitted for review</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-forest-700/85">
          Your mandate is <strong className="font-semibold">not public yet</strong>. It appears on
          Civic Pulse only after ISEYC moderation marks it Published.
        </p>

        {reference && statusUrl ? (
          <div className="mx-auto mt-4 max-w-md border border-forest-500/15 bg-forest-50 px-4 py-3 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">Keep your reference</p>
            <p className="mt-1 font-display text-lg font-bold tracking-wide text-forest-900">{reference}</p>
            <a
              href={statusUrl}
              className="mt-1 block text-xs font-semibold text-forest-700 underline underline-offset-2"
            >
              Check submission status
            </a>
          </div>
        ) : null}

        <blockquote className="mx-auto mt-5 max-w-md border-l-2 border-forest-500 bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1.5 text-xs not-italic text-forest-500">
            — {state} · pending review
          </footer>
        </blockquote>

        <p className="mx-auto mt-4 max-w-md text-[11px] leading-snug text-forest-500">
          Share the civic mandate if you wish. Public publication still depends on ISEYC review.
        </p>

        <div className="mx-auto mt-4 grid max-w-md gap-2">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="min-h-[48px] w-full rounded-md bg-forest-500 px-4 text-sm font-bold text-white"
          >
            Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={shareX}
            className="min-h-[48px] w-full rounded-md bg-forest-900 px-4 text-sm font-bold text-cream"
          >
            Share on X
          </button>
          <button
            type="button"
            onClick={shareNative}
            className="min-h-[46px] w-full rounded-md border border-forest-500/25 bg-cream px-4 text-sm font-semibold text-forest-700"
          >
            Copy civic mandate
          </button>
          {detailUrl ? (
            <button
              type="button"
              onClick={copyDetailHint}
              className="min-h-[42px] w-full border border-dashed border-forest-500/20 px-4 text-xs font-medium text-forest-600"
            >
              Copy future public link (after publish)
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-5 py-2 text-xs text-forest-500 underline underline-offset-2"
        >
          Submit another mandate
        </button>
      </div>
    </section>
  );
}
