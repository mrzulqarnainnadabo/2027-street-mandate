import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedMandate } from "@/lib/notion";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const m = await getPublishedMandate(id);
  if (!m) {
    return { title: "Mandate not found | ISEYC 2027 Civic Mandate" };
  }
  const title = `Civic mandate · ${m.state}${m.duty ? ` · ${m.duty}` : ""}`;
  const description = m.sentence.slice(0, 160);
  return {
    title: `${title} | ISEYC`,
    description,
    openGraph: { title, description, siteName: "ISEYC 2027 Civic Mandate" },
  };
}

export default async function MandateDetailPage({ params }: Props) {
  const { id } = await params;
  const m = await getPublishedMandate(id);

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

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={48} height={48} />
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC 2027 Civic Mandate</p>
          <p className="text-xs text-forest-600">Published citizen demand</p>
        </div>
      </div>

      <article className="paper-card rounded-2xl p-5">
        <p className="text-lg leading-relaxed text-forest-900">“{m.sentence}”</p>

        <dl className="mt-5 grid gap-2 text-xs text-forest-600">
          {where ? (
            <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
              <dt className="font-medium text-forest-500">Location</dt>
              <dd className="text-right text-forest-800">{where}</dd>
            </div>
          ) : null}
          {m.office ? (
            <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
              <dt className="font-medium text-forest-500">Office</dt>
              <dd className="text-right text-forest-800">{m.office}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
            <dt className="font-medium text-forest-500">Duty</dt>
            <dd className="text-right text-forest-800">{m.duty}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
            <dt className="font-medium text-forest-500">Status</dt>
            <dd className="text-right text-forest-800">Published</dd>
          </div>
        </dl>

        <p className="mt-5 text-[11px] leading-snug text-forest-500">
          Non-partisan. This is a citizen demand for delivery — not an endorsement of any candidate or
          party.
        </p>
      </article>

      <div className="mt-8 flex flex-col items-center gap-3 text-sm">
        <Link
          href="/"
          className="w-full max-w-xs rounded-xl bg-forest-500 py-3 text-center font-bold text-white"
        >
          Add your mandate
        </Link>
        <Link href="/about" className="text-xs text-forest-600 underline underline-offset-2">
          Non-partisan charter
        </Link>
      </div>
    </div>
  );
}
