"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    description: "For side projects and early testing.",
    monthly: 0,
    annual: 0,
    cta: "Start for free",
    href: "/register",
    highlighted: false,
    features: [
      "10K requests / month",
      "1 API key",
      "7-day log retention",
      "Community support",
    ],
  },
  {
    name: "Pro",
    description: "For growing products that need scale.",
    monthly: 29,
    annual: 23,
    cta: "Start free trial",
    href: "/register",
    highlighted: true,
    features: [
      "10M requests / month",
      "Unlimited API keys",
      "30-day log retention",
      "Real-time analytics",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    description: "For teams running mission-critical APIs.",
    monthly: null,
    annual: null,
    cta: "Contact sales",
    href: "/register",
    highlighted: false,
    features: [
      "Unlimited requests",
      "SSO & SCIM provisioning",
      "1-year log retention",
      "Dedicated support & SLA",
      "On-prem / VPC deployment",
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Simple pricing that scales with you
          </h2>
          <p className="mt-5 text-lg text-dark-400">
            Start free, upgrade when you grow. No hidden fees, cancel anytime.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="inline-flex items-center gap-1 rounded-xl border border-dark-700/60 bg-dark-900/60 p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  !annual
                    ? "bg-primary text-dark-950"
                    : "text-dark-300 hover:text-white",
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  annual
                    ? "bg-primary text-dark-950"
                    : "text-dark-300 hover:text-white",
                )}
              >
                Annual
              </button>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Save 20%
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const price = annual ? plan.annual : plan.monthly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-7 backdrop-blur-xl",
                  plan.highlighted
                    ? "border-primary/50 bg-dark-900/60 shadow-glow"
                    : "border-dark-700/50 bg-dark-900/30",
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-dark-950">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 min-h-10 text-sm text-dark-400">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  {price === null ? (
                    <span className="text-4xl font-bold tracking-tight text-white">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold tracking-tight text-white">
                        ${price}
                      </span>
                      <span className="pb-1.5 text-sm text-dark-400">
                        / month
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-dark-500">
                  {price === null
                    ? "Tailored to your volume"
                    : annual
                      ? "Billed annually"
                      : "Billed monthly"}
                </p>

                <Button
                  href={plan.href}
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="mt-7 w-full"
                >
                  {plan.cta}
                  {plan.highlighted && <ArrowRight className="h-4 w-4" />}
                </Button>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "mt-0.5 h-4.5 w-4.5 flex-shrink-0",
                          plan.highlighted ? "text-primary" : "text-dark-300",
                        )}
                      />
                      <span className="text-sm text-dark-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-dark-500">
          All plans include edge deployment, DDoS protection, and a 99.99%
          uptime SLA.
        </p>
      </Container>
    </section>
  );
}
