// Placeholder reviews for the demo. Replace these with real reviews copied
// from the business's Google profile (with the customer's first name and
// last initial only).
export type Review = {
  name: string;
  city: string; // city slug
  service: string; // service slug
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // ISO date
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Sarah M.",
    city: "maple-grove",
    service: "lawn-mowing",
    rating: 5,
    date: "2026-09-08",
    text: "Green Leaf took over our lawn last spring after we fired the big national company. The difference is obvious. Same crew every week, they actually edge, and the price didn't go up after the first month. Wish we'd switched sooner.",
  },
  {
    name: "Mike R.",
    city: "plymouth",
    service: "aeration-overseeding",
    rating: 5,
    date: "2026-08-21",
    text: "I got a quote in under a minute and they were out the same week. The fall aeration made a real difference this spring, way fewer bare spots.",
  },
  {
    name: "Jennifer K.",
    city: "brooklyn-park",
    service: "fertilization",
    rating: 5,
    date: "2026-08-14",
    text: "Honest crew. They told me I didn't need the full program, just aeration and a winterizer. Saved me money and the lawn looks better than ever.",
  },
  {
    name: "David L.",
    city: "osseo",
    service: "spring-cleanup",
    rating: 5,
    date: "2026-07-02",
    text: "Called Monday for a spring cleanup. They came Wednesday. The yard hadn't been touched since fall and they had it looking good in an afternoon.",
  },
  {
    name: "Rachel T.",
    city: "champlin",
    service: "lawn-mowing",
    rating: 5,
    date: "2026-06-19",
    text: "We have a corner lot with a lot of edging and it always looks razor sharp. Every other service we tried left the sidewalk a mess. These guys don't.",
  },
  {
    name: "Tom W.",
    city: "dayton",
    service: "snow-removal",
    rating: 5,
    date: "2026-02-11",
    text: "Signed up for the seasonal snow contract in October and they had the drive cleared before I was up after the first big storm. Never had to call once.",
  },
  {
    name: "Priya S.",
    city: "maple-grove",
    service: "fertilization",
    rating: 5,
    date: "2026-06-03",
    text: "The dandelions were back ten days after the second treatment. I texted a photo and they came out two days later to spot spray at no charge. That's the kind of follow-up I was paying for.",
  },
  {
    name: "Greg H.",
    city: "new-hope",
    service: "leaf-removal",
    rating: 5,
    date: "2025-11-14",
    text: "Two big oaks and a maple. They came once in October and again after the oaks finally dropped. Nothing left in the beds, nothing at the curb.",
  },
  {
    name: "Alicia F.",
    city: "crystal",
    service: "aeration-overseeding",
    rating: 4,
    date: "2025-10-02",
    text: "Our back yard used to hold water every spring. Two falls of aeration and it drains now. Took a little longer to fill in than I hoped, but they were upfront that it would.",
  },
  {
    name: "Ben C.",
    city: "brooklyn-center",
    service: "lawn-mowing",
    rating: 5,
    date: "2025-09-12",
    text: "They raised our mowing height in July and the lawn stayed green all summer for the first time in years. Small thing, big difference.",
  },
];

export function formatReviewDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
