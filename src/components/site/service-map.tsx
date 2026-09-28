import Link from "next/link";
import { cities } from "@/content/cities";
import { iconSrc } from "@/components/site/icon-3d";
import { cn } from "@/lib/utils";

// A simple illustrated map of the service area, plotted from each city's
// coordinates. No map tiles or third-party scripts.

const W = 640;
const H = 520;
const PAD = 70;

const lats = cities.map((c) => c.geo.lat);
const lngs = cities.map((c) => c.geo.lng);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);

function project(lat: number, lng: number) {
  // Longitude degrees are ~0.7x as long as latitude degrees at 45°N.
  const sx = (W - PAD * 2) / ((maxLng - minLng) * 0.707);
  const sy = (H - PAD * 2) / (maxLat - minLat);
  const s = Math.min(sx, sy);
  const x = PAD + (lng - minLng) * 0.707 * s + ((W - PAD * 2) - (maxLng - minLng) * 0.707 * s) / 2;
  const y = PAD + (maxLat - lat) * s + ((H - PAD * 2) - (maxLat - minLat) * s) / 2;
  return { x, y };
}

// The Mississippi along the northeast edge of the service area.
const river = [
  [45.285, -93.56],
  [45.25, -93.48],
  [45.2, -93.4],
  [45.17, -93.33],
  [45.12, -93.3],
  [45.06, -93.28],
  [45.0, -93.27],
].map(([lat, lng]) => project(lat, lng));

const riverPath = river.reduce((d, p, i) => {
  if (i === 0) return `M${p.x},${p.y}`;
  const prev = river[i - 1];
  const mx = (prev.x + p.x) / 2;
  const my = (prev.y + p.y) / 2;
  return `${d} Q${prev.x},${prev.y} ${mx},${my}`;
}, "");

// Where each label sits relative to its pin, so neighbors in the dense
// southeast corner don't collide. Unlisted cities label below the pin.
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  "brooklyn-park": { dx: 14, dy: -8, anchor: "start" },
  "brooklyn-center": { dx: 14, dy: 12, anchor: "start" },
  "new-hope": { dx: -14, dy: 6, anchor: "end" },
  crystal: { dx: 12, dy: 26, anchor: "start" },
  osseo: { dx: -14, dy: 4, anchor: "end" },
};

export function ServiceMap({ active, className }: { active?: string; className?: string }) {
  const points = cities.map((c) => ({ ...c, ...project(c.geo.lat, c.geo.lng) }));
  return (
    <figure className={cn("relative overflow-hidden rounded-3xl border border-border bg-sage-50 shadow-soft", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Map of the cities we serve">
        <defs>
          <pattern id="map-stripes" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="14" height="28" fill="var(--sage-100)" />
          </pattern>
          <filter id="map-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#map-stripes)" opacity="0.7" />
        {/* Service zone: a soft glow around every city. */}
        <g filter="url(#map-soft)" opacity="0.9">
          {points.map((p) => (
            <circle key={p.slug} cx={p.x} cy={p.y} r="70" fill="var(--sage-200)" />
          ))}
        </g>
        <path d={riverPath} fill="none" stroke="var(--water-light)" strokeWidth="16" strokeLinecap="round" opacity="0.9" />
        <path d={riverPath} fill="none" stroke="var(--water)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
        <text x={river[2].x + 16} y={river[2].y - 8} fontSize="12" fill="var(--muted-foreground)" fontStyle="italic">
          Mississippi River
        </text>
        {points.map((p) => {
          const on = p.slug === active;
          return (
            <Link key={p.slug} href={`/service-areas/${p.slug}`} className="group">
              <circle cx={p.x} cy={p.y} r={on ? 26 : 18} fill="var(--forest-500)" opacity={on ? 0.22 : 0.12} className="transition-all duration-(--dur-ui) group-hover:opacity-30" />
              {p.home ? (
                <image href={iconSrc("house")} x={p.x - 20} y={p.y - 24} width="40" height="40" />
              ) : (
                <image href={iconSrc("pin")} x={p.x - 14} y={p.y - 26} width="28" height="28" className="transition-transform duration-(--dur-ui)" />
              )}
              <text
                x={p.x + (LABEL[p.slug]?.dx ?? 0)}
                y={p.y + (LABEL[p.slug]?.dy ?? 30)}
                textAnchor={LABEL[p.slug]?.anchor ?? "middle"}
                fontSize={on ? 16 : 14}
                fontWeight={on || p.home ? 700 : 600}
                fill={on ? "var(--forest-800)" : "var(--forest-950)"}
                stroke="var(--sage-50)"
                strokeWidth="4"
                paintOrder="stroke"
              >
                {p.name}
              </text>
            </Link>
          );
        })}
      </svg>
      <figcaption className="sr-only">
        We serve {cities.map((c) => c.name).join(", ")}.
      </figcaption>
    </figure>
  );
}
