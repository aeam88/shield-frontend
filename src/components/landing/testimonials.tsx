"use client";

import { motion } from "framer-motion";
import { Activity, Award, Fingerprint, Lock, Quote, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";

const testimonials = [
  {
    quote:
      "Shield cut our abuse-related incidents to zero in the first week. Setup was literally one header — no SDK, no code changes.",
    name: "Maya Chen",
    role: "Staff Engineer",
    company: "Northwind",
    initials: "MC",
  },
  {
    quote:
      "The analytics dashboard is the first place we look every morning. We spotted a runaway integration before it took down prod.",
    name: "Diego Alvarez",
    role: "Platform Lead",
    company: "Quanta",
    initials: "DA",
  },
  {
    quote:
      "Scoped keys and instant revocation gave our security team the control they'd been asking for without slowing us down.",
    name: "Priya Nair",
    role: "Head of Security",
    company: "Stackline",
    initials: "PN",
  },
  {
    quote:
      "We replaced a fragile in-house limiter with Shield and removed hundreds of lines of code. Sub-millisecond latency confirmed.",
    name: "Tom Becker",
    role: "Backend Engineer",
    company: "Voltify",
    initials: "TB",
  },
  {
    quote:
      "The activity logs are gold during incidents. Full request context, searchable, and exportable to our own warehouse.",
    name: "Sofia Rossi",
    role: "SRE",
    company: "Orbital",
    initials: "SR",
  },
  {
    quote:
      "Onboarding our whole team took an afternoon. The docs are clear and the edge rollout is genuinely invisible.",
    name: "Liam O'Connor",
    role: "CTO",
    company: "Gridwork",
    initials: "LO",
  },
];

const compliance = [
  { label: "SOC 2 Type II", icon: ShieldCheck },
  { label: "GDPR Ready", icon: Lock },
  { label: "ISO 27001", icon: Award },
  { label: "CCA Compliance", icon: Fingerprint },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Loved by engineering teams
          </h2>
          <p className="mt-5 text-lg text-dark-400">
            From startups to scale-ups, teams trust Shield to keep their APIs
            fast, safe, and observable.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
              className="flex flex-col justify-between rounded-2xl border border-dark-700/50 bg-dark-900/40 p-6 backdrop-blur-xl transition-colors hover:border-primary/30"
            >
              <Quote className="h-6 w-6 text-primary/40" />
              <blockquote className="mt-4 flex-1 text-dark-200">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-dark-800/60 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-sm font-bold text-primary">
                  {testimonial.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-dark-400">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-dark-700/50 bg-dark-900/30 px-6 py-6 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {compliance.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-dark-300"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              99.99% uptime
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
