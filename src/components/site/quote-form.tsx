"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon3D } from "@/components/site/icon-3d";
import { services, unitLabel, getService } from "@/content/services";
import { site, phoneHref } from "@/config/site";
import { submitLead } from "@/lib/forms";
import { track } from "@/lib/analytics";
import { DURATION, EASE_SOFT } from "@/lib/motion";
import { useClientValue } from "@/lib/use-client-value";

// Ordered so the slider index maps straight to a tier. `sqft` is the
// nominal size of the tier; typed square footage snaps to the nearest one.
const LOT_TIERS = [
  { key: "eighth", label: "1/8 acre", tick: "1/8", sqft: 5445, mult: 1.0 },
  { key: "quarter", label: "1/4 acre", tick: "1/4", sqft: 10890, mult: 1.2 },
  { key: "half", label: "1/2 acre", tick: "1/2", sqft: 21780, mult: 1.5 },
  { key: "threeQuarter", label: "3/4 acre", tick: "3/4", sqft: 32670, mult: 1.85 },
  { key: "acre", label: "1 acre+", tick: "1+", sqft: 43560, mult: 2.2 },
] as const;

type LotKey = (typeof LOT_TIERS)[number]["key"];

const tierIndex = (key: LotKey) => Math.max(0, LOT_TIERS.findIndex((t) => t.key === key));

function nearestTier(sqft: number): LotKey {
  let best: (typeof LOT_TIERS)[number] = LOT_TIERS[0];
  for (const tier of LOT_TIERS) {
    if (Math.abs(tier.sqft - sqft) < Math.abs(best.sqft - sqft)) best = tier;
  }
  return best.key;
}

const FREQUENCIES: Record<string, { label: string; discount: number; visitsPerMonth: number }> = {
  weekly: { label: "Weekly", discount: 0.1, visitsPerMonth: 4 },
  biweekly: { label: "Every other week", discount: 0.05, visitsPerMonth: 2 },
  monthly: { label: "Monthly", discount: 0, visitsPerMonth: 1 },
  onetime: { label: "One time", discount: 0, visitsPerMonth: 1 },
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  // Empty until the visitor picks one; until then the URL prefill or the
  // first service is used.
  service: "",
  lotSize: "quarter" as LotKey,
  sqft: "",
  frequency: "weekly",
  promo: null as string | null,
  message: "",
};

