import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedMandate } from "@/lib/notion";
import { ISEYC_SEAL_SRC, PRODUCT_NAME } from "@/lib/brand";
import {
  PUBLISHED_DEMAND_HINT,
  PUBLISHED_DEMAND_LABEL,
  NOT_PUBLICLY_SPECIFIED,
} from "@/lib/record-classes";
import { rowsForDuty } from "@/lib/responsibility-map";
import TrackMandateButton from "@/components/TrackMandateButton";
import WhatChangedTimeline from "@/components/WhatChangedTimeline";
import MandateStoryDraftPanel from "@/components/MandateStoryDraftPanel";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let m = null;
  try {
    m = await getPublishedMandate(id);
  } catch {
    return { title: `Mandate temporarily unavailable | ${PRODUCT_NAME}` };
  }
  if (!m) {
    return { title: `Mandate not found | ${PRODUCT_NAME}` };
  }
  const title = `Civic mandate · ${m.state}${m.duty ? ` · ${m.duty}` : ""}`;
  const description = m.sentence.slice(0, 160);
  return {
    title: `${title} | ISEYC`,
    description,
    openGraph: { title, description, siteName: PRODUCT_NAME },
  };
}

export default async function MandateDetailPage({ params }: Props) {
  const { id } = await params;
  let m = null;
  let serviceError = false;
  try {
    m = await getPublishedMandate(id);
  } catch {
    serviceError = true;
  }

  if (serviceError) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-4 py-16 text-center">
        <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={64} height={64} className="mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold text-forest-900">Temporarily unavailable</h1>
        <p className="mt-2 text-sm text-forest-600">
          Published civic records could not be loaded right now. This is a service problem, not proof
          that the mandate was rejected. Please try again later.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-forest-600 underline">
          ← Back to Civic Mandate
        </Link>
      </div>
    );
  }

  if (!m) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-4 py-16 text-center">
        <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={64} height={64} className="mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold text-forest-900">Mandate not available</h1>
        <p className="mt-2 text-sm text-forest-600">
          This link may be pending review, removed, or invalid. Only published mandates are public.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-forest-600 underline">
          ← Back to Civic Mandate
        </Link>
      </div>
    );
  }

  const where = [m.state, m.lga].filter(Boolean).join(" · ");
  const briefHref = m.state ? `/brief?state=${encodeURIComponent(m.state)}` : "/brief";
  const mapRow = m.duty ? rowsForDuty(m.duty) : undefined;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={48} height={48} />
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest text-gold-600">{PRODUCT_NAME}</p>
          <p className="text-xs font-semibold text-forest-700">{PUBLISHED_DEMAND_LABEL}</p>
        </div>
      </div>

      <article className="border border-forest-500/15 bg-white px-5 py-5">
        <p className="text-lg leading-relaxed text-forest-900">“{m.sentence}”</p>

        <dl className="mt-5 grid gap-2 text-xs text-forest-600">
          {where ? (
            <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
              <dt className="font-medium text-forest-500">Location</dt>
              <dd className="text-right text-forest-800">{where}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
            <dt className="font-medium text-forest-500">Office</dt>
            <dd className="text-right text-forest-800">{m.office || NOT_PUBLICLY_SPECIFIED}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
            <dt className="font-medium text-forest-500">Duty</dt>
            <dd className="text-right text-forest-800">{m.duty || NOT_PUBLICLY_SPECIFIED}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
            <dt className="font-medium text-forest-500">Record type</dt>
            <dd className="text-right text-forest-800">Citizen demand</dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
            <dt className="font-medium text-forest-500">Status</dt>
            <dd className="text-right text-forest-800">Published</dd>
          </div>
        </dl>

        <p className="mt-5 text-[11px] leading-snug text-forest-500">{PUBLISHED_DEMAND_HINT}</p>
      </article>

      <div className="mt-4">
        <TrackMandateButton id={m.id} sentence={m.sentence} state={m.state} duty={m.duty} />
      </div>

      <WhatChangedTimeline
        mandate={{
          id: m.id,
          sentence: m.sentence,
          state: m.state,
          lga: m.lga,
          duty: m.duty,
          office: m.office,
          created: m.created,
          status: "Published",
        }}
      />

      <MandateStoryDraftPanel
        id={m.id}
        sentence={m.sentence}
        state={m.state}
        lga={m.lga}
        duty={m.duty}
        office={m.office}
        created={m.created}
      />

      {mapRow ? (
        <div className="mt-4 rounded-xl border border-forest-500/12 bg-cream/80 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-forest-500">
            Related offices (pilot map)
          </p>
          <ul className="mt-2 space-y-1 text-xs text-forest-700">
            {mapRow.offices.slice(0, 3).map((o) => (
              <li key={o.office}>
                <span className="font-semibold">{o.office}</span>
                <span className="text-forest-500"> · {o.confidence}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/map"
            className="mt-2 inline-block text-[11px] font-semibold text-forest-700 underline underline-offset-2"
          >
            Full responsibility map
          </Link>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-3 text-sm">
        <Link
          href="/"
          className="w-full max-w-xs rounded-md bg-forest-500 py-3 text-center font-bold text-white"
        >
          Add your mandate
        </Link>
        <Link
          href={briefHref}
          className="text-xs font-semibold text-forest-700 underline underline-offset-2"
        >
          View State Civic Brief{m.state ? ` · ${m.state}` : ""}
        </Link>
        <Link href="/tracked" className="text-xs text-forest-600 underline underline-offset-2">
          Tracked on this device
        </Link>
        <Link href="/methodology" className="text-xs text-forest-600 underline underline-offset-2">
          Methodology
        </Link>
      </div>
    </div>
  );
}
