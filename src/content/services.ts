import type { Icon3DName } from "@/components/site/icon-3d";

export type Season = "spring" | "summer" | "fall" | "winter";

export type PriceUnit = "visit" | "treatment" | "flat";

export type Service = {
  slug: string;
  name: string;
  /** Short label for menus and the quote form's summary line. */
  short: string;
  icon: Icon3DName;
  image: string;
  imageAlt: string;
  price: { from: number; unit: PriceUnit };
  seasons: Season[];
  summary: string;
  intro: string[];
  included: string[];
  process: { title: string; desc: string }[];
  pricingFactors: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const unitLabel: Record<PriceUnit, string> = {
  visit: "/ visit",
  treatment: "/ treatment",
  flat: "flat",
};

export function formatFrom(s: Pick<Service, "price">) {
  return `$${s.price.from} ${unitLabel[s.price.unit]}`;
}

export const services: Service[] = [
  {
    slug: "lawn-mowing",
    name: "Lawn Mowing & Edging",
    short: "Lawn mowing",
    icon: "tractor",
    image: "/images/gallery-2.webp",
    imageAlt: "A freshly mowed front lawn with crisp edging along the sidewalk",
    price: { from: 45, unit: "visit" },
    seasons: ["spring", "summer", "fall"],
    summary:
      "Weekly or bi-weekly mowing at the right height for the weather, with edging and cleanup on every visit.",
    intro: [
      "Most lawns in the northwest metro are Kentucky bluegrass blends that do best at 3 to 3.5 inches. Cut them shorter and they burn out in July. Cut them longer and they mat down and invite disease.",
      "Our crews set the deck for your grass and the week's weather, edge every hard surface, and blow the clippings off your drive and walks before they leave. Same crew, same day, every week.",
    ],
    included: [
      "Mowing at 3 to 3.5 inches, adjusted for heat and drought",
      "String trimming around beds, trees, fences and play sets",
      "Hard edging along driveways, walks and curbs",
      "Clippings blown clear of every hard surface",
      "Mowing direction rotated each visit so the turf stands upright",
      "A text when the crew is on the way and when they finish",
    ],
    process: [
      { title: "Walk the property", desc: "On the first visit the crew lead notes gates, pets, sprinkler heads and any soft spots to avoid." },
      { title: "Set the schedule", desc: "You get a fixed day of the week. Rain delays roll to the next dry day, never skipped." },
      { title: "Mow, trim, edge, clean", desc: "The same two-person crew handles every step, so nothing gets missed between handoffs." },
    ],
    pricingFactors: [
      "Lot size and how much of it is turf",
      "Slopes, fences and obstacles that need hand trimming",
      "Visit frequency: weekly saves 10%, bi-weekly saves 5%",
    ],
    faqs: [
      { q: "Do you bag clippings?", a: "Not by default. Mulched clippings return nitrogen to the soil. We bag on request, or on the first cut of spring when the grass is long." },
      { q: "What happens when it rains?", a: "We move your visit to the next dry day. Mowing wet turf tears the blades and ruts the soil, so we will not do it." },
      { q: "When does mowing season start and end?", a: "Usually late April through the end of October, depending on the spring thaw and the first hard frost." },
    ],
    related: ["fertilization", "aeration-overseeding", "spring-cleanup"],
  },
  {
    slug: "fertilization",
    name: "Fertilization & Weed Control",
    short: "Fertilization",
    icon: "seedling",
    image: "/images/hero.webp",
    imageAlt: "A thick, evenly green front lawn on a fertilization program",
    price: { from: 65, unit: "treatment" },
    seasons: ["spring", "summer", "fall"],
    summary:
      "A five-step feeding and weed control program timed to Minnesota's growing season.",
    intro: [
      "Minnesota lawns have a short window to grow, so timing matters more than product. Our program starts with pre-emergent crabgrass control in early spring and ends with a winterizer that feeds the roots through the freeze.",
      "Every application is made by a licensed applicator, with re-entry times on your visit text so kids and pets can get back on the grass when it is safe.",
    ],
    included: [
      "Early spring: slow-release feed plus crabgrass pre-emergent",
      "Late spring: feed plus spot treatment for dandelions and clover",
      "Summer: heat-safe feed that holds color without stressing roots",
      "Early fall: recovery feed ahead of aeration and seeding",
      "Late fall: winterizer for an early green-up next spring",
      "Free service calls between treatments if weeds come back",
    ],
    process: [
      { title: "Soil and turf check", desc: "We look at color, density and weed pressure, and note shade and slope areas that need a different rate." },
      { title: "Scheduled treatments", desc: "Five visits across the season, each timed to soil temperature, not a fixed calendar date." },
      { title: "Follow-up", desc: "If weeds are still there ten days after a treatment, we come back and spot treat at no charge." },
    ],
    pricingFactors: [
      "Square footage of turf, measured on the first visit",
      "Full program or individual treatments",
      "Add-ons such as grub control or iron for extra color",
    ],
    faqs: [
      { q: "Is it safe for kids and pets?", a: "Yes, once the product has dried, usually about an hour. We text you the re-entry time after every visit." },
      { q: "Do you follow Minnesota phosphorus rules?", a: "Yes. Our standard blends are phosphorus-free as state law requires. Phosphorus is only used on new seed or when a soil test shows a deficiency." },
      { q: "Can I buy a single treatment?", a: "Yes. Most customers take the full program because the timing builds on itself, but single treatments are available." },
    ],
    related: ["aeration-overseeding", "lawn-mowing", "spring-cleanup"],
  },
  {
    slug: "aeration-overseeding",
    name: "Aeration & Overseeding",
    short: "Aeration and overseeding",
    icon: "herb",
    image: "/images/transformation-after.webp",
    imageAlt: "A thick, even lawn six weeks after core aeration and overseeding",
    price: { from: 180, unit: "flat" },
    seasons: ["spring", "fall"],
    summary:
      "Core aeration to relieve compacted soil, paired with Kentucky bluegrass seed for a thicker lawn.",
    intro: [
      "Clay-heavy soil across the metro packs down under foot traffic and snow load. Roots cannot get air or water, and the lawn thins out no matter how much you feed it.",
      "Core aeration pulls thousands of small plugs to open the soil back up. We overseed right behind it, so new seed lands in the holes where it has the best chance to root. Late August through September is the best window.",
    ],
    included: [
      "Sprinkler heads and utilities flagged before we start",
      "Two-direction core aeration across all turf areas",
      "Premium Kentucky bluegrass and perennial rye seed blend",
      "Starter fertilizer to push new root growth",
      "Written watering instructions for the first three weeks",
    ],
    process: [
      { title: "Mark the property", desc: "We flag sprinkler heads, shallow lines and invisible dog fences so nothing gets damaged." },
      { title: "Aerate and seed", desc: "Two passes with a core aerator, then seed and starter fertilizer on the same visit." },
      { title: "Water and watch", desc: "You water lightly every day for two to three weeks. We check germination on the next visit." },
    ],
    pricingFactors: [
      "Lot size",
      "Seed rate: overseeding thin areas or a full renovation",
      "Whether aeration is added to an existing program",
    ],
    faqs: [
      { q: "Should I aerate in spring or fall?", a: "Fall is best. The soil is warm, the air is cool, and weeds are slowing down, so new seed does not have to compete. Spring aeration works if you skip the crabgrass pre-emergent." },
      { q: "What do I do with the plugs?", a: "Leave them. They break down in one to two weeks and return soil and microbes to the surface." },
      { q: "How often should I aerate?", a: "Once a year for most clay-soil lawns. Sandy lawns in the northern suburbs can go every other year." },
    ],
    related: ["fertilization", "lawn-mowing", "leaf-removal"],
  },
  {
    slug: "leaf-removal",
    name: "Fall Leaf Removal",
    short: "Leaf removal",
    icon: "fallen-leaf",
    image: "/images/fall.webp",
    imageAlt: "A residential yard during fall leaf cleanup",
    price: { from: 90, unit: "visit" },
    seasons: ["fall"],
    summary:
      "Full-property leaf cleanup with hauling, scheduled around when your trees actually drop.",
    intro: [
      "A thick layer of wet leaves over winter smothers the grass and invites snow mold. The lawn comes out of spring matted and patchy.",
      "We time cleanups to your trees, not a fixed calendar. Oaks hold their leaves weeks after maples, so most properties need two visits: one mid-October and a final pass after the last drop.",
    ],
    included: [
      "Leaves cleared from turf, beds, and along fences",
      "Gutter-line and window-well cleanout on request",
      "Leaves hauled away and composted",
      "Final mow at a lower height to prevent snow mold",
    ],
    process: [
      { title: "Schedule by tree type", desc: "We note which trees you have and plan visits around when they actually drop." },
      { title: "Blow, rake, and vacuum", desc: "Backpack blowers and a truck vacuum pick up everything, including leaves packed into beds." },
      { title: "Haul and compost", desc: "Nothing is left at the curb. Leaves go to a local compost site." },
    ],
    pricingFactors: [
      "Lot size and number of mature trees",
      "Number of visits in the season",
      "Bed and gutter cleanout add-ons",
    ],
    faqs: [
      { q: "Can you mulch the leaves into the lawn instead?", a: "Yes, for light leaf cover. Mulching a thin layer feeds the soil. Heavy cover has to be removed." },
      { q: "When should I book?", a: "Book by mid-September. October slots fill fast." },
    ],
    related: ["aeration-overseeding", "lawn-mowing", "snow-removal"],
  },
  {
    slug: "spring-cleanup",
    name: "Spring Cleanup",
    short: "Spring cleanup",
    icon: "broom",
    image: "/images/gallery-1.webp",
    imageAlt: "A landscaped backyard with clean beds and green turf after spring cleanup",
    price: { from: 120, unit: "flat" },
    seasons: ["spring"],
    summary:
      "Debris removal, bed edging, snow mold raking, and the first cut of the season in one visit.",
    intro: [
      "When the snow melts, most lawns come out matted, littered with branches, and streaked with snow mold. A thorough cleanup lets sunlight and air reach the crown of the grass so it greens up weeks sooner.",
      "We do it all in one visit and finish with the first mow, so your lawn goes into the season clean and even.",
    ],
    included: [
      "Branches, sticks and winter debris cleared and hauled",
      "Light raking of matted turf and snow mold patches",
      "Beds cleaned out and re-edged with a crisp line",
      "Perennials and ornamental grasses cut back",
      "The first cut of the season",
    ],
    process: [
      { title: "Assess winter damage", desc: "We flag snow mold, vole trails and plow damage, and tell you what needs seed." },
      { title: "Clean and edge", desc: "Debris out, beds edged, perennials cut back, everything hauled away." },
      { title: "First mow", desc: "A clean first cut that sets the height for the season." },
    ],
    pricingFactors: [
      "Lot size and amount of debris",
      "Number and size of beds",
      "Haul-away volume",
    ],
    faqs: [
      { q: "When do spring cleanups start?", a: "As soon as the ground is firm, usually early to mid April. Working on soggy ground does more harm than good." },
      { q: "Do you fix vole damage?", a: "We rake out the trails and overseed the worst of them. Most light vole damage fills in on its own by June." },
    ],
    related: ["lawn-mowing", "fertilization", "aeration-overseeding"],
  },
  {
    slug: "snow-removal",
    name: "Snow Removal",
    short: "Snow removal",
    icon: "snowflake",
    image: "/images/winter.webp",
    imageAlt: "A cleared residential driveway and walkway after snowfall",
    price: { from: 60, unit: "visit" },
    seasons: ["winter"],
    summary:
      "Driveway and walkway clearing after every two-inch snowfall, with salting included.",
    intro: [
      "Seasonal customers get priority routing, so we are usually on your drive before you leave for work. Per-visit customers are served in the order they call.",
      "We clear to pavement, not just scrape the top, and treat walks and steps with ice melt on every visit.",
    ],
    included: [
      "Driveway plowed or blown to pavement",
      "Front walk, steps and stoop shoveled",
      "Ice melt on walks and steps",
      "Automatic service at two inches of snow, no call needed",
      "End-of-driveway windrow cleared after the city plow passes",
    ],
    process: [
      { title: "Map the property", desc: "We stake the drive edges before the ground freezes so nothing gets gouged." },
      { title: "Auto-dispatch", desc: "Crews roll out at two inches. You get a text when your property is done." },
      { title: "Clean up", desc: "In spring we repair any turf the plow scuffed, free of charge." },
    ],
    pricingFactors: [
      "Driveway length and width",
      "Seasonal contract or per visit",
      "Walks, patios and extra doors",
    ],
    faqs: [
      { q: "What is the trigger depth?", a: "Two inches. Seasonal customers are cleared automatically. Per-visit customers can request service at any depth." },
      { q: "Do you do roofs?", a: "We rake roof edges to prevent ice dams, as an add-on for seasonal customers." },
    ],
    related: ["leaf-removal", "spring-cleanup", "lawn-mowing"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

// The four-season calendar on /services. Each row links to the service page
// that covers it.
export const seasons: {
  key: Season;
  label: string;
  months: string;
  icon: Icon3DName;
  image: string;
  blurb: string;
  items: { name: string; desc: string; from: string; service: string }[];
}[] = [
  {
    key: "spring",
    label: "Spring",
    months: "Mar to May",
    icon: "seedling",
    image: "/images/grass-texture.webp",
    blurb: "Snow mold cleanup, first feed, and soil prep to bring the lawn out of dormancy.",
    items: [
      { name: "Spring Cleanup", desc: "Debris out, beds edged, and the first cut of the season.", from: "$120", service: "spring-cleanup" },
      { name: "Crabgrass Pre-Emergent", desc: "Applied with the first feeding to stop crabgrass before it sprouts.", from: "$65", service: "fertilization" },
      { name: "Spring Aeration", desc: "Relieves winter compaction. Best paired with a seed-safe feed.", from: "$180", service: "aeration-overseeding" },
      { name: "Weekly Mowing Starts", desc: "Usually late April, once the grass is actively growing.", from: "$45 / visit", service: "lawn-mowing" },
    ],
  },
  {
    key: "summer",
    label: "Summer",
    months: "Jun to Aug",
    icon: "sun",
    image: "/images/summer.webp",
    blurb: "Mowing at the right height, heat-safe feeding, and targeted weed control.",
    items: [
      { name: "Weekly Mowing & Edging", desc: "Raised to 3.5 inches in July heat so the turf stays green.", from: "$45 / visit", service: "lawn-mowing" },
      { name: "Summer Feeding", desc: "A slow, heat-safe formula that holds color without burning.", from: "$65", service: "fertilization" },
      { name: "Grub Prevention", desc: "Stops Japanese beetle grubs before they eat the roots.", from: "$75", service: "fertilization" },
      { name: "Spot Weed Control", desc: "Dandelions, clover and creeping Charlie. No blanket spraying.", from: "$55", service: "fertilization" },
    ],
  },
  {
    key: "fall",
    label: "Fall",
    months: "Sep to Nov",
    icon: "fallen-leaf",
    image: "/images/fall.webp",
    blurb: "The season that decides next year's lawn. Aeration, seed, and a winterizer.",
    items: [
      { name: "Aeration & Overseeding", desc: "The single best thing you can do for a thicker lawn next year.", from: "$180", service: "aeration-overseeding" },
      { name: "Leaf Removal", desc: "Timed to your trees, with hauling included.", from: "$90 / visit", service: "leaf-removal" },
      { name: "Winterizer", desc: "Late feeding that stores energy in the roots for early green-up.", from: "$70", service: "fertilization" },
      { name: "Final Cut-Down", desc: "A shorter last mow to prevent snow mold and vole damage.", from: "$50", service: "lawn-mowing" },
    ],
  },
  {
    key: "winter",
    label: "Winter",
    months: "Dec to Feb",
    icon: "snowflake",
    image: "/images/winter.webp",
    blurb: "Driveways and walks cleared after every two-inch snowfall, with ice melt included.",
    items: [
      { name: "Driveway & Walk Clearing", desc: "Cleared to pavement after every two inches.", from: "$60 / visit", service: "snow-removal" },
      { name: "Seasonal Snow Contract", desc: "Unlimited visits with priority routing.", from: "$650 / season", service: "snow-removal" },
      { name: "Ice Melt", desc: "Walks, steps and stoops treated on every visit.", from: "$35 / visit", service: "snow-removal" },
      { name: "Roof Edge Raking", desc: "Keeps ice dams from forming along the gutters.", from: "$150", service: "snow-removal" },
    ],
  },
];
