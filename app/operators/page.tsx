import type { Metadata } from "next";
import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Operators | ISEYC",
  robots: { index: false, follow: false },
};

export default function OperatorsIndexPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <img src={ISEYC_SEAL_SRC} alt="" width={48} height={48} className="h-12 w-12" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-600">ISEYC staff</p>
          <h1 className="font-display text-xl font-bold text-forest-900">Operator hub</h1>
        </div>
      </div>
      <p className="text-sm text-forest-700">
        Internal process pages. Not public product surfaces. Do not promote these URLs.
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        <li>
          <Link
            href="/operators/blueprint-pilot"
            className="font-semibold text-forest-800 underline underline-offset-2"
          >
            Public Blueprint pilot (Stage 2)
          </Link>
          <p className="text-xs text-forest-600">Document one public dossier into a separate Notion DB.</p>
        </li>
        <li>
          <Link href="/" className="font-semibold text-forest-800 underline underline-offset-2">
            Civic Mandate (citizens)
          </Link>
          <p className="text-xs text-forest-600">Live citizen demand product — keep databases separate.</p>
        </li>
      </ul>
    </div>
  );
}
