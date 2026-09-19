export const OFFICE_OPTIONS = [
  {
    id: "President",
    label: "President",
    helper: "Federal / national delivery",
  },
  {
    id: "Governor",
    label: "Governor",
    helper: "Kaduna State delivery",
  },
  {
    id: "Senator",
    label: "Senator",
    helper: "Senate representation",
  },
  {
    id: "Representative",
    label: "House of Representatives",
    helper: "Federal constituency",
  },
] as const;

export const DUTIES = [
  { id: "Health", label: "Health", icon: "🏥" },
  { id: "Security", label: "Security", icon: "🛡️" },
  { id: "Education", label: "Education", icon: "📚" },
  { id: "Jobs", label: "Jobs", icon: "💼" },
  { id: "Power", label: "Power", icon: "⚡" },
  { id: "Water", label: "Water", icon: "💧" },
  { id: "Roads", label: "Roads", icon: "🛣️" },
  { id: "Corruption control", label: "Corruption control", icon: "⚖️" },
] as const;

export const KADUNA_LGAS = [
  "Birnin Gwari",
  "Chikun",
  "Giwa",
  "Igabi",
  "Ikara",
  "Jaba",
  "Jema'a",
  "Kachia",
  "Kaduna North",
  "Kaduna South",
  "Kagarko",
  "Kajuru",
  "Kaura",
  "Kauru",
  "Kubau",
  "Kudan",
  "Lere",
  "Makarfi",
  "Sabon Gari",
  "Sanga",
  "Soba",
  "Zangon Kataf",
  "Zaria",
] as const;

export const STATES = [
  "Kaduna",
] as const;

export const MAX_SENTENCE = 180;

export const PROMPT_EXAMPLES: Record<string, string[]> = {
  Health: [
    "Primary health centres should have essential medicines and staff.",
    "Basic maternal and emergency care should be available in my LGA.",
  ],
  Security: [
    "Security response should reach vulnerable communities quickly.",
    "Safe roads and neighbourhoods should be a measurable priority.",
  ],
  Education: [
    "Public schools should have teachers present and learning materials.",
    "Young people should have practical skills linked to real opportunities.",
  ],
  Jobs: [
    "Local job and skills programmes should lead to measurable placements.",
    "Small businesses should have reliable conditions to grow and hire.",
  ],
  Power: [
    "Electricity should be reliable enough for homes and small businesses.",
    "Power projects should publish locations, budgets and delivery status.",
  ],
  Water: [
    "Every ward should have dependable access to clean water.",
    "Broken public water points should be repaired and tracked.",
  ],
  Roads: [
    "Road projects should publish budgets, locations and completion dates.",
    "Flood-prone roads should be repaired before the next rainy season.",
  ],
  "Corruption control": [
    "Public projects should publish budgets, contractors and delivery status.",
    "Public spending should be easier for citizens to track.",
  ],
};