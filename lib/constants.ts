export const MANDATES = [
  { id: "Security & Safety", label: "Security & Safety", icon: "🛡️" },
  { id: "Jobs & Economy", label: "Jobs & Economy", icon: "💼" },
  { id: "Credible Candidates", label: "Credible Candidates", icon: "🗳️" },
  { id: "Honest Elections", label: "Honest Elections", icon: "⚖️" },
  { id: "Education & Youth", label: "Education & Youth", icon: "📚" },
  { id: "Health & Basic Services", label: "Health & Basic Services", icon: "🏥" },
  { id: "Electricity & Infrastructure", label: "Electricity & Infrastructure", icon: "⚡" },
  { id: "Other", label: "Other", icon: "✨" },
] as const;

export const WILL_VOTE = [
  { id: "Yes definitely", label: "Yes, definitely" },
  { id: "Yes if safe", label: "Yes, if it is safe" },
  { id: "Not sure", label: "Not sure" },
  { id: "No vote will not count", label: "No — my vote will not count" },
] as const;

export const STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa",
  "Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger",
  "Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe",
  "Zamfara","FCT"
] as const;

export const AGE_BANDS = ["18-24","25-34","35-44","45+","Prefer not"] as const;
export const GENDERS = ["Male","Female","Prefer not"] as const;

export const MAX_SENTENCE = 140;
