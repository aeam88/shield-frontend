"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Ban,
  BarChart3,
  Clock,
  History,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { StatsCard } from "@/components/StatsCard";

const UsageChart = dynamic(
  () => import("@/components/UsageChart").then((mod) => mod.UsageChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full animate-pulse rounded-2xl bg-dark-900/20" />
    ),
  },
);

const trafficData = [
  { name: "00:00", total: 1200, blocked: 60 },
  { name: "03:00", total: 900, blocked: 40 },
  { name: "06:00", total: 1600, blocked: 90 },
  { name: "09:00", total: 2800, blocked: 180 },
  { name: "12:00", total: 3400, blocked: 210 },
  { name: "15:00", total: 3100, blocked: 160 },
  { name: "18:00", total: 3800, blocked: 240 },
  { name: "21:00", total: 2900, blocked: 130 },
];

const endpoints = [
  { path: "GET /v1/messages", pct: 34 },
  { path: "POST /v1/messages", pct: 26 },
  { path: "GET /v1/users", pct: 18 },
  { path: "GET /v1/projects", pct: 13 },
  { path: "DELETE /v1/tokens", pct: 9 },
];

const logRows = [
  { method: "GET", path: "/v1/users", status: 200, key: "sk_live_4f2a", ms: "0.6ms", time: "12:04:31" },
  { method: "POST", path: "/v1/messages", status: 429, key: "sk_live_9c1b", ms: "0.4ms", time: "12:04:30" },
  { method: "GET", path: "/v1/projects", status: 200, key: "sk_live_4f2a", ms: "0.9ms", time: "12:04:29" },
  { method: "DELETE", path: "/v1/tokens", status: 401, key: "sk_test_7e08", ms: "1.1ms", time: "12:04:27" },
  { method: "GET", path: "/v1/messages", status: 200, key: "sk_live_4f2a", ms: "0.7ms", time: "12:04:26" },
];

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "logs", label: "Logs", icon: History },
] as const;

type TabId = (typeof tabs)[number]["id"];

function DashboardPanel() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Requests today"
          value="2.4M"
          icon={Activity}
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard
          label="Blocked"
          value="18.2K"
          icon={Ban}
          trend={{ value: 4, isUp: false }}
        />
        <StatsCard label="P50 latency" value="0.8ms" icon={Clock} />
      </div>
      <div className="rounded-2xl border border-dark-700/60 bg-dark-900/40 p-4">
        <UsageChart data={trafficData} />
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-dark-700/60 bg-dark-900/40 p-4">
        <UsageChart data={trafficData} />
      </div>
      <div className="rounded-2xl border border-dark-700/60 bg-dark-900/40 p-5">
        <p className="mb-5 text-sm font-medium text-white">Top endpoints</p>
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <div key={endpoint.path}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="truncate font-mono text-dark-200">
                  {endpoint.path}
                </span>
                <span className="ml-3 font-mono text-dark-400">
                  {endpoint.pct}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-700">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${endpoint.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogsPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-700/60 bg-dark-900/40">
      <div className="flex items-center justify-between border-b border-dark-700/60 px-5 py-3.5">
        <span className="text-sm font-medium text-white">Recent activity</span>
        <span className="flex items-center gap-1.5 text-[11px] text-dark-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Streaming
        </span>
      </div>
      <div className="divide-y divide-dark-800/60">
        {logRows.map((row, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-5 py-3 text-sm transition-colors hover:bg-white/[0.02]"
          >
            <span className="w-16 font-mono text-[11px] font-semibold text-dark-300">
              {row.method}
            </span>
            <span className="flex-1 truncate font-mono text-xs text-dark-100">
              {row.path}
            </span>
            <span className="hidden font-mono text-[11px] text-dark-400 md:block">
              {row.key}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold",
                row.status < 300
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400",
              )}
            >
              {row.status}
            </span>
            <span className="w-14 text-right font-mono text-[11px] text-dark-400">
              {row.ms}
            </span>
            <span className="hidden w-20 text-right font-mono text-[11px] text-dark-500 lg:block">
              {row.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Showcase() {
  const [active, setActive] = useState<TabId>("dashboard");

  return (
    <section id="showcase" className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Product tour
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            A single pane of glass for your API traffic
          </h2>
          <p className="mt-5 text-lg text-dark-400">
            Monitor, analyze, and debug every request from one clean dashboard
            built for developers.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-xl border border-dark-700/60 bg-dark-900/60 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  active === tab.id
                    ? "bg-primary text-dark-950"
                    : "text-dark-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-dark-700/60 bg-dark-900/40 p-2 shadow-card backdrop-blur-xl">
          <div className="rounded-xl border border-dark-800/60 bg-dark-950/40 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {active === "dashboard" && <DashboardPanel />}
                {active === "analytics" && <AnalyticsPanel />}
                {active === "logs" && <LogsPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
