/**
 * Track Mandate — local follow list for Published mandates.
 * NOT a vote, support count, ranking, or popularity metric.
 */

const STORAGE_KEY = "iseyc_tracked_mandates_v1";

export type TrackedMandate = {
  id: string;
  sentence: string;
  state: string;
  duty: string;
  trackedAt: string;
};

function readAll(): TrackedMandate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: TrackedMandate[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
}

export function listTrackedMandates(): TrackedMandate[] {
  return readAll();
}

export function isTracked(id: string): boolean {
  const clean = id.replace(/-/g, "");
  return readAll().some((t) => t.id.replace(/-/g, "") === clean);
}

export function trackMandate(input: {
  id: string;
  sentence: string;
  state: string;
  duty: string;
}): TrackedMandate[] {
  const id = input.id.replace(/-/g, "");
  const prev = readAll().filter((t) => t.id.replace(/-/g, "") !== id);
  const next: TrackedMandate = {
    id,
    sentence: input.sentence.slice(0, 200),
    state: input.state || "",
    duty: input.duty || "",
    trackedAt: new Date().toISOString(),
  };
  const all = [next, ...prev];
  writeAll(all);
  return all;
}

export function untrackMandate(id: string): TrackedMandate[] {
  const clean = id.replace(/-/g, "");
  const all = readAll().filter((t) => t.id.replace(/-/g, "") !== clean);
  writeAll(all);
  return all;
}
