import type { Icon3DName } from "@/components/site/icon-3d";

// About-page and homepage content that describes the company itself.

export const features: { title: string; desc: string; icon: Icon3DName }[] = [
  {
    title: "Licensed and insured",
    desc: "Licensed for fertilizer and herbicide application in Minnesota. Certificate of insurance on request.",
    icon: "shield",
  },
  {
    title: "Re-do guarantee",
    desc: "If a visit is not right, the crew comes back within 48 hours and fixes it. No charge, no pushback.",
    icon: "repeat",
  },
  {
    title: "Pet and family safe",
    desc: "Products with short re-entry times, texted to you after every treatment.",
    icon: "paw",
  },
  {
    title: "Local crews",
    desc: "Based in Maple Grove. Our crews know the soil, the grass, and the weather here.",
    icon: "pin",
  },
  {
    title: "Same crew, same day",
    desc: "The same two-person crew on the same day each week. They learn your property.",
    icon: "calendar",
  },
  {
    title: "Upfront pricing",
    desc: "Your quote is your price. No fuel surcharges, no surprise fees on the invoice.",
    icon: "receipt",
  },
];

export const steps: { title: string; desc: string; icon: Icon3DName }[] = [
  {
    title: "Tell us about your lawn",
    desc: "Answer a few questions and see your estimated price right away. No waiting for a callback.",
    icon: "memo",
  },
  {
    title: "We confirm on site",
    desc: "A crew lead stops by to verify the estimate and note gate codes, pets and problem areas.",
    icon: "handshake",
  },
  {
    title: "Service begins",
    desc: "Same crew, same day, every week. You get a text when we are on the way and when we are done.",
    icon: "tractor",
  },
];

// Placeholder team. Swap in the real crew, ideally with photos in
// public/images/team/ and an `image` field.
export const team: { name: string; role: string; bio: string; icon: Icon3DName }[] = [
  {
    name: "Chris Lindqvist",
    role: "Founder and owner",
    bio: "Started Green Leaf in 2014 with one truck and a push mower. Still walks every new property before the first visit.",
    icon: "seedling",
  },
  {
    name: "Maria Alvarez",
    role: "Licensed applicator",
    bio: "Runs the fertilization and weed control program. Minnesota Department of Agriculture licensed since 2017.",
    icon: "herb",
  },
  {
    name: "Jake Thompson",
    role: "Crew lead, Maple Grove routes",
    bio: "Seven seasons with Green Leaf. Knows which Arbor Lakes gates stick and which dogs want a treat.",
    icon: "tractor",
  },
  {
    name: "Dana Whitfield",
    role: "Office and scheduling",
    bio: "The voice on the phone. Handles quotes, schedules and every question in between.",
    icon: "phone",
  },
];

export const values: { title: string; desc: string }[] = [
  {
    title: "Tell the truth about the lawn",
    desc: "If you do not need a treatment, we say so. Recommending less is how we keep customers for a decade.",
  },
  {
    title: "Show up when we said we would",
    desc: "A fixed day, a text on the way, and a text when we finish. Reliability is the product.",
  },
  {
    title: "Leave it cleaner than we found it",
    desc: "Clippings off the drive, gates latched, and no ruts in the turf.",
  },
];

export const gallery: {
  title: string;
  city: string;
  services: string[];
  summary: string;
  before?: string;
  after: string;
  alt: string;
}[] = [
  {
    title: "Thin lawn to thick turf in six weeks",
    city: "maple-grove",
    services: ["aeration-overseeding", "fertilization", "lawn-mowing"],
    summary: "Core aeration with Kentucky bluegrass overseed, a five-step feeding program, and weekly mowing at 3.5 inches.",
    before: "/images/transformation-before.webp",
    after: "/images/transformation-after.webp",
    alt: "A Maple Grove lawn before and after six weeks of care",
  },
  {
    title: "Crisp edges on a corner lot",
    city: "champlin",
    services: ["lawn-mowing"],
    summary: "Weekly mowing with hard edging along 300 feet of sidewalk and drive.",
    after: "/images/gallery-2.webp",
    alt: "A manicured front yard with crisp edging along the sidewalk",
  },
  {
    title: "Backyard spring reset",
    city: "plymouth",
    services: ["spring-cleanup"],
    summary: "Winter debris hauled, beds re-edged, perennials cut back, and the first cut of the season.",
    after: "/images/gallery-1.webp",
    alt: "A landscaped backyard with green grass and trimmed beds",
  },
  {
    title: "Peak-summer color",
    city: "brooklyn-park",
    services: ["fertilization", "lawn-mowing"],
    summary: "Heat-safe summer feeding and a raised cut height kept this lawn green through a dry July.",
    after: "/images/summer.webp",
    alt: "A thick, healthy lawn during peak summer",
  },
  {
    title: "Two-pass fall cleanup",
    city: "new-hope",
    services: ["leaf-removal"],
    summary: "One visit in mid-October, a final pass after the oaks dropped, and a lower last cut.",
    after: "/images/fall.webp",
    alt: "A residential yard during fall leaf cleanup",
  },
  {
    title: "First green-up of the season",
    city: "osseo",
    services: ["fertilization"],
    summary: "Early spring feed with crabgrass pre-emergent, applied as soon as soil hit 55 degrees.",
    after: "/images/hero.webp",
    alt: "A striped, deep green front lawn after the first fertilization",
  },
];
