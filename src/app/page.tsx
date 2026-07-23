"use client";

import Link from 'next/link';
import { Shield, Zap, Lock, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Real-time Protection',
    description: 'Instant rate limiting that adapts to your traffic patterns automatically.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Monitor API usage with detailed insights and custom dashboards.',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    description: 'Enterprise-grade security with role-based access control.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-dark-950" />
          </div>
          <span className="text-xl font-bold">Shield</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/login"
            className="group px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 transition-all flex items-center gap-2"
          >
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </nav>

      <main className="relative z-10 px-6 pt-16 pb-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Secure your APIs in seconds</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            API Rate Limiting,{' '}
            <span className="text-gradient">Simplified</span>
          </h1>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Protect your APIs from abuse with intelligent rate limiting.
            Real-time analytics, easy configuration, and enterprise security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group px-8 py-4 bg-primary hover:bg-primary-hover text-dark-950 font-semibold rounded-2xl transition-all flex items-center gap-3"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 text-dark-400 hover:text-white font-medium rounded-2xl border border-dark-700 hover:border-dark-600 transition-all">
              View Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-32 grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group p-8 rounded-3xl bg-dark-900/40 backdrop-blur-xl border border-dark-700/50 hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-dark-500">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Why developers trust us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              '99.99% uptime guarantee',
              'Sub-millisecond latency',
              'No code changes required',
              'Detailed usage logs',
              '24/7 expert support',
              'SOC2 compliant',
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-dark-900/30 border border-dark-700/50"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-dark-400">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-dark-500">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Shield</span>
          </div>
          <p className="text-dark-500 text-sm">&copy; 2026 Shield. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
