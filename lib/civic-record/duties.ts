import { DUTIES } from "@/lib/constants";

/**
 * Single duty vocabulary across Mandate, Blueprint, and Commitment pilots.
 * Prefer these ids in Notion select options for all three databases.
 */
export const CIVIC_RECORD_DUTY_IDS = DUTIES.map((d) => d.id);

export const CIVIC_RECORD_DUTY_OPTIONS = DUTIES.map((d) => ({
  id: d.id,
  label: d.label,
}));

export function isKnownDuty(id: string): boolean {
  return CIVIC_RECORD_DUTY_IDS.includes(id as (typeof CIVIC_RECORD_DUTY_IDS)[number]);
}
