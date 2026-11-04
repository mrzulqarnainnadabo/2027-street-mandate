import { NextRequest, NextResponse } from "next/server";
import { submitCommunityObservation } from "@/lib/community-observations";
import { checkRateLimit, clientIpFromRequest } from "@/lib/rate-limit";
import { STATES } from "@/lib/constants";

const REPORT_TYPES = [
  "Service access gap",
  "Service quality concern",
  "Facility condition",
  "Public project or commitment",
  "Environmental condition",
  "Safety concern",
  "Other",
] as const;

const SECTORS = [
  "Health",
  "Education",
  "Security",
  "Infrastructure",
  "Water and sanitation",
  "Employment",
  "Public finance",
  "Governance",
  "Agriculture",
  "Environment",
] as const;

const EVIDENCE_TYPES = [
  "First-hand observation",
  "Photograph or document",
  "Official record",
  "Witness account",
  "Public media report",
  "Other",
] as const;

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized && normalized.length <= max ? normalized : undefined;
}

function containsContactDetails(value: string): boolean {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value);
  const phone = /(?:\+?234|0)[\s-]?(?:\d[\s-]?){9,10}/.test(value);
  return email || phone;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid report." }, { status: 400 });
    }

    const title = text(body.title, 120);
    const description = text(body.description, 1500);
    const sourceContext = text(body.sourceContext, 500);
    const reportType = text(body.reportType, 80);
    const sector = text(body.sector, 80);
    const state = text(body.state, 80);
    const lga = text(body.lga, 120);
    const ward = text(body.ward, 120);
    const placeOrFacility = text(body.placeOrFacility, 180);
    const observedOn = text(body.observedOn, 10);
    const evidenceLink = text(body.evidenceLink, 2000);
    const evidenceTypes: string[] = Array.isArray(body.evidenceTypes)
      ? body.evidenceTypes.filter((value: unknown): value is string => typeof value === "string")
      : [];

    if (!title || title.length < 5) {
      return NextResponse.json({ error: "Add a short, specific report title (at least 5 characters)." }, { status: 400 });
    }
    if (!description || description.length < 30) {
      return NextResponse.json({ error: "Describe what happened or what you observed (at least 30 characters)." }, { status: 400 });
    }
    if (!sourceContext || sourceContext.length < 15) {
      return NextResponse.json({ error: "Explain how you know this information (at least 15 characters)." }, { status: 400 });
    }
    if (!reportType || !REPORT_TYPES.includes(reportType as (typeof REPORT_TYPES)[number])) {
      return NextResponse.json({ error: "Choose a valid report type." }, { status: 400 });
    }
    if (!sector || !SECTORS.includes(sector as (typeof SECTORS)[number])) {
      return NextResponse.json({ error: "Choose a valid sector." }, { status: 400 });
    }
    if (!state || !STATES.includes(state as (typeof STATES)[number])) {
      return NextResponse.json({ error: "Choose a valid state." }, { status: 400 });
    }
    if (body.lga !== undefined && (typeof body.lga !== "string" || body.lga.trim().length > 120)) {
      return NextResponse.json({ error: "LGA must be 120 characters or fewer." }, { status: 400 });
    }
    if (body.ward !== undefined && (typeof body.ward !== "string" || body.ward.trim().length > 120)) {
      return NextResponse.json({ error: "Ward must be 120 characters or fewer." }, { status: 400 });
    }
    if (body.placeOrFacility !== undefined && (typeof body.placeOrFacility !== "string" || body.placeOrFacility.trim().length > 180)) {
      return NextResponse.json({ error: "Place or facility must be 180 characters or fewer." }, { status: 400 });
    }
    if (body.observedOn !== undefined && (!observedOn || !/^\d{4}-\d{2}-\d{2}$/.test(observedOn) || Number.isNaN(Date.parse(observedOn)))) {
      return NextResponse.json({ error: "Use a valid observation date." }, { status: 400 });
    }
    if (evidenceTypes.length < 1 || evidenceTypes.length > 4 || evidenceTypes.some((item) => !EVIDENCE_TYPES.includes(item as (typeof EVIDENCE_TYPES)[number]))) {
      return NextResponse.json({ error: "Select between one and four evidence types." }, { status: 400 });
    }
    if (body.evidenceLink !== undefined) {
      try {
        const parsed = new URL(String(body.evidenceLink));
        if (parsed.protocol !== "https:" || !evidenceLink) throw new Error("invalid");
      } catch {
        return NextResponse.json({ error: "Evidence links must be valid HTTPS URLs." }, { status: 400 });
      }
    }

    const publicText = [title, description, sourceContext, lga || "", ward || "", placeOrFacility || ""].join(" ");
    if (containsContactDetails(publicText)) {
      return NextResponse.json({
        error: "Do not include personal phone numbers or email addresses. Reports are anonymous and should describe public conditions, not identify individuals.",
      }, { status: 400 });
    }

    const ip = clientIpFromRequest(req);
    const rate = checkRateLimit(`community-observation:${ip}`, 4, 30 * 60 * 1000);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Too many reports from this connection. Please wait and try again." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
      );
    }

    const id = await submitCommunityObservation({
      title,
      reportType,
      sector,
      state,
      lga,
      ward,
      placeOrFacility,
      observedOn,
      description,
      evidenceTypes,
      evidenceLink,
      sourceContext,
    });

    return NextResponse.json({
      ok: true,
      id,
      status: "received",
      message: "Your report has been received privately. It is not public until it has been reviewed and approved.",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Community observation submit error:", error?.message || error);
    const configurationError = /not configured/i.test(String(error?.message || ""));
    return NextResponse.json({
      error: configurationError
        ? "Community reporting is temporarily unavailable. Please try again later."
        : "We could not save this report. Your information has not been published.",
    }, { status: configurationError ? 503 : 500 });
  }
}
