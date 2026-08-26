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

export const PROMPT_EXAMPLES: Record<string, string[]> = {
  "Security & Safety": [
    "Neighbourhood patrols that actually respond before midnight.",
    "Safe roads so girls can return from school without fear.",
  ],
  "Jobs & Economy": [
    "Skills centres that lead to real paid work for young people.",
    "Local factories open so our graduates stop leaving the state.",
  ],
  "Credible Candidates": [
    "Leaders with public asset declarations and clean records.",
    "Candidates who debate policy, not just party slogans.",
  ],
  "Honest Elections": [
    "Results announced at the polling unit before they leave.",
    "BVAS that works and paper trails anyone can check.",
  ],
  "Education & Youth": [
    "Public schools with teachers present every school day.",
    "Scholarships tied to skills Nigeria actually needs.",
  ],
  "Health & Basic Services": [
    "Primary health centres stocked with basic medicines.",
    "Clean water that reaches every ward, not only the LGA HQ.",
  ],
  "Electricity & Infrastructure": [
    "Power that stays on long enough for small shops to work.",
    "Roads that do not wash away every rainy season.",
  ],
  "Other": [
    "One clear promise kept within the first 100 days.",
    "Public dashboards that show where our money went.",
  ],
};
