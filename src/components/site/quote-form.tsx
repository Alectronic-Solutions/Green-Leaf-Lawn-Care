"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Phone,
  Calendar,
  ShieldCheck,
  X,
  Leaf,
  Loader2,
  Lock,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PHONE = "(763) 555-0142";

type ServiceKey =
  | "mowing"
  | "fertilization"
  | "aeration"
  | "leaf-removal"
  | "spring-cleanup"
  | "snow-removal";

const SERVICES: Record<
  ServiceKey,
  { label: string; base: number; unit: string; short: string }
> = {
  mowing: { label: "Lawn Mowing & Edging", base: 45, unit: "/ visit", short: "lawn mowing" },
  fertilization: {
    label: "Fertilization & Weed Control",
    base: 65,
    unit: "/ treatment",
    short: "fertilization",
  },
  aeration: {
    label: "Aeration & Overseeding",
    base: 180,
    unit: " flat",
    short: "aeration and overseeding",
  },
  "leaf-removal": { label: "Fall Leaf Removal", base: 90, unit: "/ visit", short: "leaf removal" },
  "spring-cleanup": { label: "Spring Cleanup", base: 120, unit: " flat", short: "spring cleanup" },
  "snow-removal": { label: "Snow Removal", base: 60, unit: "/ visit", short: "snow removal" },
};

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

function tierIndex(key: LotKey) {
  return Math.max(
    0,
    LOT_TIERS.findIndex((t) => t.key === key)
  );
}

function nearestTier(sqft: number): LotKey {
  let best: (typeof LOT_TIERS)[number] = LOT_TIERS[0];
  for (const tier of LOT_TIERS) {
    if (Math.abs(tier.sqft - sqft) < Math.abs(best.sqft - sqft)) best = tier;
  }
  return best.key;
}

const FREQUENCIES: Record<
  string,
  { label: string; discount: number; visitsPerMonth: number; suffix: string }
> = {
  weekly: { label: "Weekly", discount: 0.1, visitsPerMonth: 4, suffix: "/ month" },
  biweekly: { label: "Bi-weekly", discount: 0.05, visitsPerMonth: 2, suffix: "/ month" },
  monthly: { label: "Monthly", discount: 0, visitsPerMonth: 1, suffix: "/ month" },
  onetime: { label: "One-time", discount: 0, visitsPerMonth: 1, suffix: " one-time" },
};

const FIRST_VISIT_DISCOUNT_PCT = 10;

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  service: "mowing" as ServiceKey,
  lotSize: "quarter" as LotKey,
  sqft: "",
  frequency: "weekly",
  message: "",
};

const fmt = (n: number) => n.toLocaleString("en-US");

