import Link from "next/link";

/**
 * Institutional internal navigation for operator pages.
 * Not for public product surfaces.
 */
export default function OperatorStaffNav({ current }: { current?: string }) {
  const items: { href: string; label: string; key: string }[] = [
    { href: "/operators", label: "Operator hub", key: "hub" },
    { href: "/operators/blueprint-review", label: "Blueprint review", key: "blueprint-review" },
    { href: "/operators/blueprint-pilot", label: "Blueprint pilot", key: "blueprint-pilot" },
    { href: "/operators/mandate-review", label: "Mandate review", key: "mandate-review" },
    { href: "/blueprints", label: "Public register", key: "public-blueprints" },
    { href: "/", label: "Civic Mandate", key: "home" },
  ];

  return (
    <nav
      aria-label="Operator workspace"
      className="mb-6 border-b border-forest-500/15 pb-3"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
        ISEYC staff · operator workspace
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-2 text-xs">
        {items.map((item) => {
          const active = current === item.key;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={
                  active
                    ? "font-bold text-forest-900 underline underline-offset-2"
                    : "font-semibold text-forest-700 underline underline-offset-2"
                }
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
