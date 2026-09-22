import Link from "next/link";
import type { Metadata } from "next";
import { CivicStatusError, getMandateStatus } from "@/lib/notion";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

type Props = { params: Promise<{ id: string }> };

function referenceFor(id: string): string {
  return `ISEYC-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function statusCopy(status: string): { label: string; message: string } {
  if (status === "Published") {
    return {
      label: "Published",
      message: "Your mandate has passed ISEYC review and is now part of the public Civic Pulse.",
    };
  }
  if (status === "Rejected") {
    return {
      label: "Not published",
      message: "This submission was not published. Please contact ISEYC if you need clarification.",
    };
  }
  return {
    label: "Under review",
    message:
      "Your mandate has been received. It will appear publicly only after ISEYC review marks it Published.",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Submission status ${referenceFor(id)} | ISEYC 2027 Civic Mandate`,
  };
}

function StatusUnavailable({
  temporary,
  id,
}: {
  temporary: boolean;
  id: string;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-16 text-center">
      <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={64} height={64} className="mx-auto mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">Submission status</p>
      <h1 className="mt-1 font-display text-xl font-bold text-forest-900">
        {temporary ? "Status temporarily unavailable" : "Status not found"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-forest-600">
        {temporary
          ? "The civic data service is temporarily unavailable. Your submission has not been changed. Please try again later."
          : `We could not find a submission matching ${referenceFor(id)}. Check the reference link and try again.`}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Link href={`/status/${id}`} className="text-sm font-semibold text-forest-600 underline">
          Try again
        </Link>
        <Link href="/" className="text-sm font-semibold text-forest-600 underline">
          ← Back to Civic Mandate
        </Link>
      </div>
    </div>
  );
}

export default async function StatusPage({ params }: Props) {
  const { id } = await params;

  try {
    const mandate = await getMandateStatus(id);

    if (!mandate) {
      return <StatusUnavailable temporary={false} id={id} />;
    }

    const copy = statusCopy(mandate.status);
    const reference = referenceFor(mandate.id);
    const publicUrl = `/mandate/${mandate.id}`;

    return (
      <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img src={ISEYC_SEAL_SRC} alt="ISEYC" width={48} height={48} />
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC 2027 Civic Mandate</p>
            <p className="text-xs text-forest-600">Submission receipt</p>
          </div>
        </div>

        <article className="border border-forest-500/15 bg-white px-5 py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">Reference</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-wide text-forest-900">{reference}</p>
          <div className="mt-5 border-l-2 border-forest-500 bg-forest-50 px-4 py-3">
            <p className="text-sm font-bold text-forest-900">{copy.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-forest-700">{copy.message}</p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-forest-900">“{mandate.sentence}”</p>
          <dl className="mt-5 grid gap-2 text-xs text-forest-600">
            <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
              <dt className="font-medium text-forest-500">State</dt>
              <dd className="text-right text-forest-800">{mandate.state}</dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
              <dt className="font-medium text-forest-500">Office</dt>
              <dd className="text-right text-forest-800">{mandate.office}</dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-forest-500/10 pt-2">
              <dt className="font-medium text-forest-500">Duty</dt>
              <dd className="text-right text-forest-800">{mandate.duty}</dd>
            </div>
          </dl>

          <p className="mt-5 text-[11px] leading-snug text-forest-500">
            Keep this link. It does not display age, gender, device fingerprint, or other private
            submission fields.
          </p>
        </article>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm">
          {mandate.status === "Published" ? (
            <Link
              href={publicUrl}
              className="w-full max-w-xs rounded-md bg-forest-500 py-3 text-center font-bold text-white"
            >
              View published mandate
            </Link>
          ) : null}
          <Link href="/" className="text-xs font-semibold text-forest-700 underline underline-offset-2">
            Submit another mandate
          </Link>
          <Link href="/about" className="text-xs text-forest-600 underline underline-offset-2">
            Non-partisan charter
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof CivicStatusError) {
      return <StatusUnavailable temporary={error.code === "UNAVAILABLE"} id={id} />;
    }
    console.error("Status page error:", error);
    return <StatusUnavailable temporary id={id} />;
  }
}
