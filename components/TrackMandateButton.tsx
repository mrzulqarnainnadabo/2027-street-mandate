"use client";

import { useEffect, useState } from "react";
import { isTracked, trackMandate, untrackMandate } from "@/lib/track-mandate";

type Props = {
  id: string;
  sentence: string;
  state: string;
  duty: string;
};

export default function TrackMandateButton({ id, sentence, state, duty }: Props) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOn(isTracked(id));
    setReady(true);
  }, [id]);

  if (!ready) {
    return (
      <div className="min-h-[44px] rounded-md border border-forest-500/15 bg-cream px-3 py-2 text-center text-xs text-forest-500">
        Loading track…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-forest-500/15 bg-white px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-forest-500">
        Track mandate · not a vote
      </p>
      <button
        type="button"
        className={`mt-2 min-h-[44px] w-full rounded-md px-3 text-sm font-bold ${
          on ? "border border-forest-500/30 bg-cream text-forest-800" : "bg-forest-600 text-white"
        }`}
        onClick={() => {
          if (on) {
            untrackMandate(id);
            setOn(false);
          } else {
            trackMandate({ id, sentence, state, duty });
            setOn(true);
          }
        }}
      >
        {on ? "Stop tracking on this device" : "Track this published mandate"}
      </button>
      <p className="mt-2 text-[11px] leading-snug text-forest-500">
        Saves a reminder on this phone only. It does not add support, ranking, or popularity.
      </p>
    </div>
  );
}
