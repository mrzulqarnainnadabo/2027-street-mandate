import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISEYC 2027 Civic Mandate",
  description:
    "Don't tell us who you'll vote for. Tell them what they must deliver. Non-partisan civic mandates by ISEYC.",
  icons: { icon: "/iseyc-seal.svg", apple: "/iseyc-seal.svg" },
  openGraph: {
    title: "ISEYC 2027 Civic Mandate",
    description:
      "Don't tell us who you'll vote for. Tell them what they must deliver.",
    type: "website",
    siteName: "ISEYC",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-forest-900 antialiased">{children}</body>
    </html>
  );
}
