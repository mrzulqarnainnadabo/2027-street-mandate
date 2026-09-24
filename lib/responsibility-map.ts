/**
 * Duty → office responsibility map (ISEYC DERIVED, pilot).
 * Not official law. Confidence: Primary | Shared | Unclear.
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

export const RESPONSIBILITY_MAP_VERSION = "2026-09-24-pilot-v2";

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
    legalBasisHint: "Health is concurrent; PHC ownership is Shared/Unclear by state practice.",
  },
  {
    duty: "Education",
    exampleDemand: "Public schools with teachers present every school day.",
    offices: [
      { office: "Governor", role: "State basic education, many secondary schools, SUBEB linkage", confidence: "Primary" },
      { office: "President", role: "Federal unity colleges, tertiary, UBEC framework", confidence: "Shared" },
      { office: "State House of Assembly", role: "State education law and budget oversight", confidence: "Shared" },
    ],
    note: "Classroom staffing is usually state/LGA operational; federal support is real but not the daily owner.",
    legalBasisHint: "Education is concurrent.",
  },
  {
    duty: "Security",
    exampleDemand: "Neighbourhood response that arrives before midnight when called.",
    offices: [
      { office: "President", role: "Federal security architecture, police, armed forces", confidence: "Primary" },
      { office: "Governor", role: "State security votes, coordination, community programmes", confidence: "Shared" },
      { office: "Senator", role: "Oversight and constituency advocacy — not operational command", confidence: "Shared" },
    ],
    note: "State policing proposals may change this map. Do not treat one office as sole owner without updated law.",
    legalBasisHint: "Police remain largely federal under current framework.",
  },
  {
    duty: "Jobs & Economic Opportunity",
    exampleDemand: "Skills centres that lead to real paid work for young people.",
    offices: [
      { office: "Governor", role: "State skills, MSME support, local investment promotion", confidence: "Primary" },
      { office: "President", role: "National industrial policy, major programmes, fiscal macro", confidence: "Shared" },
      { office: "House of Representatives", role: "Federal budgets and labour/industry legislation", confidence: "Shared" },
    ],
    note: "Job creation is multi-actor; avoid treating one mandate as a guarantee of employment.",
    legalBasisHint: "Economic powers are concurrent and heavily programme-based.",
  },
  {
    duty: "Power",
    exampleDemand: "Power that stays on long enough for small shops to work a full day.",
    offices: [
      { office: "President", role: "Federal power policy, transmission, generation framework", confidence: "Primary" },
      { office: "Governor", role: "State initiatives, distribution friction, embedded generation", confidence: "Shared" },
      { office: "House of Representatives", role: "Legislative oversight of the power sector", confidence: "Shared" },
    ],
    note: "DisCos and regulators sit outside a single elected desk; last-mile confidence is often Unclear.",
    legalBasisHint: "Multi-agency sector; policy vs operations split.",
  },
  {
    duty: "Water",
    exampleDemand: "Clean water that reaches every ward, not only the LGA headquarters.",
    offices: [
      { office: "Governor", role: "State water boards and major schemes", confidence: "Primary" },
      { office: "President", role: "Federal river-basin and large capital projects", confidence: "Shared" },
    ],
    note: "LGA and community schemes matter operationally; public map stays at offices citizens can name.",
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
    note: "Federal vs state road class is a common source of Unclear blame — name the corridor when known.",
    legalBasisHint: "Road class determines office.",
  },
  {
    duty: "Agriculture",
    exampleDemand: "Extension support and storage so harvests are not lost to waste.",
    offices: [
      { office: "Governor", role: "State agriculture programmes, extension, storage schemes", confidence: "Primary" },
      { office: "President", role: "Federal agriculture policy, major value-chain programmes", confidence: "Shared" },
      { office: "State House of Assembly", role: "State agriculture budgets and oversight", confidence: "Shared" },
    ],
    note: "Land and input access often involve local actors not listed as elective offices here.",
    legalBasisHint: "Agriculture is concurrent.",
  },
  {
    duty: "Housing",
    exampleDemand: "Clear, fair process for land and housing documentation.",
    offices: [
      { office: "Governor", role: "State land administration, housing schemes", confidence: "Primary" },
      { office: "President", role: "Federal housing programmes and policy", confidence: "Shared" },
      { office: "State House of Assembly", role: "State land/housing legislation and oversight", confidence: "Shared" },
    ],
    note: "Title and allocation practice varies sharply by state; many steps are administrative, not electoral.",
    legalBasisHint: "Land is largely state-driven under the Land Use Act framework.",
  },
  {
    duty: "Environment",
    exampleDemand: "Refuse collection on a published weekly schedule.",
    offices: [
      { office: "Governor", role: "State environment agencies, major waste frameworks", confidence: "Primary" },
      { office: "President", role: "Federal environmental standards and large programmes", confidence: "Shared" },
    ],
    note: "Day-to-day refuse is often LGA/contractor — public map still points to offices citizens can demand from.",
    legalBasisHint: "Environment is concurrent; operations are highly local.",
  },
  {
    duty: "Digital Infrastructure",
    exampleDemand: "Government services usable on a basic smartphone.",
    offices: [
      { office: "President", role: "National digital policy, major connectivity programmes", confidence: "Primary" },
      { office: "Governor", role: "State e-services and digital access initiatives", confidence: "Shared" },
      { office: "House of Representatives", role: "Federal ICT legislation and oversight", confidence: "Shared" },
    ],
    note: "Telecom operators and regulators shape outcomes; elected offices set policy and public digital services.",
    legalBasisHint: "Policy is federal-heavy; service UX is multi-level.",
  },
  {
    duty: "Youth Development",
    exampleDemand: "Apprenticeship placements with real stipends, not empty registers.",
    offices: [
      { office: "Governor", role: "State youth programmes and skills schemes", confidence: "Primary" },
      { office: "President", role: "Federal youth and employment programmes", confidence: "Shared" },
      { office: "Senator", role: "Constituency advocacy and oversight of federal programmes", confidence: "Shared" },
    ],
    note: "Many schemes span ministries; demand the outcome, not a slogan.",
    legalBasisHint: "Programme-based; not a single exclusive constitutional desk.",
  },
  {
    duty: "Women's Development",
    exampleDemand: "Support services for survivors that respond within 48 hours.",
    offices: [
      { office: "Governor", role: "State women affairs and social services", confidence: "Primary" },
      { office: "President", role: "Federal women affairs policy and national programmes", confidence: "Shared" },
      { office: "State House of Assembly", role: "State protection laws and budget oversight", confidence: "Shared" },
    ],
    note: "Response quality depends on funded services, not titles alone.",
    legalBasisHint: "Shared social-sector competence.",
  },
  {
    duty: "Social Protection",
    exampleDemand: "Transparent lists of who receives support and why.",
    offices: [
      { office: "President", role: "Major federal social investment architecture", confidence: "Primary" },
      { office: "Governor", role: "State social support schemes", confidence: "Shared" },
      { office: "House of Representatives", role: "Federal budget oversight and transparency rules", confidence: "Shared" },
    ],
    note: "Registers and targeting are high-risk for privacy — demand transparency of process, not private data dumps.",
    legalBasisHint: "Programme design is multi-level; NDPA applies to personal data in registers.",
  },
  {
    duty: "Public Finance",
    exampleDemand: "Quarterly public dashboards of budget release vs spending.",
    offices: [
      { office: "Governor", role: "State budget execution and disclosure", confidence: "Primary" },
      { office: "President", role: "Federal budget execution and disclosure", confidence: "Primary" },
      { office: "State House of Assembly", role: "State budget passage and oversight", confidence: "Shared" },
      { office: "House of Representatives", role: "Federal budget passage and oversight", confidence: "Shared" },
    ],
    note: "Ask for published numbers, not insider access.",
    legalBasisHint: "Appropriation and oversight are core legislative/executive functions at each level.",
  },
  {
    duty: "Anti-Corruption / Transparency",
    exampleDemand: "One clear channel to report and track service failure.",
    offices: [
      { office: "President", role: "Federal anti-corruption architecture and open-government policy", confidence: "Primary" },
      { office: "Governor", role: "State transparency and complaint systems", confidence: "Shared" },
      { office: "Senator", role: "Oversight; not a substitute for investigative agencies", confidence: "Shared" },
    ],
    note: "This platform is not a corruption tip line. Do not publish unverified allegations about named private persons.",
    legalBasisHint: "Institutions (EFCC, ICPC, state bodies) are specialised; elected offices set policy and oversight.",
  },
  {
    duty: "Justice",
    exampleDemand: "Legal aid desks that open on published hours.",
    offices: [
      { office: "President", role: "Federal justice policy, federal courts architecture", confidence: "Primary" },
      { office: "Governor", role: "State judiciary support, state legal aid initiatives", confidence: "Shared" },
      { office: "State House of Assembly", role: "State justice-related legislation and budgets", confidence: "Shared" },
    ],
    note: "Courts are independent; demands should target accessible services and published process, not case outcomes.",
    legalBasisHint: "Judicial independence constrains what elected offices can order.",
  },
];

export function rowsForDuty(duty: string): ResponsibilityRow | undefined {
  return RESPONSIBILITY_ROWS.find((r) => r.duty === duty);
}
