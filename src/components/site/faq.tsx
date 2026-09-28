"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Pages that render this also emit FAQPage JSON-LD via faqLd() on the
// server, so the markup lives next to the content it describes.
export function Faq({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <Accordion type="single" collapsible className={cn("divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-soft sm:px-7", className)}>
      {items.map((faq, i) => (
        <AccordionItem key={faq.q} value={`item-${i}`} className="border-0">
          <AccordionTrigger className="py-5 text-base font-semibold sm:text-[17px]">{faq.q}</AccordionTrigger>
          <AccordionContent className="measure pb-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
