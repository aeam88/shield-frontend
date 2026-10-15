import Link from "next/link";
import { Shield } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GithubIcon, LinkedinIcon, XIcon } from "./brand-icons";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Rate Limiting", href: "#features" },
      { label: "Analytics", href: "#showcase" },
      { label: "API Keys", href: "#features" },
      { label: "Activity Logs", href: "#showcase" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "API Reference", href: "#docs" },
      { label: "Changelog", href: "#changelog" },
      { label: "Status", href: "#status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" },
    ],
  },
];

const socials = [
  { label: "GitHub", href: "#github", icon: GithubIcon },
  { label: "X", href: "#x", icon: XIcon },
  { label: "LinkedIn", href: "#linkedin", icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-dark-800/60">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-dark-950" />
              </span>
              <span className="text-lg font-bold tracking-tight">Shield</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-dark-400">
              Intelligent API rate limiting with real-time analytics and
              enterprise-grade security.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-700 text-dark-400 transition-colors hover:border-dark-600 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-dark-800/60 pt-8 sm:flex-row">
          <p className="text-sm text-dark-500">
            &copy; 2026 Shield. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-dark-500">
            <span className="h-2 w-2 rounded-full bg-primary" />
            All systems operational
          </div>
        </div>
      </Container>
    </footer>
  );
}
