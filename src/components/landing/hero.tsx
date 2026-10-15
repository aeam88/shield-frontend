"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <div className="relative overflow-hidden pt-16 pb-24">
      <div className="pointer-events-none absolute inset-0 grid-pattern mask-fade-bottom opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.a
            href="#features"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 transition-colors hover:border-primary/40"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Secure your APIs in seconds
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-primary/70" />
          </motion.a>

          <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
            API rate limiting,{" "}
            <span className="text-gradient">finally simple</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
            Protect your APIs from abuse with intelligent rate limiting.
            Real-time analytics, effortless configuration, and enterprise-grade
            security — no code changes required.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/register" size="lg" className="group w-full sm:w-auto">
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              href="#showcase"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              View Demo
            </Button>
          </div>

          <p className="mt-5 text-sm text-dark-400">
            No credit card required · Free for 10K requests / month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </div>
  );
}