const fmt = (n: number) => n.toLocaleString("en-US");

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [introLocked, setIntroLocked] = useState(false);
  const [trap, setTrap] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Prefill from links like /quote?service=aeration-overseeding&promo=STRIPES10
  const search = useClientValue(() => window.location.search, "");
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const urlService = params.get("service");
  const serviceSlug = form.service || (urlService && getService(urlService) ? urlService : services[0].slug);
  const promo = form.promo ?? (params.get("promo") ?? "").toUpperCase().slice(0, 24);

  const promoValid = promo.trim().toUpperCase() === site.offers.gamePromo.code;

  const estimate = useMemo(() => {
    const service = getService(serviceSlug) ?? services[0];
    const lot = LOT_TIERS[tierIndex(form.lotSize)];
    const freq = FREQUENCIES[form.frequency];
    // Flat-rate jobs are priced once; frequency does not discount or repeat them.
    const isFlat = service.price.unit === "flat";
    const isOneTime = form.frequency === "onetime" || isFlat;
    const discount = isFlat ? 0 : freq.discount;
    const perVisit = Math.round(service.price.from * lot.mult * (1 - discount));
    const total = isOneTime ? perVisit : perVisit * freq.visitsPerMonth;
    const firstPct = site.offers.firstVisitPct + (promoValid ? site.offers.gamePromo.pct : 0);
    return {
      perVisit,
      total,
      firstPct,
      discountedFirst: Math.round(perVisit * (1 - firstPct / 100)),
      discountPct: Math.round(discount * 100),
      name: service.name,
      unit: isFlat ? "" : unitLabel[service.price.unit],
      frequency: isFlat ? "One time" : freq.label,
      isOneTime,
      lotLabel: lot.label,
      lotSqft: lot.sqft,
    };
  }, [serviceSlug, form.lotSize, form.frequency, promoValid]);

  const update = (key: Exclude<keyof typeof EMPTY_FORM, "promo">, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const setTier = (index: number) => {
    const tier = LOT_TIERS[Math.min(LOT_TIERS.length - 1, Math.max(0, index))];
    setForm((f) => ({ ...f, lotSize: tier.key, sqft: "" }));
  };

  const setSqft = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "").slice(0, 7);
    const n = Number(digits);
    setForm((f) => ({ ...f, sqft: digits, lotSize: digits && n > 0 ? nearestTier(n) : f.lotSize }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please add your name.";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Please add a 10-digit phone number.";
    if (!form.address.trim()) next.address = "Please add the service address.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "That email does not look right.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.getElementById(`q-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const res = await submitLead(
      "quote",
      {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        service: serviceSlug,
        service_name: estimate.name,
        lot_size: form.sqft ? `${fmt(Number(form.sqft))} sq ft` : estimate.lotLabel,
        frequency: estimate.frequency,
        estimate: `$${estimate.perVisit}${estimate.unit ? ` ${estimate.unit}` : ""}`,
        first_visit: `$${estimate.discountedFirst} (${estimate.firstPct}% off)`,
        intro_rate_locked: introLocked ? "yes" : "no",
        promo,
        message: form.message,
      },
      trap
    );
    if (res.ok) {
      router.push("/quote/thank-you");
    } else {
      setSubmitting(false);
      setSubmitError(res.error);
    }
  };

  const tier = tierIndex(form.lotSize);
  const field = (key: string) => ({
    "aria-invalid": !!errors[key] || undefined,
    "aria-describedby": errors[key] ? `q-${key}-error` : undefined,
  });
  const errorText = (key: string) =>
    errors[key] ? (
      <p id={`q-${key}-error`} className="text-sm text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
      <form onSubmit={handleSubmit} noValidate data-no-leaves className="relative rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-9">
        {!compact && (
          <div className="flex items-start gap-4">
            <Icon3D name="memo" size={52} />
            <div>
              <h2 className="font-display text-2xl font-semibold">Tell us about your lawn</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">Your price updates as you go.</p>
            </div>
          </div>
        )}

        {/* Honeypot: hidden from people, irresistible to bots. */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Company website
            <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </label>
        </div>

        <div className={compact ? "space-y-5" : "mt-7 space-y-5"}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-name">Full name</Label>
              <Input id="q-name" ref={nameRef} autoComplete="name" placeholder="Jordan Smith" value={form.name} onChange={(e) => update("name", e.target.value)} {...field("name")} />
              {errorText("name")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-phone">Phone</Label>
              <Input id="q-phone" type="tel" autoComplete="tel" placeholder="(763) 555-0123" value={form.phone} onChange={(e) => update("phone", e.target.value)} {...field("phone")} />
              {errorText("phone")}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-email">
                Email <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input id="q-email" type="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} {...field("email")} />
              {errorText("email")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-address">Service address</Label>
              <Input id="q-address" autoComplete="street-address" placeholder={`123 Maple St, ${site.address.city}`} value={form.address} onChange={(e) => update("address", e.target.value)} {...field("address")} />
              {errorText("address")}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label id="q-service-label">Service</Label>
              <Select value={serviceSlug} onValueChange={(v) => update("service", v)}>
                <SelectTrigger aria-labelledby="q-service-label" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      <Icon3D name={s.icon} size={18} />
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label id="q-frequency-label">How often</Label>
              <Select value={form.frequency} onValueChange={(v) => update("frequency", v)}>
                <SelectTrigger aria-labelledby="q-frequency-label" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCIES).map(([key, f]) => (
                    <SelectItem key={key} value={key}>
                      {f.label}
                      {f.discount > 0 ? ` · save ${Math.round(f.discount * 100)}%` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-sage-50/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <Label htmlFor="q-lot-size" className="flex items-center gap-2">
                <Icon3D name="ruler" size={22} />
                Lot size
              </Label>
              <p className="text-sm tabular-nums text-muted-foreground">
                <span className="font-semibold text-foreground">{estimate.lotLabel}</span>
                <span className="nowrap">, about {fmt(estimate.lotSqft)} sq ft</span>
              </p>
            </div>
            <Slider
              id="q-lot-size"
              aria-label="Lot size"
              aria-valuetext={`${estimate.lotLabel}, about ${fmt(estimate.lotSqft)} square feet`}
              className="mt-5"
              min={0}
              max={LOT_TIERS.length - 1}
              step={1}
              value={[tier]}
              onValueChange={([v]) => setTier(v)}
            />
            <div className="mt-2.5 flex justify-between text-xs">
              {LOT_TIERS.map((t, i) => (
                <button
                  key={t.key}
                  type="button"
                  tabIndex={-1}
                  onClick={() => setTier(i)}
                  className={i === tier ? "font-semibold text-primary" : "text-muted-foreground transition-colors hover:text-foreground"}
                >
                  {t.tick}
                  {i === LOT_TIERS.length - 1 ? " acre" : ""}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Label htmlFor="q-sqft" className="text-xs font-normal text-muted-foreground">
                Or enter square feet
              </Label>
              <div className="relative w-36">
                <Input
                  id="q-sqft"
                  inputMode="numeric"
                  placeholder={fmt(estimate.lotSqft)}
                  value={form.sqft ? fmt(Number(form.sqft)) : ""}
                  onChange={(e) => setSqft(e.target.value)}
                  className="h-10 pr-12 text-sm tabular-nums"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">sq ft</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
            <div className="space-y-2">
              <Label htmlFor="q-message">
                Notes <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea id="q-message" rows={3} placeholder="Gate codes, pets, problem weeds, best time to call." value={form.message} onChange={(e) => update("message", e.target.value)} className="resize-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-promo">
                Promo code <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input id="q-promo" autoComplete="off" placeholder="STRIPES10" value={promo} onChange={(e) => setForm((f) => ({ ...f, promo: e.target.value.toUpperCase() }))} className="uppercase tracking-wider" />
              {promo && (
                <p className={promoValid ? "text-sm font-medium text-primary" : "text-sm text-muted-foreground"}>
                  {promoValid ? `Applied: extra ${site.offers.gamePromo.pct}% off your first visit.` : "We will check this code when we call."}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" variant="cta" size="lg" disabled={submitting} className="mt-7 w-full">
          {submitting ? (
            <>
              <span className="leaf-spinner" aria-hidden />
              Sending your request
            </>
          ) : (
            <span className="arrow-link">Send my free quote request</span>
          )}
        </Button>
        {submitError && (
          <p role="alert" className="mt-3 text-center text-sm text-destructive">
            {submitError} You can also call <a className="font-semibold underline" href={phoneHref}>{site.phone.display}</a>.
          </p>
        )}
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Icon3D name="lock" size={18} />
          We call once, within one business day. No spam, no obligation.
        </p>
      </form>

      {/* Live estimate panel */}
      <div className="flex flex-col">
        <div className="grain on-dark relative flex h-full flex-col overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground shadow-lift sm:p-9">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/60">Your estimated price</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 text-xs font-medium text-cream/85">
              {estimate.frequency}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${estimate.perVisit}-${estimate.total}-${estimate.name}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.micro, ease: EASE_SOFT }}
              className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2"
            >
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-6xl font-semibold tabular-nums">${estimate.perVisit}</span>
                  <span className="text-sm text-cream/70 nowrap">{estimate.unit || "flat"}</span>
                </div>
                <p className="mt-1 text-sm text-cream/70">{estimate.name}</p>
              </div>
              {!estimate.isOneTime && (
                <div className="text-right">
                  <p className="text-2xl font-semibold tabular-nums">~${fmt(estimate.total)}</p>
                  <p className="text-xs text-cream/60">per month</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <dl className="mt-7 space-y-3 border-t border-cream/10 pt-6 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/60">Lot size</dt>
              <dd className="text-right font-medium tabular-nums">{estimate.lotLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/60">Frequency savings</dt>
              <dd className="font-medium tabular-nums">{estimate.discountPct > 0 ? `${estimate.discountPct}% off` : "None"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/60">First visit</dt>
              <dd className="text-right font-semibold tabular-nums text-moss-300">
                ${estimate.discountedFirst} <span className="font-medium">({estimate.firstPct}% off)</span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/60">On-site confirmation</dt>
              <dd className="font-medium">Included</dd>
            </div>
          </dl>

          <div className="mt-6">
            {introLocked ? (
              <div role="status" className="flex items-center justify-center gap-2 rounded-full border border-moss-300/40 bg-moss-300/10 px-4 py-3 text-sm font-semibold text-moss-300">
                <Icon3D name="sparkles" size={20} />
                Intro rate locked. Finish the form to claim it.
              </div>
            ) : (
              <Button
                type="button"
                size="lg"
                variant="cta"
                className="w-full"
                onClick={() => {
                  setIntroLocked(true);
                  track("intro_rate_locked");
                  nameRef.current?.focus();
                }}
              >
                <Icon3D name="lock" size={20} />
                Lock in ${estimate.discountedFirst} first visit
              </Button>
            )}
          </div>

          <ul className="mt-6 space-y-3 border-t border-cream/10 pt-6 text-sm">
            {[
              { icon: "handshake" as const, text: "Free, no-obligation estimate" },
              { icon: "calendar" as const, text: "Same crew, same day each week" },
              { icon: "shield" as const, text: "Licensed and insured in Minnesota" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <Icon3D name={item.icon} size={24} />
                <span className="text-cream/90">{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <p className="text-sm leading-relaxed text-cream/55">A typical price for your area. We confirm the exact number on site.</p>
            <a href={phoneHref} className="group mt-4 flex items-center justify-between gap-3 rounded-2xl bg-cream/8 px-4 py-3.5 text-sm transition-colors hover:bg-cream/12">
              <span className="text-cream/70">Prefer to talk?</span>
              <span className="flex items-center gap-2 font-semibold text-cream nowrap">
                <Icon3D name="phone" size={20} float />
                {site.phone.display}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
