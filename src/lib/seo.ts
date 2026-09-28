import type { Metadata } from "next";
import { site, absoluteUrl } from "@/config/site";
import { cities } from "@/content/cities";
import type { Service } from "@/content/services";
import type { City } from "@/content/cities";

/**
 * Per-page metadata. Every page passes its own path so the canonical URL
 * points at itself (never inherited from the homepage).
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const desc = description ?? site.description;
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Lawn Care in ${site.address.city}, ${site.address.region}`;
  const images = image
    ? [{ url: image, alt: title ?? site.name }]
    : [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}, lawn care in ${site.address.city}, ${site.address.region}` }];
  return {
    title: title ?? { absolute: fullTitle },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: path,
      siteName: site.name,
      type,
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: images.map((i) => i.url),
    },
  };
}

const businessId = `${site.url}/#business`;

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": businessId,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.phone.e164,
    email: site.email,
    image: absoluteUrl("/images/hero.webp"),
    logo: absoluteUrl("/icon.svg"),
    priceRange: site.priceRange,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: cities.map((c) => ({ "@type": "City", name: `${c.name}, ${site.address.region}` })),
    openingHoursSpecification: site.hours
      .filter((h) => h.opens)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.schemaDays,
        opens: h.opens,
        closes: h.closes,
      })),
    sameAs: Object.values(site.social),
    ...(site.rating.showInSchema
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(site.rating.value),
            reviewCount: String(site.rating.count),
          },
        }
      : {}),
  };
}

export function serviceLd(service: Service, city?: City) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: city ? `${service.name} in ${city.name}, ${site.address.region}` : service.name,
    serviceType: service.name,
    description: service.summary,
    provider: { "@id": businessId },
    areaServed: city
      ? { "@type": "City", name: `${city.name}, ${site.address.region}` }
      : cities.map((c) => ({ "@type": "City", name: `${c.name}, ${site.address.region}` })),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(service.price.from),
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.price.from,
        priceCurrency: "USD",
      },
    },
    url: absoluteUrl(`/services/${service.slug}`),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleLd(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: absoluteUrl(post.image),
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": businessId },
  };
}
