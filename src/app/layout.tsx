import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shield.dev";

const description =
  "Intelligent API rate limiting with real-time analytics, scoped API keys, and enterprise-grade security. Protect your APIs in minutes with no code changes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shield | API Rate Limiting, Simplified",
    template: "%s | Shield",
  },
  description,
  applicationName: "Shield",
  keywords: [
    "API rate limiting",
    "rate limiter",
    "API security",
    "API analytics",
    "API keys",
    "abuse protection",
    "DDoS protection",
  ],
  authors: [{ name: "Shield" }],
  creator: "Shield",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Shield",
    title: "Shield | API Rate Limiting, Simplified",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shield | API Rate Limiting, Simplified",
    description,
    creator: "@shield",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
