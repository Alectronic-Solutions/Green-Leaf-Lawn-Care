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
    a: "Maple Grove, Plymouth, Brooklyn Park, Osseo, Champlin, and Dayton. If you're just outside those borders, call us. We add neighborhoods as crews expand.",
  },
  {
    q: "How quickly can you start?",
    a: "Usually within the same week. During peak spring weeks it can stretch to 7 to 10 days. We tell you the exact start date before you commit to anything.",
  },
  {
    q: "Do I need to be home during service?",
    a: "No. Most of our customers aren't home during the day. As long as we can reach the lawn and any gates are unlocked, we handle the rest. You get a text when the work is done.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. We carry general liability insurance and we're licensed for fertilizer and herbicide application in Minnesota. We can send a certificate of insurance to your HOA or property manager on request.",
  },
  {
    q: "What's included in a mowing visit?",
    a: "Mowing at the right height for your grass type and the weather, edging along all sidewalks and drives, and blowing off every hard surface. We rotate the mowing pattern each visit so the grass grows upright and the soil doesn't compact.",
  },
  {
    q: "What if I'm not happy with a visit?",
    a: "Call or text us within 48 hours. The crew comes back and fixes it at no charge. We would rather fix it than lose you.",
  },
  {
    q: "Can I pause or cancel service?",
    a: "Yes. There are no contracts. Give us 48 hours' notice before your next scheduled visit and you can pause for a week, skip a month, or cancel entirely. No fees.",
  },
  {
    q: "How does billing work?",
    a: "You choose. We can bill per visit or send a monthly invoice. Most customers keep a card on file for automatic billing. You get an itemized receipt by email after every visit.",
  },
];

export function Faq() {
  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-2 sm:px-4 shadow-sm"
    >
      {FAQS.map((faq, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-b border-border last:border-0 px-3 sm:px-5"
        >
          <AccordionTrigger className="text-left text-[15px] font-semibold hover:no-underline">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
