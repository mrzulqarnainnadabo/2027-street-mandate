import { NextRequest, NextResponse } from "next/server";
import { submitVoice } from "@/lib/notion";
import {
  DUTIES,
  OFFICES,
  STATES,
  AGE_BANDS,
  GENDERS,
  MIN_SENTENCE,
  MAX_SENTENCE,
} from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const { sentence, duty, mandate, office, state, lga, ageBand, gender, deviceId } = body as Record<string, unknown>;
    const dutyId = typeof duty === "string" && duty ? duty : mandate;

    if (typeof sentence !== "string" || sentence.trim().length < MIN_SENTENCE) {
      return NextResponse.json(
        {
          error: `Please write a clearer demand (at least ${MIN_SENTENCE} characters). Name a service or outcome — not a party slogan.`,
        },
        { status: 400 }
      );
    }
    if (sentence.trim().length > MAX_SENTENCE) {
      return NextResponse.json({ error: `Max ${MAX_SENTENCE} characters.` }, { status: 400 });
    }
    if (typeof dutyId !== "string" || !DUTIES.some((d) => d.id === dutyId)) {
      return NextResponse.json({ error: "Invalid duty category." }, { status: 400 });
    }
    if (typeof office !== "string" || !OFFICES.some((o) => o.id === office)) {
      return NextResponse.json({ error: "Invalid office." }, { status: 400 });
    }
    if (typeof state !== "string" || !STATES.includes(state as (typeof STATES)[number])) {
      return NextResponse.json({ error: "Invalid state." }, { status: 400 });
    }
    if (ageBand !== undefined && (typeof ageBand !== "string" || !AGE_BANDS.includes(ageBand as (typeof AGE_BANDS)[number]))) {
      return NextResponse.json({ error: "Invalid age band." }, { status: 400 });
    }
    if (gender !== undefined && (typeof gender !== "string" || !GENDERS.includes(gender as (typeof GENDERS)[number]))) {
      return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
    }
    if (lga !== undefined && (typeof lga !== "string" || lga.trim().length > 120)) {
      return NextResponse.json({ error: "LGA must be 120 characters or fewer." }, { status: 400 });
    }
    if (deviceId !== undefined && (typeof deviceId !== "string" || deviceId.length > 200)) {
      return NextResponse.json({ error: "Invalid device reference." }, { status: 400 });
    }

    const id = await submitVoice({
      sentence: sentence.trim(),
      duty: dutyId,
      office,
      state,
      lga: typeof lga === "string" ? lga : undefined,
      ageBand: typeof ageBand === "string" ? ageBand : undefined,
      gender: typeof gender === "string" ? gender : undefined,
      deviceId: typeof deviceId === "string" && deviceId ? deviceId : "unknown",
    });

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("Submit error:", err);
    const message = String(err?.message || "");
    const configFailure =
      /not configured|Notion not configured|missing Notion|Share the database/i.test(message);

    return NextResponse.json(
      {
        error: configFailure
          ? "Civic submission is temporarily unavailable. Please try again later."
          : message || "Could not save your mandate. Please try again.",
      },
      { status: configFailure ? 503 : 500 }
    );
  }
}
