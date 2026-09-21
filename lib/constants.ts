/** Phase 0 duty taxonomy — what must public office deliver */
export const DUTIES = [
  { id: "Health", label: "Health", icon: "🏥" },
  { id: "Education", label: "Education", icon: "📚" },
  { id: "Security", label: "Security", icon: "🛡️" },
  { id: "Jobs & Economic Opportunity", label: "Jobs & Economy", icon: "💼" },
  { id: "Power", label: "Power", icon: "⚡" },
  { id: "Water", label: "Water", icon: "💧" },
  { id: "Roads & Transport", label: "Roads & Transport", icon: "🛣️" },
  { id: "Agriculture", label: "Agriculture", icon: "🌾" },
  { id: "Housing", label: "Housing", icon: "🏠" },
  { id: "Environment", label: "Environment", icon: "🌿" },
  { id: "Digital Infrastructure", label: "Digital Infrastructure", icon: "📡" },
  { id: "Youth Development", label: "Youth Development", icon: "🎓" },
  { id: "Women's Development", label: "Women's Development", icon: "💜" },
  { id: "Social Protection", label: "Social Protection", icon: "🤝" },
  { id: "Public Finance", label: "Public Finance", icon: "📊" },
  { id: "Anti-Corruption / Transparency", label: "Transparency", icon: "🔍" },
  { id: "Justice", label: "Justice", icon: "⚖️" },
  { id: "Other", label: "Other", icon: "✨" },
] as const;

/** @deprecated Use DUTIES — kept for pulse mapping of legacy Notion rows */
export const MANDATES = DUTIES;

export const OFFICES = [
  { id: "President", label: "President", hint: "National executive — federal programmes, security architecture, macro policy" },
  { id: "Vice President", label: "Vice President", hint: "National executive support & assigned portfolios" },
  { id: "Governor", label: "Governor", hint: "State executive — most primary health, state schools, state roads" },
  { id: "Deputy Governor", label: "Deputy Governor", hint: "State executive support & assigned portfolios" },
  { id: "Senator", label: "Senator", hint: "National Assembly — laws, oversight, constituency advocacy" },
  { id: "House of Representatives", label: "House of Representatives", hint: "National Assembly — laws, oversight, federal constituency" },
  { id: "State House of Assembly", label: "State House of Assembly", hint: "State laws, budgets, oversight of state executive" },
  { id: "Unsure", label: "Not sure which office", hint: "We will still publish your demand; office can be refined later" },
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

/** Quality floor for a publishable civic demand (form + API must match) */
export const MIN_SENTENCE = 20;
export const MAX_SENTENCE = 200;

export const LEGACY_DUTY_MAP: Record<string, string> = {
  "Security & Safety": "Security",
  "Jobs & Economy": "Jobs & Economic Opportunity",
  "Credible Candidates": "Anti-Corruption / Transparency",
  "Honest Elections": "Justice",
  "Education & Youth": "Education",
  "Health & Basic Services": "Health",
  "Electricity & Infrastructure": "Power",
  Other: "Other",
};

export function normalizeDuty(raw: string): string {
  if (DUTIES.some((d) => d.id === raw)) return raw;
  return LEGACY_DUTY_MAP[raw] || "Other";
}

export const PROMPT_EXAMPLES: Record<string, string[]> = {
  Health: [
    "Every public primary health centre stocked with essential medicines and a qualified worker.",
    "Maternal care that does not require families to buy basic supplies from outside.",
  ],
  Education: [
    "Public schools with teachers present every school day.",
    "Scholarships tied to skills Nigeria actually needs.",
  ],
  Security: [
    "Neighbourhood response that arrives before midnight when called.",
    "Safe routes so students can return from school without fear.",
  ],
  "Jobs & Economic Opportunity": [
    "Skills centres that lead to real paid work for young people.",
    "Local production supported so graduates are not forced to leave.",
  ],
  Power: [
    "Power that stays on long enough for small shops to work a full day.",
    "Transparent schedules communities can plan around.",
  ],
  Water: [
    "Clean water that reaches every ward, not only the LGA headquarters.",
    "Boreholes maintained within 30 days of breakdown reports.",
  ],
  "Roads & Transport": [
    "Roads that do not wash away every rainy season.",
    "Public transport routes published and kept to schedule.",
  ],
  Agriculture: [
    "Extension support and storage so harvests are not lost to waste.",
    "Fair access to inputs for smallholder farmers.",
  ],
  Housing: [
    "Clear, fair process for land and housing documentation.",
    "Basic services connected when new housing is approved.",
  ],
  Environment: [
    "Refuse collection on a published weekly schedule.",
    "Flood drains cleared before each rainy season.",
  ],
  "Digital Infrastructure": [
    "Public access points in schools and civic centres.",
    "Government services usable on a basic smartphone.",
  ],
  "Youth Development": [
    "Apprenticeship placements with real stipends, not empty registers.",
    "Safe public spaces for youth recreation and training.",
  ],
  "Women's Development": [
    "Support services for survivors that respond within 48 hours.",
    "Markets with lighting and security for women traders.",
  ],
  "Social Protection": [
    "Transparent lists of who receives support and why.",
    "Disability access at public primary health centres.",
  ],
  "Public Finance": [
    "Quarterly public dashboards of budget release vs spending.",
    "Contract awards published with amounts and contractors.",
  ],
  "Anti-Corruption / Transparency": [
    "Asset declarations accessible without FOI delays.",
    "One clear channel to report and track service failure.",
  ],
  Justice: [
    "Court cases involving citizens tracked with public timelines.",
    "Legal aid desks that open on published hours.",
  ],
  Other: [
    "One clear promise kept within the first 100 days — published and measured.",
    "A public dashboard that shows where our money went.",
  ],
};
