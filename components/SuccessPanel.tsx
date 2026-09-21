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
    <section className="px-4 pt-6">
      <div className="paper-card rounded-2xl p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-500 text-2xl text-cream">
          ✓
        </div>
        <h2 className="font-display text-xl font-bold text-forest-700">Submitted for review</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-700/85">
          Your mandate is <strong className="font-semibold">not public yet</strong>. It appears on
          Civic Pulse only after ISEYC moderation marks it Published.
        </p>

        <blockquote className="mt-4 rounded-xl border border-forest-500/10 bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1.5 text-xs not-italic text-forest-500">
            — {state} · pending review
          </footer>
        </blockquote>

        <p className="mt-3 text-[11px] leading-snug text-forest-500">
          Invite others to the campaign. Share your personal receipt only after it is Published.
        </p>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white"
          >
            Share campaign on WhatsApp
          </button>
          <button
            type="button"
            onClick={shareX}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-900 py-3 text-sm font-bold text-cream"
          >
            Post campaign on X
          </button>
          <button
            type="button"
            onClick={shareNative}
            className="w-full rounded-xl border border-forest-500/25 bg-cream py-2.5 text-sm font-semibold text-forest-700"
          >
            Copy campaign link
          </button>
          {detailUrl ? (
            <button
              type="button"
              onClick={copyDetailHint}
              className="w-full rounded-xl border border-dashed border-forest-500/20 py-2 text-xs font-medium text-forest-600"
            >
              Copy future public link (after publish)
            </button>
          ) : null}
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
