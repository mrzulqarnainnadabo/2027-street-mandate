import Link from "next/link";
import { ISEYC_SEAL_SRC, ISEYC_WEB, ISEYC_EMAIL } from "@/lib/brand";
import { PUBLISHED_DEMAND_LABEL } from "@/lib/record-classes";

export const metadata = {
  title: "About & Non-Partisan Charter | Civic Mandate Nigeria",
  description:
    "Civic Mandate Nigeria is a non-partisan platform for citizen demands on public office — not candidate rankings.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-8 flex justify-center">
        <img
          src={ISEYC_SEAL_SRC}
          alt="ISEYC"
          width={80}
          height={80}
          className="h-20 w-20 rounded-full bg-white object-contain ring-1 ring-forest-500/20"
        />
      </div>
      <h1 className="text-center font-display text-2xl font-bold text-forest-900">
        Non-Partisan Charter
      </h1>
      <p className="mt-2 text-center text-sm text-forest-600">Civic Mandate Nigeria</p>
      <p className="mt-3 text-center text-xs font-medium text-gold-600">
        Don’t tell them who you’ll vote for. Tell them what they must deliver.
      </p>

      <div className="paper-card mt-8 space-y-4 rounded-2xl p-5 text-sm leading-relaxed text-forest-800">
        <p>
          Built by the{" "}
          <strong>Initiative for Sustainable Evolution for Youth and Community (ISEYC)</strong> —
          youth-led, non-partisan, CAC-registered. This instrument is for every state and the FCT.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">What this is</h2>
        <p>
          A place to state one concrete demand of public office, name the duty and (where you can)
          the office responsible, and locate it in your state. After review, accepted mandates
          become a public Civic Pulse — a memory of what citizens asked for.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">What this is not</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Not a candidate ranking or “who is leading” poll</li>
          <li>Not an endorsement of any party or aspirant</li>
          <li>Not a prediction of election outcomes</li>
          <li>Not a substitute for INEC or any official institution</li>
          <li>Not a claim to speak for every Nigerian</li>
        </ul>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">Record type</h2>
        <p>
          Published rows are labelled <strong>{PUBLISHED_DEMAND_LABEL}</strong>. That label means
          the demand passed human review for clarity and safety. It does not mean the demand is a
          vote, a ranking, or an endorsement.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">Publication gate</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Only submissions marked Published appear on Civic Pulse, State Civic Briefs, and public detail pages.</li>
          <li>ISEYC may refuse threats, hate, party slogans, candidate promotion, empty noise, or content that risks harm.</li>
          <li>Empty public record is not a ranking and not a system failure.</li>
        </ul>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">Responsibility map</h2>
        <p>
          The responsibility map is an ISEYC pilot classification of which offices often relate to a duty (Primary, Shared, or
          Unclear). It is a navigation aid, not a legal finding and not a ranking of people.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">Use of published demands</h2>
        <p>
          Publication preserves a citizen demand as public civic data. ISEYC may use briefs to request
          attention and document responses, but this platform does not provide emergency assistance,
          government services, jobs, food, healthcare, or security. A published demand is not proof that
          an office has accepted responsibility or delivered a result.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">Safety and corrections</h2>
        <p>
          Do not submit passwords, bank details, phone numbers, exact home addresses, or information
          that could put you or another person at risk. Evidence is optional. Contact ISEYC if a
          published record contains a serious error, exposes personal information, or needs a safety
          correction. We will assess correction and takedown requests rather than silently changing the
          public record.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">
          Why office and geography
        </h2>
        <p>
          Delivery is local as well as national. Tying a demand to an office and a place makes it
          harder to treat citizens as a faceless crowd. If you are unsure which office is
          responsible, you may still submit — the demand still matters.
        </p>

        <h2 className="pt-1 font-display text-base font-bold text-forest-900">Privacy</h2>
        <p>
          Optional age and gender are hidden behind an optional disclosure and are for internal
          understanding only — they are not shown on the public wall. Device information helps limit
          spam and is not published. The mandate sentence becomes public only after publication.
        </p>

        <p className="text-xs text-forest-600">
          Contact:{" "}
          <a className="underline" href={`mailto:${ISEYC_EMAIL}`}>
            {ISEYC_EMAIL}
          </a>
          {" \u00b7 "}
          <a className="underline" href={ISEYC_WEB} target="_blank" rel="noreferrer">
            www.iseyc.com.ng
          </a>
        </p>
      </div>

      <p className="mt-8 flex flex-col items-center gap-2 text-center text-sm">
        <Link href="/map" className="font-semibold text-forest-700 underline underline-offset-2">
          Responsibility map
        </Link>
        <Link href="/" className="text-sm font-semibold text-forest-600 underline underline-offset-2">
          \u2190 Back to Civic Mandate
        </Link>
      </p>
    </div>
  );
}
