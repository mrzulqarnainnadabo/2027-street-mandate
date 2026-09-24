import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import FreezeBanner from "@/components/FreezeBanner";

export const metadata: Metadata = {
  title: "ISEYC 2027 Civic Mandate",
  description:
    "Don't tell us who you'll vote for. Tell them what they must deliver. Non-partisan civic mandates by ISEYC.",
  icons: { icon: "/iseyc-seal.svg", apple: "/iseyc-seal.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ISEYC Mandate",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "ISEYC 2027 Civic Mandate",
    description:
      "Don't tell us who you'll vote for. Tell them what they must deliver.",
    type: "website",
    siteName: "ISEYC",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F4D34",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-forest-900 antialiased">
        <LanguageProvider>
          <FreezeBanner />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
