// Every business detail on the site comes from this file. To rebrand the
// template for a new company, edit this file plus the content modules in
// src/content/, swap the photos in public/images/, and rebuild.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const site = {
  name: "Green Leaf Lawn Care",
  shortName: "Green Leaf",
  legalName: "Green Leaf Lawn Care, LLC",
  tagline: "Residential lawn care, done right the first time.",
  description:
    "Residential lawn care for Maple Grove and the northwest Twin Cities. Weekly mowing, fertilization, aeration, and seasonal cleanup with upfront pricing and the same crew every visit.",

  // Public URL of the deployed site, without a trailing slash. Set
  // NEXT_PUBLIC_SITE_URL at build time when moving to a custom domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    `https://alectronic-solutions.github.io${basePath}`,
  basePath,

  phone: {
    display: "(763) 555-0142",
    e164: "+17635550142",
  },
  email: "hello@greenleaflawncare.com",
  address: {
    street: "1482 Oak Ridge Avenue",
    city: "Maple Grove",
    region: "MN",
    postalCode: "55369",
    country: "US",
  },
  geo: { lat: 45.0725, lng: -93.4555 },
  region: "the northwest Twin Cities",
  hours: [
    { days: "Mon to Fri", schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "18:00", label: "7am to 6pm" },
    { days: "Saturday", schemaDays: ["Saturday"], opens: "08:00", closes: "16:00", label: "8am to 4pm" },
    { days: "Sunday", schemaDays: [], opens: null, closes: null, label: "Closed" },
  ],
  foundedYear: 2014,
  license: "MN Lic. #LC-2024-1482",
  priceRange: "$$",

  social: {
    google: "https://g.page/r/greenleaflawncare-maplegrovemn",
    facebook: "https://facebook.com/greenleaflawncare",
    instagram: "https://instagram.com/greenleaflawncare",
  },

  // Rating shown on the site. Only turn on `showInSchema` once these are
  // real numbers pulled from the Google Business Profile: Google treats
  // self-served review markup on a LocalBusiness as spam.
  rating: { value: 4.9, count: 187, showInSchema: false },

  stats: {
    lawns: "1,800+",
    years: new Date().getFullYear() - 2014,
  },

  // Quote and contact forms post here. Works with Web3Forms
  // (https://web3forms.com, set the access key) or any endpoint that
  // accepts a JSON POST, such as Formspree. Leave the endpoint empty to run
  // the forms in demo mode.
  forms: {
    endpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
    accessKey: process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "",
  },
  demoMode: !process.env.NEXT_PUBLIC_FORM_ENDPOINT,

  analytics: {
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  },

  offers: {
    firstVisitPct: 10,
    // Earned by clearing the mowing game. Mention it in the quote form and
    // honor it when a lead comes in with the code.
    gamePromo: { code: "STRIPES10", pct: 10 },
  },

  effects: {
    leafTrail: true,
  },

  builtBy: { name: "Alectronic Solutions", url: "https://alectronicsolutions.com" },
} as const;

export const phoneHref = `tel:${site.phone.e164}`;
export const smsHref = `sms:${site.phone.e164}`;
export const mailHref = `mailto:${site.email}`;
export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

/** Absolute URL for a site path, for canonical tags, sitemaps and JSON-LD. */
export function absoluteUrl(path = "/") {
  if (path === "/" || path === "") return site.url;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
