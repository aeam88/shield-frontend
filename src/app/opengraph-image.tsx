import { ImageResponse } from "next/og";

export const alt = "Shield — API rate limiting, simplified";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 120% at 80% 0%, #1a2e05 0%, #050505 55%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#a3e635",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#050505",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 700 }}>
            Shield
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            API rate limiting, finally simple
          </div>
          <div
            style={{
              color: "#a3e635",
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            Real-time analytics · Scoped API keys · Enterprise security
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, color: "#999999", fontSize: 26 }}>
          <span>99.99% uptime</span>
          <span>·</span>
          <span>0.8ms latency</span>
          <span>·</span>
          <span>40+ edge regions</span>
        </div>
      </div>
    ),
    size,
  );
}
