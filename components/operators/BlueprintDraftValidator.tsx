"use client";

import { useState } from "react";
import {
  validateBlueprintDraft,
  normalizeBlueprintOptionals,
  type BlueprintDraftInput,
} from "@/lib/civic-record/validate-blueprint";

export default function BlueprintDraftValidator() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<string>("");

  function run() {
    try {
      const parsed = JSON.parse(raw) as BlueprintDraftInput;
      const v = validateBlueprintDraft(parsed);
      const normalized = normalizeBlueprintOptionals(parsed);
      setResult(
        JSON.stringify(
          {
            ok: v.ok,
            errors: v.errors,
            warnings: v.warnings,
            normalizedOptionals: normalized,
          },
          null,
          2
        )
      );
    } catch {
      setResult(JSON.stringify({ ok: false, errors: ["Invalid JSON"] }, null, 2));
    }
  }

  return (
    <div className="rounded-xl border border-forest-500/15 bg-white p-4 text-xs">
      <h2 className="font-display text-base font-bold text-forest-900">Draft JSON validator</h2>
      <p className="mt-1 text-forest-600">
        Paste one pilot row (see example template). Runs in-browser only — nothing is saved.
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={8}
        className="mt-3 w-full rounded-md border border-forest-500/20 bg-cream/50 p-2 font-mono text-[11px] text-forest-900 outline-none focus:border-forest-500"
        placeholder='{ "actorDisplayName": "…", "officeSought": "President", … }'
      />
      <button
        type="button"
        onClick={run}
        className="mt-2 min-h-[40px] w-full rounded-md bg-forest-500 text-sm font-bold text-white"
      >
        Validate draft
      </button>
      {result ? (
        <pre className="mt-3 overflow-x-auto rounded-md border border-forest-500/10 bg-forest-50 p-2 text-[10px] text-forest-800">
          {result}
        </pre>
      ) : null}
    </div>
  );
}
