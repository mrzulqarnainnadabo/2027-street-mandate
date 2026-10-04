import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import FreezeBanner from "@/components/FreezeBanner";
import { PRODUCT_NAME, PRODUCT_TAGLINE } from "@/lib/brand";

export const metadata: Metadata = {
  title: PRODUCT_NAME,
  description: `${PRODUCT_TAGLINE} Non-partisan civic mandates by ISEYC.`,
  icons: { icon: "/iseyc-seal.svg", apple: "/iseyc-seal.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Civic Mandate",
    statusBarStyle: "default",
  },
  openGraph: {
    title: PRODUCT_NAME,
    description: PRODUCT_TAGLINE,
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
