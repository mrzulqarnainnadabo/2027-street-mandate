import { NextRequest, NextResponse } from "next/server";
import { submitVoice } from "@/lib/notion";
import { DUTIES, OFFICES, STATES, MAX_SENTENCE } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sentence, duty, mandate, office, state, lga, ageBand, gender, deviceId } = body;
    const dutyId = duty || mandate;

    if (!sentence || typeof sentence !== "string" || sentence.trim().length < 5) {
      return NextResponse.json(
        { error: "Please write a clear demand (at least 5 characters)." },
        { status: 400 }
      );
    }
    if (sentence.length > MAX_SENTENCE) {
      return NextResponse.json({ error: `Max ${MAX_SENTENCE} characters.` }, { status: 400 });
    }
    if (!DUTIES.find((d) => d.id === dutyId)) {
      return NextResponse.json({ error: "Invalid duty category." }, { status: 400 });
    }
    if (!OFFICES.find((o) => o.id === office)) {
      return NextResponse.json({ error: "Invalid office." }, { status: 400 });
    }
    if (!STATES.includes(state)) {
      return NextResponse.json({ error: "Invalid state." }, { status: 400 });
    }

    const id = await submitVoice({
      sentence: sentence.trim(),
      duty: dutyId,
      office,
      state,
      lga: typeof lga === "string" ? lga : undefined,
      ageBand,
      gender,
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
