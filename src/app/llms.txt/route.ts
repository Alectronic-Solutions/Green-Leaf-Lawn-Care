import { site, absoluteUrl, addressLine } from "@/config/site";
import { services, formatFrom } from "@/content/services";
import { cities } from "@/content/cities";
import { faqs } from "@/content/faqs";

export const dynamic = "force-static";

// A plain-text summary of the business for AI assistants and answer
// engines (https://llmstxt.org), generated from the same config as the site.
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Services and starting prices",
    "",
    ...services.map((s) => `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): from ${formatFrom(s).replace(" ", " ")}. ${s.summary}`),
    "",
    `Final price depends on lot size and service frequency. Get an exact quote at ${absoluteUrl("/quote")}`,
    "",
    "## Service area",
    "",
    ...cities.map((c) => `- [${c.name}, ${site.address.region}](${absoluteUrl(`/service-areas/${c.slug}`)})`),
    "",
    "## Contact and hours",
    "",
    `- Phone: ${site.phone.display}`,
    `- Email: ${site.email}`,
    `- Address: ${addressLine}`,
    ...site.hours.map((h) => `- ${h.days}: ${h.label}`),
    "",
    "## Common questions",
    "",
    ...faqs.map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Other pages",
    "",
    `- [About](${absoluteUrl("/about")})`,
    `- [Reviews](${absoluteUrl("/reviews")})`,
    `- [Lawn care tips](${absoluteUrl("/blog")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
