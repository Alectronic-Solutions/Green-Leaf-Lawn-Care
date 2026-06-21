"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
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
import { Badge } from "@/components/ui/badge";
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
  { label: string; base: number; unit: string; desc: string }
> = {
  mowing: {
    label: "Lawn Mowing & Edging",
    base: 45,
    unit: "/ visit",
    desc: "Professional mow, precision edging & cleanup",
  },
  fertilization: {
    label: "Fertilization & Weed Control",
    base: 65,
    unit: "/ treatment",
    desc: "Seasonal feeding + targeted weed control",
  },
  aeration: {
    label: "Aeration & Overseeding",
    base: 180,
    unit: " flat",
    desc: "Core aeration to relieve compaction + seed",
  },
  "leaf-removal": {
    label: "Fall Leaf Removal",
    base: 90,
    unit: "/ visit",
    desc: "Full property leaf cleanup & hauling",
  },
  "spring-cleanup": {
    label: "Spring Cleanup",
    base: 120,
    unit: " flat",
    desc: "Debris removal, bed cleanup, first cut",
  },
  "snow-removal": {
    label: "Snow Removal",
    base: 60,
    unit: "/ visit",
    desc: "Driveway & walkway clearing, salting",
  },
};

const LOT_SIZES: Record<string, { label: string; mult: number }> = {
  small: { label: "Small — under ¼ acre", mult: 1.0 },
  medium: { label: "Medium — ¼ to ½ acre", mult: 1.3 },
  large: { label: "Large — ½ to 1 acre", mult: 1.7 },
  xlarge: { label: "Extra Large — 1+ acres", mult: 2.2 },
};

const FREQUENCIES: Record<
  string,
  { label: string; discount: number; visitsPerMonth: number }
> = {
  weekly: { label: "Weekly", discount: 0.1, visitsPerMonth: 4 },
  biweekly: { label: "Bi-weekly", discount: 0.05, visitsPerMonth: 2 },
  monthly: { label: "Monthly", discount: 0, visitsPerMonth: 1 },
  onetime: { label: "One-time", discount: 0, visitsPerMonth: 1 },
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
    const perVisit = Math.round(
      service.base * lot.mult * (1 - freq.discount)
    );
    const monthly =
      form.frequency === "onetime"
        ? perVisit
        : perVisit * freq.visitsPerMonth;
    return {
      perVisit,
      monthly,
      serviceName: service.label,
      unit: service.unit,
      frequency: freq.label,
    };
  }, [form.service, form.lotSize, form.frequency]);

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast({
        title: "Please fill in your name, phone, and address",
        description: "We need these to prepare your quote.",
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
          estimatedPrice: estimate.monthly,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSuccess(true);
      toast({
        title: "Quote request received!",
        description: "We'll call you within 1 business hour.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please call us directly at " + PHONE,
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
        className="relative scroll-mt-20 overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-lg"
      >
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
          >
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </motion.div>
          <h3 className="mt-6 text-2xl font-extrabold tracking-tight">
            Your quote is on the way!
          </h3>
          <p className="mt-3 text-muted-foreground">
            Thanks, {form.name.split(" ")[0] || "neighbor"}! Based on what you
            told us, your estimated price is{" "}
            <span className="font-bold text-foreground">
              ${estimate.perVisit}
              {estimate.unit}
            </span>{" "}
            for {estimate.serviceName.toLowerCase()}. A Green Leaf specialist
            will call you within <strong>1 business hour</strong> to confirm
            details and schedule your first visit.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row w-full">
            <Button asChild size="lg" className="rounded-full flex-1">
              <a href="tel:+17635550142">
                <Phone className="mr-2 h-4 w-4" />
                Call now: {PHONE}
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
              New quote
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="quote"
      className="scroll-mt-20 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8"
    >
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg"
      >
        <div className="mb-6 flex items-center gap-2">
          <Badge className="rounded-full gap-1">
            <Sparkles className="h-3 w-3" /> Instant Estimate
          </Badge>
        </div>
        <h3 className="text-2xl font-extrabold tracking-tight">
          Get your free instant quote
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tell us about your lawn. See your estimated price instantly — no
          waiting, no obligation.
        </p>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-name">Full name *</Label>
              <Input
                id="q-name"
                placeholder="Jordan Smith"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-phone">Phone *</Label>
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
              <Label htmlFor="q-address">Service address *</Label>
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
            <Label>Which service do you need?</Label>
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
                    {s.label} — from ${s.base}
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
              <Label>Service frequency</Label>
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
                        ? ` — ${Math.round(f.discount * 100)}% off`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="q-msg">Anything else we should know? (optional)</Label>
            <Textarea
              id="q-msg"
              rows={3}
              placeholder="Gate codes, problem weeds, pet concerns, best time to call…"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-6 w-full rounded-full text-base"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing your quote…
            </>
          ) : (
            <>Get My Instant Quote</>
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          No spam. We call once, within 1 business hour.
        </p>
      </form>

      {/* Live estimate */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${estimate.perVisit}-${estimate.monthly}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8 text-primary-foreground shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                Your estimated price
              </span>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-5xl font-extrabold tracking-tight">
                  ${estimate.perVisit}
                </span>
                <span className="mb-1.5 text-sm opacity-90">
                  {estimate.unit}
                </span>
              </div>
              <p className="mt-1 text-sm opacity-90">{estimate.serviceName}</p>

              <div className="mt-6 space-y-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 opacity-90">
                    <Calendar className="h-4 w-4" />
                    {estimate.frequency}
                  </span>
                  <span className="font-semibold">
                    {form.frequency === "onetime"
                      ? "One-time service"
                      : `~$${estimate.monthly}/month`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 opacity-90">
                    <MapPin className="h-4 w-4" />
                    {LOT_SIZES[form.lotSize].label.split("—")[0].trim()}
                  </span>
                  <span className="font-semibold">Included</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 border-t border-white/20 pt-5 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Free, no-obligation estimate
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  100% satisfaction guarantee
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Licensed &amp; insured crew
                </p>
              </div>

              <p className="mt-5 text-xs opacity-80">
                * Estimates are based on typical jobs in your area. Final
                pricing confirmed on site. New customers get a first-visit
                discount.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Prefer to talk?</span>
          <a
            href="tel:+17635550142"
            className="flex items-center gap-1.5 font-bold text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
