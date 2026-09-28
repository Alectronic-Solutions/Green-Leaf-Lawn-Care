export type Faq = { q: string; a: string; topic: FaqTopic; featured?: boolean };

export type FaqTopic = "Getting started" | "Visits and scheduling" | "Products and safety" | "Billing and policies";

export const faqTopics: FaqTopic[] = [
  "Getting started",
  "Visits and scheduling",
  "Products and safety",
  "Billing and policies",
];

export const faqs: Faq[] = [
  {
    topic: "Getting started",
    featured: true,
    q: "Which areas do you serve?",
    a: "Maple Grove, Plymouth, Brooklyn Park, Osseo, Champlin, Dayton, Brooklyn Center, New Hope, and Crystal. If you are just outside those cities, call us. We add neighborhoods as crews expand.",
  },
  {
    topic: "Getting started",
    featured: true,
    q: "How quickly can you start?",
    a: "Usually within the same week. During peak spring weeks it can stretch to 7 to 10 days. We tell you the exact start date before you commit to anything.",
  },
  {
    topic: "Getting started",
    q: "Is the online estimate the final price?",
    a: "It is a typical price for a lawn like yours. A crew lead confirms it on site before the first visit. If anything changes the price, you hear it before we start, never on the invoice.",
  },
  {
    topic: "Visits and scheduling",
    featured: true,
    q: "Do I need to be home during service?",
    a: "No. Most of our customers are not home during the day. As long as we can reach the lawn and any gates are unlocked, we handle the rest. You get a text when the work is done.",
  },
  {
    topic: "Visits and scheduling",
    q: "What is included in a mowing visit?",
    a: "Mowing at the right height for your grass and the weather, trimming, edging along all walks and drives, and blowing off every hard surface. We rotate the mowing pattern each visit so the grass grows upright.",
  },
  {
    topic: "Visits and scheduling",
    q: "What happens when it rains on my service day?",
    a: "We move your visit to the next dry day and text you the new time. Mowing wet turf tears the grass and ruts the soil.",
  },
  {
    topic: "Products and safety",
    featured: true,
    q: "Are you licensed and insured?",
    a: "Yes. We carry general liability insurance and are licensed for fertilizer and herbicide application in Minnesota. We can send a certificate of insurance to your HOA or property manager on request.",
  },
  {
    topic: "Products and safety",
    q: "Are your treatments safe for kids and pets?",
    a: "Yes, once the product has dried, usually within an hour. We text the re-entry time after every treatment and can use organic-based products on request.",
  },
  {
    topic: "Billing and policies",
    q: "What if I am not happy with a visit?",
    a: "Call or text us within 48 hours. The crew comes back and fixes it at no charge.",
  },
  {
    topic: "Billing and policies",
    featured: true,
    q: "Can I pause or cancel service?",
    a: "Yes. There are no contracts. Give us 48 hours' notice before your next visit and you can pause for a week, skip a month, or cancel entirely. No fees.",
  },
  {
    topic: "Billing and policies",
    q: "How does billing work?",
    a: "You choose per-visit billing or a single monthly invoice. Most customers keep a card on file for automatic billing. You get an itemized receipt by email after every visit.",
  },
];
