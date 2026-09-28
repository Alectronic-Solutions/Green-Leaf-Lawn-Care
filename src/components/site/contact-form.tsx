"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon3D } from "@/components/site/icon-3d";
import { submitLead, type LeadKind } from "@/lib/forms";
import { site } from "@/config/site";

export function ContactForm({ kind = "contact", cta = "Send message" }: { kind?: LeadKind; cta?: string }) {
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "" });
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim() || (!values.phone.trim() && !values.email.trim())) {
      setStatus("error");
      setError("Please add your name and a phone number or email.");
      return;
    }
    setStatus("sending");
    const res = await submitLead(kind, values, trap);
    if (res.ok) setStatus("sent");
    else {
      setStatus("error");
      setError(res.error);
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
        <Icon3D name="envelope" size={72} />
        <p className="font-display mt-4 text-2xl font-semibold">Message received</p>
        <p className="measure-narrow mt-2 text-muted-foreground">
          Thanks, {values.name.split(" ")[0]}. We reply within one business day.
          {site.demoMode ? " (Demo site: nothing was actually sent.)" : ""}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate data-no-leaves className="relative space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-name">Name</Label>
        <Input id="c-name" autoComplete="name" value={values.name} onChange={set("name")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" autoComplete="email" value={values.email} onChange={set("email")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-message">{kind === "careers" ? "Tell us about yourself" : "How can we help?"}</Label>
        <Textarea id="c-message" rows={5} value={values.message} onChange={set("message")} className="resize-none" />
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" variant="cta" size="lg" disabled={status === "sending"} className="w-full">
        {status === "sending" ? (
          <>
            <span className="leaf-spinner" aria-hidden />
            Sending
          </>
        ) : (
          <span className="arrow-link">{cta}</span>
        )}
      </Button>
    </form>
  );
}
