/** Keys allowed on public Pulse / mandate surfaces. */

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
