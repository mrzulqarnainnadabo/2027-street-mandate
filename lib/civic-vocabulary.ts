import vocab from "../shared/civic-vocabulary.v1.json";

export type CivicVocabulary = typeof vocab;

export const CIVIC_VOCABULARY: CivicVocabulary = vocab;
export const VOCAB_VERSION = vocab.version;

export function dutyIds(): string[] {
  return vocab.duties.map((d) => d.id);
}

export function pillarForDuty(dutyId: string): string[] {
  const d = vocab.duties.find((x) => x.id === dutyId || x.label === dutyId);
  return d?.pillars ?? [];
}
