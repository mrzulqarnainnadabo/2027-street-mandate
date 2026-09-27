"use client";

import Link from "next/link";
import {
  copyText,
  shareFacebook,
  shareLinkedIn,
  shareNative,
  shareWhatsApp,
  shareX,
} from "@/lib/share";

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
  const briefUrl = `${origin}/brief?state=${encodeURIComponent(state || "Kaduna")}`;
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

  const tweetText = `I submitted a civic mandate with ISEYC (under review).\n\n"${sentence}" — ${state}\n\nTell them what they must deliver → ${homeUrl}`;

  async function onNative() {
    const result = await shareNative({
      title: "ISEYC 2027 Civic Mandate",
      text: shareBody,
      url: homeUrl,
    });
    if (result === "copied") {
      alert("Copied. Paste into Instagram, TikTok, Facebook, or any app.");
    }
  }

  async function copyAll() {
    const ok = await copyText(shareBody);
    alert(
      ok
        ? "Copied. Paste into Instagram, TikTok, WhatsApp, X, Facebook, LinkedIn, or email."
        : shareBody
    );
  }

  async function copyDetailHint() {
    if (!detailUrl) return;
    const ok = await copyText(detailUrl);
    alert(
      ok
        ? "Link copied. It only opens publicly after ISEYC sets Status to Published."
        : `After review, public link:\n${detailUrl}`
    );
  }

  async function copyStatusLink() {
    if (!statusUrl) return;
    const ok = await copyText(statusUrl);
    alert(
      ok
        ? "Status link copied. Keep it to check your submission later."
        : `Keep this status link:\n${statusUrl}`
    );
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
          Civic Pulse and the State Civic Brief only after ISEYC moderation marks it Published.
        </p>

        {reference && statusUrl ? (
          <div className="mx-auto mt-4 max-w-md border border-forest-500/15 bg-forest-50 px-4 py-3 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
              Keep your reference
            </p>
            <p className="mt-1 font-display text-lg font-bold tracking-wide text-forest-900">
              {reference}
            </p>
            <a
              href={statusUrl}
              className="mt-1 block text-xs font-semibold text-forest-700 underline underline-offset-2"
            >
              Check submission status
            </a>
            <button
              type="button"
              onClick={copyStatusLink}
              className="mt-2 min-h-[40px] w-full border border-dashed border-forest-500/20 px-3 text-xs font-medium text-forest-600"
            >
              Copy status link
            </button>
          </div>
        ) : null}

        <blockquote className="mx-auto mt-5 max-w-md border-l-2 border-forest-500 bg-forest-50 px-4 py-3 text-left text-sm italic text-forest-900">
          “{sentence}”
          <footer className="mt-1.5 text-xs not-italic text-forest-500">
            — {state} · pending review
          </footer>
        </blockquote>

        <p className="mx-auto mt-3 max-w-md text-[11px] leading-snug text-forest-600">
          <Link href="/map" className="font-semibold underline underline-offset-2">
            Responsibility map
          </Link>
          {" "}— see which offices often deliver a duty (not rankings).
        </p>

        <p className="mx-auto mt-2 max-w-md text-[11px] leading-snug text-forest-600">
          After publish, your demand can appear in the{" "}
          <Link
            href={`/brief?state=${encodeURIComponent(state || "Kaduna")}`}
            className="font-semibold underline underline-offset-2"
          >
            {state || "State"} Civic Brief
          </Link>
          {" "}— weekly field instrument for ward meetings (not a poll).
        </p>

        <p className="mx-auto mt-4 max-w-md text-[11px] leading-snug text-forest-500">
          Share if you wish. Publication still depends on ISEYC review. Instagram &amp; TikTok: use
          Copy or Share more, then paste in the app.
        </p>

        <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => shareWhatsApp(shareBody)}
            className="min-h-[48px] rounded-md bg-forest-500 px-2 text-xs font-bold text-white sm:text-sm"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => shareX(tweetText)}
            className="min-h-[48px] rounded-md bg-forest-900 px-2 text-xs font-bold text-cream sm:text-sm"
          >
            X
          </button>
          <button
            type="button"
            onClick={() => shareFacebook(homeUrl)}
            className="min-h-[48px] rounded-md border border-forest-500/25 bg-white px-2 text-xs font-semibold text-forest-800 sm:text-sm"
          >
            Facebook
          </button>
          <button
            type="button"
            onClick={() => shareLinkedIn(homeUrl)}
            className="min-h-[48px] rounded-md border border-forest-500/25 bg-white px-2 text-xs font-semibold text-forest-800 sm:text-sm"
          >
            LinkedIn
          </button>
          <button
            type="button"
            onClick={onNative}
            className="col-span-2 min-h-[46px] rounded-md border border-forest-500/25 bg-cream px-4 text-sm font-semibold text-forest-700"
          >
            Share more (Instagram, TikTok, Messages…)
          </button>
          <button
            type="button"
            onClick={copyAll}
            className="col-span-2 min-h-[44px] rounded-md border border-dashed border-forest-500/20 px-4 text-xs font-medium text-forest-600"
          >
            Copy text for any platform
          </button>
          {detailUrl ? (
            <button
              type="button"
              onClick={copyDetailHint}
              className="col-span-2 min-h-[42px] border border-dashed border-forest-500/20 px-4 text-xs font-medium text-forest-600"
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
