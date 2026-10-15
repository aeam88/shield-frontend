"use client";

import { ArrowRight, BarChart3, Check, History, Key, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dark-700/60 bg-dark-900/50 p-1.5 shadow-card backdrop-blur-xl">
      <div className="rounded-xl border border-dark-800/60 bg-dark-950/60 p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
}

function RateLimitVisual() {
  const rows = [
    { label: "Key", value: "API key" },
    { label: "Window", value: "60 seconds" },
    { label: "Limit", value: "1,000 req" },
    { label: "Action", value: "Throttle" },
  ];

  return (
    <VisualFrame>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Rate limit rule</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          Active
        </span>
      </div>
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-lg border border-dark-800/60 bg-dark-900/50 px-3.5 py-2.5"
          >
            <span className="text-xs text-dark-400">{row.label}</span>
            <span className="font-mono text-xs text-dark-100">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="text-dark-400">Current window</span>
          <span className="font-mono text-dark-200">720 / 1,000</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-dark-700">
          <div className="h-full w-[72%] rounded-full bg-primary" />
        </div>
      </div>
    </VisualFrame>
  );
}

function AnalyticsVisual() {
  const columns = [
    { allowed: 60, blocked: 6 },
    { allowed: 52, blocked: 10 },
    { allowed: 70, blocked: 4 },
    { allowed: 64, blocked: 14 },
    { allowed: 80, blocked: 6 },
    { allowed: 72, blocked: 20 },
    { allowed: 88, blocked: 8 },
    { allowed: 76, blocked: 12 },
    { allowed: 84, blocked: 22 },
    { allowed: 68, blocked: 10 },
    { allowed: 90, blocked: 6 },
    { allowed: 82, blocked: 16 },
  ];

  return (
    <VisualFrame>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Requests · last 24h</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Allowed
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Blocked
          </span>
        </div>
      </div>
      <div className="flex h-36 items-end gap-1.5">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-1 flex-col justify-end gap-px">
            <div
              className="rounded-t-sm bg-red-500/60"
              style={{ height: `${column.blocked}%` }}
            />
            <div
              className="rounded-sm bg-primary/80"
              style={{ height: `${column.allowed}%` }}
            />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function SecurityVisual() {
  const keys = [
    { name: "Production", key: "sk_live_••••4f2a", scope: "Full access", tone: "primary" },
    { name: "Staging", key: "sk_test_••••9c1b", scope: "Read only", tone: "neutral" },
    { name: "Mobile app", key: "sk_live_••••7e08", scope: "Scoped", tone: "neutral" },
  ];

  return (
    <VisualFrame>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-white">API Keys</span>
        <span className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-dark-950">
          + New key
        </span>
      </div>
      <div className="space-y-2.5">
        {keys.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-dark-800/60 bg-dark-900/50 px-3.5 py-2.5"
          >
            <div>
              <p className="text-xs font-medium text-white">{item.name}</p>
              <p className="font-mono text-[11px] text-dark-400">{item.key}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                item.tone === "primary"
                  ? "bg-primary/10 text-primary"
                  : "bg-white/5 text-dark-300",
              )}
            >
              {item.scope}
            </span>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function LogsVisual() {
  const logs = [
    { method: "GET", path: "/v1/users", status: 200, ms: "0.6ms" },
    { method: "POST", path: "/v1/messages", status: 429, ms: "0.4ms" },
    { method: "GET", path: "/v1/projects", status: 200, ms: "0.9ms" },
    { method: "DELETE", path: "/v1/tokens", status: 200, ms: "1.1ms" },
  ];

  return (
    <VisualFrame>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Activity logs</span>
        <span className="flex items-center gap-1.5 text-[11px] text-dark-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Live
        </span>
      </div>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-dark-800/60 bg-dark-900/50 px-3 py-2.5"
          >
            <span className="w-14 font-mono text-[10px] font-semibold text-dark-300">
              {log.method}
            </span>
            <span className="flex-1 truncate font-mono text-[11px] text-dark-100">
              {log.path}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold",
                log.status < 300
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400",
              )}
            >
              {log.status}
            </span>
            <span className="w-10 text-right font-mono text-[10px] text-dark-400">
              {log.ms}
            </span>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

const features = [
  {
    icon: Zap,
    eyebrow: "Rate limiting",
    title: "Protect every endpoint without touching your code",
    description:
      "Define limits by API key, user, or IP with sliding-window accuracy. Shield enforces rules at the edge so abusive traffic never reaches your services.",
    bullets: [
      "Sliding-window and token-bucket algorithms",
      "Per-route and per-key granularity",
      "Instant propagation across all edge regions",
    ],
    visual: <RateLimitVisual />,
  },
  {
    icon: BarChart3,
    eyebrow: "Analytics",
    title: "See exactly how your APIs are being used",
    description:
      "Real-time dashboards break down traffic by endpoint, status, and consumer, so you can spot abuse patterns and capacity issues before they escalate.",
    bullets: [
      "Live traffic and blocked-request metrics",
      "Breakdowns by endpoint, key, and region",
      "Custom date ranges and exportable reports",
    ],
    visual: <AnalyticsVisual />,
    reversed: true,
  },
  {
    icon: Key,
    eyebrow: "API Keys",
    title: "Issue, scope, and revoke credentials in seconds",
    description:
      "Manage the full lifecycle of your API keys with scoped permissions, expiration policies, and one-click revocation that takes effect immediately.",
    bullets: [
      "Scoped permissions and expiry policies",
      "Instant revocation with audit trail",
      "Automatic rotation reminders",
    ],
    visual: <SecurityVisual />,
  },
  {
    icon: History,
    eyebrow: "Observability",
    title: "Every request logged, searchable, and exportable",
    description:
      "A complete, queryable activity log captures method, path, status, and latency for every call, giving you the context to debug issues fast.",
    bullets: [
      "Full request and response metadata",
      "Cursor-based search across billions of events",
      "Streaming export to your own data stack",
    ],
    visual: <LogsVisual />,
    reversed: true,
  },
];

function FeatureSection({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  const Icon = feature.icon;
  const reversed = feature.reversed ?? false;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className={cn(reversed && "lg:order-2")}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-dark-700/60 bg-dark-900/60 px-3 py-1.5 text-xs font-medium text-primary">
          <Icon className="h-3.5 w-3.5" />
          {feature.eyebrow}
        </span>
        <h3 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {feature.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-dark-400">
          {feature.description}
        </p>
        <ul className="mt-6 space-y-3">
          {feature.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-dark-300">{bullet}</span>
            </li>
          ))}
        </ul>
        <a
          href="#pricing"
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(reversed && "lg:order-1")}
      >
        {feature.visual}
      </motion.div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Platform
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Everything you need to ship resilient APIs
          </h2>
          <p className="mt-5 text-lg text-dark-400">
            One platform for rate limiting, analytics, credentials, and
            observability — designed for teams that move fast.
          </p>
        </div>

        <div className="mt-20 space-y-28 md:space-y-40">
          {features.map((feature) => (
            <FeatureSection key={feature.title} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