function ThankYouModal({
  open,
  name,
  estimate,
  introLocked,
  onClose,
}: {
  open: boolean;
  name: string;
  estimate: {
    perVisit: number;
    unit: string;
    serviceShort: string;
    discountedFirst: number;
  };
  introLocked: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
            >
              <Check className="h-8 w-8 text-primary" strokeWidth={2.5} />
            </motion.div>
          </div>

          <h3 className="mt-5 text-2xl font-bold tracking-tight">
            Thanks for submitting!
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            This is a demo site built by{" "}
            <span className="font-semibold text-foreground">Alectronic Solutions</span>
            . In a live deployment, {name.split(" ")[0] || "you"} would receive a
            callback within one business hour to confirm your{" "}
            {estimate.serviceShort} estimate of{" "}
            <span className="font-semibold text-foreground">
              ${estimate.perVisit}
              {estimate.unit}
            </span>
            .
          </p>

          <div className="mt-5 rounded-xl bg-primary/8 border border-primary/15 p-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {introLocked
                    ? `Intro rate locked: $${estimate.discountedFirst}${estimate.unit} on your first visit`
                    : `${FIRST_VISIT_DISCOUNT_PCT}% off your first visit`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Applied automatically when service begins.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-accent/60 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What happens next
            </p>
            <ol className="mt-2 space-y-2 text-sm leading-relaxed">
              <li>1. We call to confirm details and schedule your start date.</li>
              <li>2. A crew lead stops by to verify the estimate on site.</li>
              <li>3. Service begins on your scheduled day.</li>
            </ol>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild size="lg" className="w-full rounded-full">
              <a href="tel:+17635550142">
                <Phone className="mr-2 h-4 w-4" />
                Call {PHONE}
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function QuoteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [introLocked, setIntroLocked] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const estimate = useMemo(() => {
    const service = SERVICES[form.service];
    const lot = LOT_TIERS[tierIndex(form.lotSize)];
    const freq = FREQUENCIES[form.frequency];
    // Flat-rate jobs are priced once; frequency does not discount or repeat them.
    const isFlat = service.unit === " flat";
    const isOneTime = form.frequency === "onetime" || isFlat;
    const discount = isFlat ? 0 : freq.discount;
    const perVisit = Math.round(service.base * lot.mult * (1 - discount));
    const total = isOneTime ? perVisit : perVisit * freq.visitsPerMonth;
    const discountedFirst = Math.round(
      perVisit * (1 - FIRST_VISIT_DISCOUNT_PCT / 100)
    );
    return {
      perVisit,
      total,
      discountedFirst,
      discountPct: Math.round(discount * 100),
      serviceShort: service.short,
      unit: service.unit,
      frequency: freq.label,
      suffix: freq.suffix,
      isOneTime,
      lotLabel: lot.label,
      lotSqft: lot.sqft,
    };
  }, [form.service, form.lotSize, form.frequency]);

  const update = (key: keyof typeof EMPTY_FORM, value: string) => {
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
    setForm((f) => ({
      ...f,
      sqft: digits,
      lotSize: digits && n > 0 ? nearestTier(n) : f.lotSize,
    }));
  };

  const lockIntroRate = () => {
    setIntroLocked(true);
    nameRef.current?.focus();
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.phone.trim()) next.phone = "Required";
    if (!form.address.trim()) next.address = "Required";
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(true);
    }, 900);
  };

  const handleClose = () => {
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setIntroLocked(false);
  };

  const tier = tierIndex(form.lotSize);

  return (
    <>
      <AnimatePresence>
        {modalOpen && (
          <ThankYouModal
            open={modalOpen}
            name={form.name}
            estimate={estimate}
            introLocked={introLocked}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Instant estimate
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">
            Get your estimate
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tell us about your property. Your estimated price updates as you go.
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-name">Full name</Label>
                <Input
                  id="q-name"
                  ref={nameRef}
                  placeholder="Jordan Smith"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-phone">Phone</Label>
                <Input
                  id="q-phone"
                  type="tel"
                  placeholder="(763) 555-0123"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-email">
                  Email{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="q-email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-address">Service address</Label>
                <Input
                  id="q-address"
                  placeholder="123 Maple St, Maple Grove"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  aria-invalid={!!errors.address}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-service" id="q-service-label">Service</Label>
                <Select
                  value={form.service}
                  onValueChange={(v) => update("service", v)}
                >
                  <SelectTrigger id="q-service" aria-labelledby="q-service-label" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICES).map(([key, s]) => (
                      <SelectItem key={key} value={key}>
                        {s.label} · from ${s.base}
                        {s.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-frequency" id="q-frequency-label">Frequency</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(v) => update("frequency", v)}
                >
                  <SelectTrigger id="q-frequency" aria-labelledby="q-frequency-label" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FREQUENCIES).map(([key, f]) => (
                      <SelectItem key={key} value={key}>
                        {f.label}
                        {f.discount > 0
                          ? ` · ${Math.round(f.discount * 100)}% off`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lot size slider */}
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="q-lot-size" className="flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5 text-primary" />
                  Lot size
                </Label>
                <p className="text-sm tabular-nums text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {estimate.lotLabel}
                  </span>
                  {" · "}about {fmt(estimate.lotSqft)} sq ft
                </p>
              </div>

              <Slider
                id="q-lot-size"
                aria-label="Lot size"
                aria-valuetext={`${estimate.lotLabel}, about ${fmt(estimate.lotSqft)} square feet`}
                className="mt-4"
                min={0}
                max={LOT_TIERS.length - 1}
                step={1}
                value={[tier]}
                onValueChange={([v]) => setTier(v)}
              />
              <div className="mt-2 flex justify-between text-xs">
                {LOT_TIERS.map((t, i) => (
                  <button
                    key={t.key}
                    type="button"
                    tabIndex={-1}
                    onClick={() => setTier(i)}
                    className={
                      i === tier
                        ? "font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {t.tick}
                    {i === LOT_TIERS.length - 1 ? " acre" : ""}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  Or enter square feet
                </span>
                <div className="relative w-36">
                  <Input
                    id="q-sqft"
                    aria-label="Lot size in square feet"
                    inputMode="numeric"
                    placeholder={fmt(estimate.lotSqft)}
                    value={form.sqft ? fmt(Number(form.sqft)) : ""}
                    onChange={(e) => setSqft(e.target.value)}
                    className="h-9 pr-11 text-sm tabular-nums"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                    sq ft
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-msg">Notes (optional)</Label>
              <Textarea
                id="q-msg"
                rows={3}
                placeholder="Gate codes, problem weeds, pets, best time to call."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="resize-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-6 w-full rounded-full"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing your estimate
              </>
            ) : (
              "See my estimate"
            )}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            We call once, within one business day. No spam, no obligation.
          </p>
        </form>

        {/* Price panel: stretches to the form's height via the grid's default
            align-items: stretch, with the footer pinned by mt-auto. */}
        <div className="flex flex-col">
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-foreground p-6 text-background shadow-sm sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
            />

            <div className="relative flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-background/60">
                Your estimated price
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/10 px-2.5 py-1 text-xs font-medium text-background/85">
                <Calendar className="h-3 w-3" />
                {estimate.frequency}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${estimate.perVisit}-${estimate.total}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="relative mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2"
              >
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-bold tracking-tight tabular-nums">
                      ${estimate.perVisit}
                    </span>
                    <span className="text-sm text-background/70">
                      {estimate.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-background/70">
                    {estimate.serviceShort.charAt(0).toUpperCase() +
                      estimate.serviceShort.slice(1)}
                  </p>
                </div>
                {!estimate.isOneTime && (
                  <div className="text-right">
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                      ~${fmt(estimate.total)}
                    </p>
                    <p className="text-xs text-background/60">
                      {estimate.suffix.trim()}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <dl className="relative mt-6 space-y-2.5 border-t border-background/10 pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-background/60">Lot size</dt>
                <dd className="text-right font-medium tabular-nums">
                  {estimate.lotLabel}
                  <span className="text-background/55">
                    , about {fmt(estimate.lotSqft)} sq ft
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-background/60">Frequency discount</dt>
                <dd className="font-medium tabular-nums">
                  {estimate.discountPct > 0
                    ? `${estimate.discountPct}% off`
                    : "None"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-background/60">First visit</dt>
                <dd className="font-semibold tabular-nums text-success">
                  ${estimate.discountedFirst}
                  {estimate.unit}
                  <span className="font-medium">
                    {" "}
                    ({FIRST_VISIT_DISCOUNT_PCT}% off)
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-background/60">On-site confirmation</dt>
                <dd className="font-medium">Included</dd>
              </div>
            </dl>

            <div className="relative mt-5">
              {introLocked ? (
                <div
                  role="status"
                  className="flex items-center justify-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-2.5 text-sm font-semibold text-success"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Intro rate locked. Finish the form to claim it.
                </div>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={lockIntroRate}
                  className="w-full rounded-full bg-background text-foreground hover:bg-background/90"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Lock in ${estimate.discountedFirst} first visit
                </Button>
              )}
            </div>

            <ul className="relative mt-5 space-y-1.5 border-t border-background/10 pt-5 text-sm">
              {[
                "Free, no-obligation estimate",
                "Same crew, same day each week",
                "Licensed and insured in Minnesota",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                  <span className="text-background/90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="relative mt-auto border-t border-background/10 pt-4">
              <p className="text-sm leading-relaxed text-background/55">
                This is a typical price for your area. We confirm the exact
                number on site.
              </p>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-background/8 px-4 py-3 text-sm">
                <span className="text-background/70">Prefer to talk?</span>
                <a
                  href="tel:+17635550142"
                  className="flex items-center gap-1.5 font-semibold text-background hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
