import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 2027 Street Mandate | ISEYC",
  description:
    "Don't tell us who you'll vote for. Tell them what they must deliver. A non-partisan civic voice wall by ISEYC.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "The 2027 Street Mandate | ISEYC",
    description: "Don't tell us who you'll vote for. Tell them what they must deliver.",
    type: "website",
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
