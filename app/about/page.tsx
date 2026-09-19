import Link from "next/link";
import { ISEYC_SEAL_SRC, ISEYC_WEB, ISEYC_EMAIL } from "@/lib/brand";

export const metadata = {
  title: "About & Non-Partisan Charter | ISEYC 2027 Civic Mandate",
  description:
    "ISEYC 2027 Civic Mandate is a non-partisan platform for citizen demands on public office — not candidate rankings.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-8 flex justify-center">
        <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={72} height={72} />
      </div>
      <h1 className="text-center font-display text-2xl font-bold text-forest-900">
        Non-Partisan Charter
      </h1>
      <p className="mt-2 text-center text-sm text-forest-600">ISEYC 2027 Civic Mandate</p>

      <div className="paper-card mt-8 space-y-4 rounded-2xl p-5 text-sm leading-relaxed text-forest-800">
        <p>
          Built by the <strong>Initiative for Sustainable Evolution for Youth and Community (ISEYC)</strong> —
          youth-led, non-partisan, CAC-registered.
        </p>
        <p className="font-semibold text-forest-900">We do not tell Nigerians who to vote for.</p>
        <p>
          We help citizens state what public office must deliver, connect demands to the correct
          level of government, and keep a public memory of those demands.
        </p>
        <h2 className="pt-2 font-display text-base font-bold">What we never do</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Endorse or rank candidates</li>
          <li>Publish horse-race “who is leading” polls</li>
          <li>Predict election winners</li>
          <li>Replace INEC or claim official results</li>
        </ul>
        <h2 className="pt-2 font-display text-base font-bold">What we do</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Collect concrete civic mandates by duty and office</li>
          <li>Moderate before public display</li>
          <li>Aggregate by issue and location — never by candidate share</li>
        </ul>
        <p className="text-xs text-forest-600">
          Contact: <a className="underline" href={`mailto:${ISEYC_EMAIL}`}>{ISEYC_EMAIL}</a>
          {" · "}
          <a className="underline" href={ISEYC_WEB} target="_blank" rel="noreferrer">
            www.iseyc.com.ng
          </a>
        </p>
      </div>

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm font-semibold text-forest-600 underline underline-offset-2">
          ← Back to Civic Mandate
        </Link>
      </p>
    </div>
  );
}
