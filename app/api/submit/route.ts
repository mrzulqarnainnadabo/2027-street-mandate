import { NextRequest, NextResponse } from "next/server";
import { submitVoice } from "@/lib/notion";
import { DUTIES, KADUNA_LGAS, MAX_SENTENCE, OFFICE_OPTIONS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sentence, office, lga, duty, state, source, deviceId } = body;

    if (!sentence || typeof sentence !== "string" || sentence.trim().length < 5) {
      return NextResponse.json(
        { error: "Please write one concrete demand." },
        { status: 400 }
      );
    }

    if (sentence.length > MAX_SENTENCE) {
      return NextResponse.json(
        { error: `Max ${MAX_SENTENCE} characters.` },
        { status: 400 }
      );
    }

    if (!OFFICE_OPTIONS.some((item) => item.id === office)) {
      return NextResponse.json({ error: "Invalid office." }, { status: 400 });
    }

    if (!KADUNA_LGAS.includes(lga)) {
      return NextResponse.json({ error: "Invalid Kaduna LGA." }, { status: 400 });
    }

    if (!DUTIES.some((item) => item.id === duty)) {
      return NextResponse.json({ error: "Invalid duty." }, { status: 400 });
    }

    if (state !== "Kaduna") {
      return NextResponse.json({ error: "Phase 0 is currently Kaduna-first." }, { status: 400 });
    }

    const id = await submitVoice({
      sentence: sentence.trim(),
      office,
      lga,
      duty,
      state,
      source: source || "Direct Link",
      deviceId: deviceId || "unknown",
    });

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: err.message || "Could not save your mandate. Please try again." },
      { status: 500 }
    );
  }
}