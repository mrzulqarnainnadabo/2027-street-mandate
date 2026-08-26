import { NextRequest, NextResponse } from "next/server";
import { submitVoice } from "@/lib/notion";
import { MANDATES, WILL_VOTE, STATES, MAX_SENTENCE } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sentence, mandate, willVote, state, ageBand, gender, deviceId } = body;

    if (!sentence || typeof sentence !== "string" || sentence.trim().length < 5) {
      return NextResponse.json({ error: "Please write a short sentence." }, { status: 400 });
    }
    if (sentence.length > MAX_SENTENCE) {
      return NextResponse.json({ error: `Max ${MAX_SENTENCE} characters.` }, { status: 400 });
    }
    if (!MANDATES.find((m) => m.id === mandate)) {
      return NextResponse.json({ error: "Invalid mandate." }, { status: 400 });
    }
    if (!WILL_VOTE.find((w) => w.id === willVote)) {
      return NextResponse.json({ error: "Invalid vote intent." }, { status: 400 });
    }
    if (!STATES.includes(state)) {
      return NextResponse.json({ error: "Invalid state." }, { status: 400 });
    }

    const id = await submitVoice({
      sentence: sentence.trim(),
      mandate,
      willVote,
      state,
      ageBand,
      gender,
      deviceId: deviceId || "unknown",
    });

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: err.message || "Could not save your voice. Please try again." },
      { status: 500 }
    );
  }
}
