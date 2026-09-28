import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import type { Icon3DName } from "@/components/site/icon-3d";
import { site } from "@/config/site";

// Blog posts live in src/content/blog/*.md with a small YAML-style
// frontmatter block. Add a post by dropping a new .md file in that folder;
// it is picked up by /blog, the sitemap, and static generation.

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  icon: Icon3DName;
  image: string;
  imageAlt: string;
  html: string;
  readingMinutes: number;
};

const dir = join(process.cwd(), "src", "content", "blog");

function parseFrontmatter(raw: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {} as Record<string, string>, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: match[2] };
}

// Internal links in posts are written as site paths ("/services/..."), so
// they need the deploy base path added when the site lives in a subfolder.
function withBasePath(html: string) {
  if (!site.basePath) return html;
  return html.replace(/href="\/(?!\/)/g, `href="${site.basePath}/`);
}

function load(file: string): Post {
  const raw = readFileSync(join(dir, file), "utf8");
  const { data, body } = parseFrontmatter(raw);
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title ?? file,
    description: data.description ?? "",
    date: data.date ?? "2026-01-01",
    icon: (data.icon as Icon3DName) ?? "leaf",
    image: data.image ?? "/images/hero.webp",
    imageAlt: data.imageAlt ?? "",
    html: withBasePath(marked.parse(body, { async: false }) as string),
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export function getPosts(): Post[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

export function formatPostDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
