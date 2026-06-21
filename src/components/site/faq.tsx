"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Which areas do you serve?",
    a: "Green Leaf Lawn Care proudly serves Maple Grove, Plymouth, Brooklyn Park, Osseo, Champlin, Dayton and surrounding communities in the northwest Twin Cities metro. Not sure if you're in our zone? Enter your address in the quote form or call us — we'll let you know right away.",
  },
  {
    q: "How quickly can you start service?",
    a: "For most new customers, we can schedule your first visit within 3–5 business days. Same-week starts are common during spring and summer. If you have an urgent need (a big event, overgrown lawn, or storm cleanup), let us know and we'll do everything we can to fit you in fast.",
  },
  {
    q: "Do I need to be home for service?",
    a: "Nope! The vast majority of our customers are at work while we service their lawn. As long as we can access the yard and any gates are unlocked, we'll handle the rest. We'll send you a text or email notification when the job is done.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. Green Leaf Lawn Care is fully licensed in the state of Minnesota and carries comprehensive liability insurance. Our technicians are trained, background-checked, and certified for fertilizer and weed-control applications.",
  },
  {
    q: "What's included in a standard mowing visit?",
    a: "Every mowing visit includes: mowing at the ideal height for your grass type and current weather, precision edging along sidewalks, driveways and beds, and blowing of all hard surfaces so your property looks immaculate. We alternate mowing patterns to prevent compaction and promote upright growth.",
  },
  {
    q: "Do you offer a satisfaction guarantee?",
    a: "Absolutely. If you're not 100% happy with any visit, let us know within 48 hours and we'll come back to make it right — free of charge. Your satisfaction is the only way we keep your business, and we take that seriously.",
  },
  {
    q: "Can I pause or cancel service anytime?",
    a: "Yes. We don't lock you into long-term contracts. Weekly and bi-weekly plans are month-to-month — just give us 48 hours' notice before your next scheduled visit to pause, skip, or cancel. No fees, no hassle.",
  },
  {
    q: "How do payments work?",
    a: "We keep it simple: we'll securely store your card on file and bill automatically after each visit, or send a monthly invoice — your choice. You'll get an itemized receipt by email. We accept all major credit and debit cards.",
  },
];

export function Faq() {
  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-2 sm:p-4 shadow-sm"
    >
      {FAQS.map((faq, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-b border-border last:border-0 px-2 sm:px-4"
        >
          <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
