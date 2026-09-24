/**
 * Sample duty → office responsibility map (ISEYC DERIVED, pilot).
 * Not official law. Confidence allows Shared / Unclear.
 * LEGAL REVIEW REQUIRED before asserting any mapping as definitive.
 */

export type ResponsibilityConfidence = "Primary" | "Shared" | "Unclear";

export type ResponsibilityRow = {
  duty: string;
  exampleDemand: string;
  offices: { office: string; role: string; confidence: ResponsibilityConfidence }[];
  note: string;
  legalBasisHint: string;
};

export const RESPONSIBILITY_MAP_VERSION = "2026-09-24-pilot";

export const RESPONSIBILITY_ROWS: ResponsibilityRow[] = [
  {
    duty: "Health",
    exampleDemand: "Public primary health centres stocked with essential medicines and a qualified worker.",
    offices: [
      { office: "Governor", role: "State primary health system, PHCs, state hospitals", confidence: "Primary" },
      { office: "President", role: "Federal tertiary programmes, national health policy, NHIA architecture", confidence: "Shared" },
      { office: "House of Representatives", role: "Federal law and oversight on health budgets", confidence: "Shared" },
    ],
    note: "Local Government also runs some primary services in practice; allocation varies by state.",
    legalBasisHint: "Constitutional health is concurrent; exact PHC responsibility is Shared/Unclear by state practice.",
  },
  {
    duty: "Security",
    exampleDemand: "Neighbourhood response that arrives before midnight when called.",
    offices: [
      { office: "President", role: "Federal security architecture, police (federal), armed forces", confidence: "Primary" },
      { office: "Governor", role: "State security votes, coordination, some community programmes", confidence: "Shared" },
      { office: "Senator", role: "Oversight and constituency advocacy — not operational command", confidence: "Shared" },
    ],
    note: "State policing proposals may change this map. Do not treat any single office as sole owner without updated law.",
    legalBasisHint: "Police remain largely federal under current framework; state roles are real but not exclusive.",
  },
  {
    duty: "Education",
    exampleDemand: "Public schools with teachers present every school day.",
    offices: [
      { office: "Governor", role: "State basic education, many secondary schools, SUBEB linkage", confidence: "Primary" },
      { office: "President", role: "Federal unity colleges, tertiary, UBEC framework", confidence: "Shared" },
      { office: "State House of Assembly", role: "State education law and budget oversight", confidence: "Shared" },
    ],
    note: "Basic education delivery is heavily state-led; federal support is real but not the classroom owner.",
    legalBasisHint: "Education is concurrent; classroom staffing is usually state/LGA operational.",
  },
  {
    duty: "Power",
    exampleDemand: "Power that stays on long enough for small shops to work a full day.",
    offices: [
      { office: "President", role: "Federal power policy, transmission, major generation framework", confidence: "Primary" },
      { office: "Governor", role: "State initiatives, distribution friction, some embedded generation", confidence: "Shared" },
      { office: "House of Representatives", role: "Legislative oversight of power sector", confidence: "Shared" },
    ],
    note: "Disco performance and regulation sit outside a single elected desk; map is deliberately Unclear at the last mile.",
    legalBasisHint: "Sector is multi-agency; elected offices set policy and oversight more than daily feeder repair.",
  },
  {
    duty: "Water",
    exampleDemand: "Clean water that reaches every ward, not only the LGA headquarters.",
    offices: [
      { office: "Governor", role: "State water boards and major schemes", confidence: "Primary" },
      { office: "President", role: "Federal river-basin and large capital projects", confidence: "Shared" },
    ],
    note: "LGA and community schemes matter operationally; public map stays at State/Federal offices users can name.",
    legalBasisHint: "Water is concurrent and highly local in delivery.",
  },
  {
    duty: "Roads & Transport",
    exampleDemand: "Roads that do not wash away every rainy season.",
    offices: [
      { office: "Governor", role: "State roads", confidence: "Primary" },
      { office: "President", role: "Federal highways", confidence: "Primary" },
      { office: "House of Representatives", role: "Federal constituency roads advocacy and oversight", confidence: "Shared" },
    ],
    note: "Which road is federal vs state is a frequent source of Unclear blame — always prefer specific corridor when known.",
    legalBasisHint: "Road class determines office; without class, confidence is Unclear.",
  },
];

export function rowsForDuty(duty: string): ResponsibilityRow | undefined {
  return RESPONSIBILITY_ROWS.find((r) => r.duty === duty);
}
