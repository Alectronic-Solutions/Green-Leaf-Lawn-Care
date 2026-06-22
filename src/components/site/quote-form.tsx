"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Check,
  Phone,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

const LOT_SIZES: Record<string, { label: string; mult: number }> = {
  small: { label: "Small, under ¼ acre", mult: 1.0 },
  medium: { label: "Medium, ¼ to ½ acre", mult: 1.3 },
  large: { label: "Large, ½ to 1 acre", mult: 1.7 },
  xlarge: { label: "Extra large, 1+ acres", mult: 2.2 },
};

const FREQUENCIES: Record<
  string,
  { label: string; discount: number; visitsPerMonth: number; suffix: string }
> = {
  weekly: { label: "Weekly", discount: 0.1, visitsPerMonth: 4, suffix: "/ month" },
  biweekly: { label: "Bi-weekly", discount: 0.05, visitsPerMonth: 2, suffix: "/ month" },
  monthly: { label: "Monthly", discount: 0, visitsPerMonth: 1, suffix: "/ month" },
  onetime: { label: "One-time", discount: 0, visitsPerMonth: 1, suffix: " one-time" },
};

export function QuoteForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service: "mowing" as ServiceKey,
    lotSize: "medium",
    frequency: "weekly",
    message: "",
  });

  const estimate = useMemo(() => {
    const service = SERVICES[form.service];
    const lot = LOT_SIZES[form.lotSize];
    const freq = FREQUENCIES[form.frequency];
    const perVisit = Math.round(service.base * lot.mult * (1 - freq.discount));
    const total =
      form.frequency === "onetime" ? perVisit : perVisit * freq.visitsPerMonth;
    return {
      perVisit,
      total,
      serviceShort: service.short,
      unit: service.unit,
      frequency: freq.label,
      suffix: freq.suffix,
      isOneTime: form.frequency === "onetime",
    };
  }, [form.service, form.lotSize, form.frequency]);

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast({
        title: "A few fields are required",
        description: "Please add your name, phone, and service address.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedPrice: estimate.total,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSuccess(true);
      toast({
        title: "Estimate request received",
        description: "A crew lead will call you within one business day.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: `Please call us directly at ${PHONE}.`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        id="quote"
        className="scroll-mt-20 overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-sm"
      >
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <Check className="h-8 w-8 text-primary" strokeWidth={2.5} />
          </motion.div>
          <h3 className="mt-6 text-2xl font-bold tracking-tight">
            Your estimate is ready
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Thanks, {form.name.split(" ")[0] || "neighbor"}. Based on what you
            told us, your estimated price is{" "}
            <span className="font-semibold text-foreground">
              ${estimate.perVisit}
              {estimate.unit}
            </span>{" "}
            for {estimate.serviceShort}. A crew lead will call within one
            business day to confirm the details and answer any questions.
          </p>
          <div className="mt-6 w-full rounded-xl bg-accent/60 p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              What happens next
            </p>
            <ol className="mt-2 space-y-1.5 text-sm text-foreground">
              <li>1. We call to confirm details and schedule.</li>
              <li>2. A crew lead stops by to verify the estimate on site.</li>
              <li>3. Service begins on your scheduled day.</li>
            </ol>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row w-full">
            <Button asChild size="lg" className="rounded-full flex-1">
              <a href="tel:+17635550142">
                <Phone className="mr-2 h-4 w-4" />
                Call {PHONE}
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full flex-1"
              onClick={() => {
                setSuccess(false);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  service: "mowing",
                  lotSize: "medium",
                  frequency: "weekly",
                  message: "",
                });
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Start over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="quote"
      className="scroll-mt-20 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8"
    >
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
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tell us about your property. Your estimated price updates as you go.
        </p>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-name">Full name</Label>
              <Input
                id="q-name"
                placeholder="Jordan Smith"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-phone">Phone</Label>
              <Input
                id="q-phone"
                type="tel"
                placeholder="(763) 555-0123"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-email">Email</Label>
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
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Service</Label>
            <Select
              value={form.service}
              onValueChange={(v) => update("service", v)}
            >
              <SelectTrigger className="w-full">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Lot size</Label>
              <Select
                value={form.lotSize}
                onValueChange={(v) => update("lotSize", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LOT_SIZES).map(([key, l]) => (
                    <SelectItem key={key} value={key}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) => update("frequency", v)}
              >
                <SelectTrigger className="w-full">
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

          <div className="space-y-1.5">
            <Label htmlFor="q-msg">Notes (optional)</Label>
            <Textarea
              id="q-msg"
              rows={3}
              placeholder="Gate codes, problem weeds, pets, best time to call."
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
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
            <>See my estimate</>
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          We call once, within one business day. No spam, no obligation.
        </p>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${estimate.perVisit}-${estimate.total}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-foreground p-6 sm:p-8 text-background shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-background/60">
              Your estimated price
            </p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-5xl font-bold tracking-tight tabular-nums">
                ${estimate.perVisit}
              </span>
              <span className="text-sm text-background/70">
                {estimate.unit}
              </span>
            </div>
            <p className="mt-1 text-sm text-background/70 capitalize">
              {estimate.serviceShort}
            </p>

            <dl className="mt-6 space-y-3 border-t border-background/15 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-background/70">
                  <Calendar className="h-4 w-4" />
                  {estimate.frequency}
                </dt>
                <dd className="font-semibold tabular-nums">
                  {estimate.isOneTime
                    ? "One-time"
                    : `~$${estimate.total}${estimate.suffix}`}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-background/70">On-site confirmation</dt>
                <dd className="font-semibold">Included</dd>
              </div>
            </dl>

            <ul className="mt-6 space-y-2 border-t border-background/15 pt-5 text-sm">
              {[
                "Free, no-obligation estimate",
                "Same crew, same day each week",
                "Licensed and insured in Minnesota",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                  <span className="text-background/90">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-background/15 pt-4 text-xs leading-relaxed text-background/55">
              Estimates reflect typical jobs in your area. Final pricing is
              confirmed on site. New customers receive a first-visit discount.
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Prefer to talk?</span>
          <a
            href="tel:+17635550142"
            className="flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
