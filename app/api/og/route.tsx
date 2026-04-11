import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "サッカースパイクNavi";
  const subtitle = searchParams.get("subtitle") || "全年代対応の比較レビュー";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%)",
          color: "white",
          padding: 80,
          justifyContent: "space-between",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.9 }}>⚽ サッカースパイクNavi</div>
        <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.85 }}>{subtitle}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
