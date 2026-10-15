import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { Showcase } from "@/components/landing/showcase";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shield.dev";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Shield",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Intelligent API rate limiting with real-time analytics, scoped API keys, and enterprise-grade security.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1280",
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <SocialProof />
        <Features />
        <Showcase />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>

      <Footer />
    </div>
  );
}
