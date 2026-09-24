/**
 * Public civic voice allowlist — single source of truth for audits.
 * mapPageToVoice in notion.ts must only emit these keys (plus id/created).
 * Never add: Age Band, Gender, Device Fingerprint, response-tracking fields.
 */

export const PUBLIC_VOICE_KEYS = [
  "id",
  "sentence",
  "mandate",
  "duty",
  "office",
  "state",
  "lga",
  "created",
] as const;

export type PublicVoiceKey = (typeof PUBLIC_VOICE_KEYS)[number];

export const OPERATOR_ONLY_FIELD_NAMES = [
  "Device Fingerprint",
  "Age Band",
  "Gender",
  "Responsible Institution",
  "Response Requested",
  "Response Received",
  "Follow-up Date",
  "Resolution Status",
  "Response Evidence",
] as const;
