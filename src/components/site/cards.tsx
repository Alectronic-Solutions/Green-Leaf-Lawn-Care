import Image from "next/image";
import Link from "next/link";
import { Icon3D } from "@/components/site/icon-3d";
import { Monogram, Stars } from "@/components/site/page-parts";
import { formatFrom, type Service } from "@/content/services";
import type { City } from "@/content/cities";
import { getCity } from "@/content/cities";
import { getService } from "@/content/services";
import { formatReviewDate, type Review } from "@/content/reviews";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft hover:border-primary/30",
        className
      )}
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-(--dur-reveal) group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-forest-950/35 to-transparent" />
      </div>
      <div className="relative flex flex-1 flex-col p-6 pt-9">
        <Icon3D name={service.icon} size={60} float className="absolute -top-9 left-5" />
        <h3 className="text-lg font-semibold leading-snug">{service.name}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{service.summary}</p>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            From <span className="font-semibold text-foreground nowrap">{formatFrom(service)}</span>
          </span>
          <span className="arrow-link text-sm font-semibold text-primary">Details</span>
        </div>
      </div>
    </Link>
  );
}

export function CityCard({ city, className }: { city: City; className?: string }) {
  return (
    <Link
      href={`/service-areas/${city.slug}`}
      className={cn(
        "group lift flex min-w-0 items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-primary/30",
        className
      )}
    >
      <Icon3D name={city.home ? "house" : "pin"} size={36} float />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{city.name}</span>
        <span className="line-clamp-1 text-sm text-muted-foreground">{city.lawnNote}</span>
      </span>
      <span aria-hidden className="arrow-link text-primary" />
    </Link>
  );
}

export function ReviewCard({ review, className }: { review: Review; className?: string }) {
  const city = getCity(review.city);
  const service = getService(review.service);
  return (
    <figure className={cn("lift flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} size={18} />
        <span className="text-xs text-muted-foreground">{formatReviewDate(review.date)}</span>
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/85">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <Monogram name={review.name} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{review.name}</span>
          <span className="block text-xs text-muted-foreground">
            {city?.name ?? ""}
            {service ? ` · ${service.short.charAt(0).toUpperCase() + service.short.slice(1)}` : ""}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
