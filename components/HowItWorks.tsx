"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

export default function HowItWorks() {
  const { t } = useLang();

  return (
    <section className="mx-4 mb-8 border-y border-forest-500/10 py-5">
      <h2 className="text-center font-display text-sm font-bold tracking-wide text-forest-800">
        {t("how.title")}
      </h2>
      <ol className="mx-auto mt-3 max-w-md list-decimal space-y-2 pl-6 text-xs leading-relaxed text-forest-700">
        <li>{t("how.1")}</li>
        <li>{t("how.2")}</li>
        <li>{t("how.3")}</li>
        <li>{t("how.4")}</li>
        <li>{t("how.5")}</li>
        <li>
          {t("how.6")}{" "}
          <Link href="/brief" className="font-semibold underline underline-offset-2">
            {t("header.brief")}
          </Link>
        </li>
      </ol>

      <p className="mx-auto mt-3 max-w-md text-center text-[11px] leading-snug text-forest-600">
        Unsure which office delivers a duty?{" "}
        <Link href="/map" className="font-semibold underline underline-offset-2">
          Open the responsibility map
        </Link>
        {" "}— Primary, Shared, or Unclear. Not rankings.
      </p>

      <div className="mx-auto mt-4 grid max-w-md gap-2 text-[11px] sm:grid-cols-2">
        <div className="rounded-md border border-forest-500/10 bg-white px-3 py-2">
          <p className="font-bold uppercase tracking-wide text-forest-600">{t("how.publish")}</p>
          <p className="mt-1 leading-snug text-forest-700">{t("how.publishBody")}</p>
        </div>
        <div className="rounded-md border border-forest-500/10 bg-white px-3 py-2">
          <p className="font-bold uppercase tracking-wide text-forest-600">{t("how.reject")}</p>
          <p className="mt-1 leading-snug text-forest-700">{t("how.rejectBody")}</p>
        </div>
      </div>

      <p className="mx-auto mt-3 max-w-md text-center text-[10px] leading-snug text-forest-500">
        {t("how.footer")}{" "}
        <Link href="/about" className="font-semibold underline underline-offset-2">
          {t("how.charter")}
        </Link>
      </p>
    </section>
  );
}
