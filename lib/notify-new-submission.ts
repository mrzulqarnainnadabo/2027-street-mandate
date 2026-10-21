/**
 * Internal admin alert after a Civic Mandate is persisted as New.
 * Does not email the citizen. Must not fail the public submit response.
 *
 * Provider: Resend (HTTPS). Configure RESEND_API_KEY on Vercel.
 * Recipients: ISEYC_NOTIFY_TO (comma-separated) or defaults to iseycglobal@gmail.com
 *             plus FOUNDER_NOTIFY_EMAIL when set.
 */

import { ISEYC_EMAIL } from "@/lib/brand";

export type NewSubmissionNotifyInput = {
  id: string;
  sentence: string;
  duty: string;
  office: string;
  state: string;
  lga?: string;
  submittedAtIso?: string;
};

export type NotifyResult = {
  attempted: boolean;
  skippedReason?: string;
  ok?: boolean;
  status?: number;
  recipientCount?: number;
};

const recentKeys = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;

function pruneIdempotency(now: number) {
  for (const [k, t] of recentKeys) {
    if (now - t > IDEMPOTENCY_TTL_MS) recentKeys.delete(k);
  }
}

function recipients(): string[] {
  const fromEnv = (process.env.ISEYC_NOTIFY_TO || "").trim();
  const list = new Set<string>();
  if (fromEnv) {
    for (const part of fromEnv.split(",")) {
      const e = part.trim().toLowerCase();
      if (e.includes("@")) list.add(e);
    }
  } else {
    list.add(ISEYC_EMAIL.toLowerCase());
  }
  const founder = (process.env.FOUNDER_NOTIFY_EMAIL || "").trim().toLowerCase();
  if (founder.includes("@")) list.add(founder);
  return [...list];
}

function sanitiseSummary(sentence: string): string {
  const oneLine = sentence.replace(/\s+/g, " ").trim().slice(0, 280);
  return oneLine || "(no summary)";
}

export function buildAdminNotifyPayload(input: NewSubmissionNotifyInput) {
  const when = input.submittedAtIso || new Date().toISOString();
  const summary = sanitiseSummary(input.sentence);
  const statusUrl = `https://2027-street-mandate.vercel.app/status/${input.id.replace(/-/g, "")}`;
  const subject = "[ISEYC Civic Mandate] New submission awaiting review";
  const text = [
    "A new Civic Mandate submission was saved and is awaiting human review.",
    "",
    `Reference ID: ${input.id}`,
    `Submitted (UTC): ${when}`,
    `Status: New — Pending Human Review`,
    `State: ${input.state}`,
    `LGA: ${input.lga?.trim() || "—"}`,
    `Duty: ${input.duty}`,
    `Office: ${input.office}`,
    `Summary: ${summary}`,
    "",
    `Operator status link: ${statusUrl}`,
    "",
    "This alert is internal only. Submission does not mean publication, referral, acknowledgement, or resolution.",
    "Do not forward this email to citizens as a promise of government action.",
  ].join("\n");
  return { subject, text, summary };
}

/**
 * Best-effort admin notification. Never throws to the submit handler.
 */
export async function notifyAdminsOfNewSubmission(
  input: NewSubmissionNotifyInput,
): Promise<NotifyResult> {
  try {
    const apiKey = (process.env.RESEND_API_KEY || "").trim();
    if (!apiKey) {
      return { attempted: false, skippedReason: "RESEND_API_KEY not configured" };
    }

    const to = recipients();
    if (!to.length) {
      return { attempted: false, skippedReason: "no recipients" };
    }

    const now = Date.now();
    pruneIdempotency(now);
    const idem = `mandate-new-${input.id}`;
    if (recentKeys.has(idem)) {
      return { attempted: false, skippedReason: "duplicate_suppressed" };
    }
    recentKeys.set(idem, now);

    const from =
      (process.env.RESEND_FROM_EMAIL || "").trim() || "ISEYC Civic Mandate <onboarding@resend.dev>";
    const { subject, text } = buildAdminNotifyPayload(input);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idem.slice(0, 256),
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      console.error("notify_new_submission_failed", res.status);
      return { attempted: true, ok: false, status: res.status, recipientCount: to.length };
    }
    return { attempted: true, ok: true, status: res.status, recipientCount: to.length };
  } catch (err) {
    console.error("notify_new_submission_error");
    return { attempted: true, ok: false };
  }
}
