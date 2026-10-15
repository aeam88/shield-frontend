"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-dark-700/60 bg-dark-900/50 px-6 py-16 text-center backdrop-blur-xl md:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">
              Start protecting your APIs today
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-dark-400">
              Join thousands of developers shipping safer APIs. Get started free
              in under two minutes.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/register" size="lg" className="group w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                href="/login"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Talk to sales
              </Button>
            </div>

            <p className="mt-5 text-sm text-dark-500">
              No credit card required · Free for 10K requests / month
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
