import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 2027 Street Mandate | ISEYC",
  description:
    "Don't tell us who you'll vote for. Tell them what they must deliver. A non-partisan civic voice wall by ISEYC — Initiative for Sustainable Evolution for the Youth and Community.",
  icons: {
    icon: "/iseyc-seal.svg",
    apple: "/iseyc-seal.svg",
  },
  openGraph: {
    title: "The 2027 Street Mandate | ISEYC",
    description:
      "Don't tell us who you'll vote for. Tell them what they must deliver. One sentence. One issue. Your state.",
    type: "website",
    siteName: "ISEYC",
  },
  twitter: {
    card: "summary",
    title: "The 2027 Street Mandate | ISEYC",
    description:
      "Don't tell us who you'll vote for. Tell them what they must deliver.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-forest-900 antialiased">
        {children}
      </body>
    </html>
  );
}
