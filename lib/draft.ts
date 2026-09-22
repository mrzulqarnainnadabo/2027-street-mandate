/** Local-only draft so a dropped connection does not erase a half-written mandate. Never uploaded until submit. */

export const DRAFT_KEY = "iseyc_mandate_draft_v1";

export type MandateDraft = {
  duty: string;
  office: string;
  state: string;
  lga: string;
  sentence: string;
  ageBand: string;
  gender: string;
  updatedAt: number;
};

export function loadDraft(): MandateDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MandateDraft;
    if (!parsed || typeof parsed.duty !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Omit<MandateDraft, "updatedAt">) {
  try {
    const payload: MandateDraft = { ...draft, updatedAt: Date.now() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
