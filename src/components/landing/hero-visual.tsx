import { BarChart3, Key, LayoutDashboard, Settings, Shield } from "lucide-react";

const stats = [
  { label: "Requests", value: "2.4M", trend: "+12%" },
  { label: "Blocked", value: "18.2K", trend: "-4%" },
  { label: "Latency", value: "0.8ms", trend: "-8%" },
];

const sidebarIcons = [LayoutDashboard, Key, BarChart3, Settings];

export function HeroVisual() {
  return (
    <div className="relative mx-auto mt-20 w-full max-w-5xl">
      <div className="absolute inset-x-10 -top-10 h-40 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative overflow-hidden rounded-2xl border border-dark-700/70 bg-dark-900/60 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-dark-700/60 bg-dark-950/50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md border border-dark-700/60 bg-dark-900/80 px-3 py-1 text-xs text-dark-400">
            <Shield className="h-3 w-3 text-primary" />
            app.shield.dev/dashboard
          </div>
        </div>

        <div className="flex">
          <div className="hidden w-14 flex-col items-center gap-5 border-r border-dark-700/60 py-6 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-dark-950" />
            </span>
            {sidebarIcons.map((Icon, index) => (
              <Icon
                key={index}
                className={
                  index === 0
                    ? "h-4.5 w-4.5 text-primary"
                    : "h-4.5 w-4.5 text-dark-500"
                }
              />
            ))}
          </div>

          <div className="flex-1 p-5 sm:p-7">
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-dark-700/60 bg-dark-950/40 p-3 sm:p-4"
                >
                  <p className="text-[11px] font-medium text-dark-400">
                    {stat.label}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white sm:text-xl">
                      {stat.value}
                    </span>
                    <span
                      className={
                        stat.trend.startsWith("+")
                          ? "text-[10px] font-semibold text-emerald-400"
                          : "text-[10px] font-semibold text-primary"
                      }
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative rounded-xl border border-dark-700/60 bg-dark-950/40 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium text-dark-300">
                  Traffic volume
                </span>
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

              <svg
                viewBox="0 0 400 120"
                preserveAspectRatio="none"
                className="h-32 w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a3e635" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 92 C 30 78, 55 100, 85 82 S 130 46, 165 58 S 215 88, 250 52 S 305 18, 345 40 S 385 22, 400 32 L 400 120 L 0 120 Z"
                  fill="url(#heroArea)"
                />
                <path
                  d="M0 92 C 30 78, 55 100, 85 82 S 130 46, 165 58 S 215 88, 250 52 S 305 18, 345 40 S 385 22, 400 32"
                  fill="none"
                  stroke="#a3e635"
                  strokeWidth="2.5"
                />
                <path
                  d="M0 108 C 40 100, 70 112, 110 104 S 170 92, 210 100 S 280 84, 320 96 S 370 88, 400 92"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -left-4 hidden w-72 rounded-xl border border-dark-700/70 bg-dark-900/90 p-4 font-mono text-[11px] shadow-card backdrop-blur-xl md:block">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-dark-400">API Request</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            200 OK
          </span>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed text-dark-200">
{`$ curl api.shield.dev/v1/verify
  -H "Authorization: Bearer sk_live"`}
        </pre>
        <pre className="mt-2 whitespace-pre-wrap leading-relaxed text-primary">
{`{ "allowed": true,
  "remaining": 998 }`}
        </pre>
      </div>
    </div>
  );
}
