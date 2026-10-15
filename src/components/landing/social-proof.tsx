import { Container } from "@/components/ui/container";
import { companies } from "./logos";

const metrics = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "2.4B", label: "Requests / day" },
  { value: "0.8ms", label: "Median latency" },
  { value: "40+", label: "Edge regions" },
];

export function SocialProof() {
  return (
    <section className="border-y border-dark-800/60 py-16">
      <Container>
        <p className="text-center text-sm font-medium text-dark-400">
          Trusted by fast-moving engineering teams worldwide
        </p>
      </Container>

      <div className="group relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-dark-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-dark-950 to-transparent" />

        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-16 pr-16"
              aria-hidden={copy === 1}
            >
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center gap-2.5 text-dark-300 opacity-70 transition-opacity hover:opacity-100"
                >
                  <company.Mark className="h-6 w-6" />
                  <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Container className="mt-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-dark-700/60 bg-dark-700/60 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-dark-950 px-6 py-8 text-center">
              <div className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {metric.value}
              </div>
              <div className="mt-2 text-sm text-dark-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
