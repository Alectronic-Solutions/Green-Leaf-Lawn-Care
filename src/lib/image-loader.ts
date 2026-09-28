// next/image loader for the static export. scripts/optimize-images.mjs
// pre-renders every photo in public/images at each width Next asks for
// (see `images` in next.config.ts), so <Image> gets a real srcset without an
// image server.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  const match = /^\/images\/([^/]+)\.(webp|jpe?g|png)$/i.exec(src);
  if (!match) return `${BASE}${src}`;
  return `${BASE}/images/_w/${match[1]}-${width}.webp`;
}
