"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

const faqs = [
  {
    q: "How quickly can I get started?",
    a: "In minutes. Point your traffic through Shield's edge endpoint and add a single header to identify the caller. There is nothing to install and no infrastructure to manage.",
  },
  {
    q: "Do I need to change my application code?",
    a: "No. Shield sits in front of your API at the edge, so your services stay untouched. You can optionally read the X-RateLimit response headers to surface limits to your clients.",
  },
  {
    q: "Which rate limiting algorithms are supported?",
    a: "Sliding-window, fixed-window, and token-bucket are all supported. You can switch algorithms per rule without any redeploys, and changes propagate to every edge region instantly.",
  },
  {
    q: "How is my usage counted?",
    a: "Only requests that actually reach Shield are counted toward your quota. Health checks, static assets, and requests blocked at the network edge are not billed.",
  },
  {
    q: "What happens when a client exceeds a limit?",
    a: "Shield returns a 429 response with standard X-RateLimit headers so clients can back off gracefully. You can also trigger webhooks to notify your systems in real time.",
  },
  {
    q: "Can I self-host or deploy inside my VPC?",
    a: "Yes, on the Enterprise plan. We support VPC peering and on-prem deployments for teams with strict data residency or compliance requirements.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Questions &amp; answers
            </h2>
            <p className="mt-5 text-lg text-dark-400">
              Everything you need to know about Shield. Still curious? Reach out
              to our team.
            </p>
          </div>

          <div className="divide-y divide-dark-800/60 border-y border-dark-800/60">
            {faqs.map((faq, index) => {
              const isOpen = open === index;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        "text-base font-medium transition-colors",
                        isOpen ? "text-white" : "text-dark-200 hover:text-white",
                      )}
                    >
                      {faq.q}
                    </span>
                    <Plus
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-primary transition-transform duration-200",
                        isOpen && "rotate-45",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-10 text-dark-400">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
