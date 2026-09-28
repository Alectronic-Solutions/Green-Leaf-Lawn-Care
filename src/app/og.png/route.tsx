import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/config/site";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

// Google Fonts returns TTF (which the renderer needs) to non-browser user
// agents. If the download fails, the card still renders in the default font.
async function loadFont(family: string, weight: number) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      })
    ).text();
    const url = /src: url\((.+?)\)/.exec(css)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

// The default social share card (/og.png), rendered once at build time.
// Served as a real .png file so every host sends the right content type.
export async function GET() {
  const photo = readFileSync(join(process.cwd(), "public", "images", "hero-video-poster.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const [serif, sans] = await Promise.all([loadFont("Fraunces", 600), loadFont("Geist", 600)]);
  const fonts = [
    ...(serif ? [{ name: "Fraunces", data: serif, weight: 600 as const, style: "normal" as const }] : []),
    ...(sans ? [{ name: "Geist", data: sans, weight: 600 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative", fontFamily: "Geist" }}>
        <img src={src} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(90deg, rgba(22,44,31,0.94) 0%, rgba(22,44,31,0.78) 50%, rgba(22,44,31,0.15) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 820, height: 630 }}>
          <div style={{ display: "flex", color: "#e9c46a", fontSize: 24, letterSpacing: 5, textTransform: "uppercase" }}>{site.name}</div>
          <div style={{ display: "flex", marginTop: 22, color: "#f8f5ec", fontSize: 66, lineHeight: 1.06, fontFamily: "Fraunces" }}>
            {`Lawn care in ${site.address.city}, done right the first time.`}
          </div>
          <div style={{ display: "flex", marginTop: 26, color: "rgba(248,245,236,0.82)", fontSize: 26 }}>
            Mowing · Feeding · Aeration · Cleanups · Snow
          </div>
          <div style={{ display: "flex", marginTop: 40 }}>
            <div style={{ display: "flex", background: "#e9c46a", color: "#1d3325", fontSize: 28, padding: "14px 30px", borderRadius: 999 }}>
              {site.phone.display}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
