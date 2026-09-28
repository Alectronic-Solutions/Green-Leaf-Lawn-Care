export type City = {
  slug: string;
  name: string;
  county: string;
  zips: string[];
  neighborhoods: string[];
  /** One or two sentences that make the page specific to this city. */
  local: string[];
  lawnNote: string;
  nearby: string[];
  geo: { lat: number; lng: number };
  /** Home base gets "based in" copy instead of "serving". */
  home?: boolean;
};

export const cities: City[] = [
  {
    slug: "maple-grove",
    geo: { lat: 45.0725, lng: -93.4558 },
    name: "Maple Grove",
    county: "Hennepin County",
    zips: ["55311", "55369"],
    neighborhoods: ["Arbor Lakes", "Weaver Lake", "Fish Lake", "Rice Lake", "Elm Creek"],
    local: [
      "Maple Grove is home base. Our shop is on Oak Ridge Avenue, so most Maple Grove routes are the first stop of the day.",
      "Many neighborhoods here were built in the 1990s and 2000s on graded clay with a thin layer of topsoil. That combination compacts fast and dries out in July, which is why aeration makes such a visible difference in this city.",
    ],
    lawnNote: "Clay subsoil, thin topsoil, lots of HOA edging standards.",
    nearby: ["plymouth", "osseo", "dayton", "brooklyn-park"],
    home: true,
  },
  {
    slug: "plymouth",
    geo: { lat: 45.0105, lng: -93.4555 },
    name: "Plymouth",
    county: "Hennepin County",
    zips: ["55441", "55442", "55446", "55447"],
    neighborhoods: ["Parkers Lake", "Medicine Lake", "Bass Lake", "Wayzata Heights"],
    local: [
      "Plymouth lots tend to be larger, with mature trees, steep lakeside slopes, and irrigation systems. Our crews trim slopes by hand and flag every sprinkler head before aerating.",
      "Heavy shade from mature oaks means a lot of Plymouth lawns need a fine fescue blend overseeded into the bluegrass.",
    ],
    lawnNote: "Mature trees and shade, slopes, irrigation systems.",
    nearby: ["maple-grove", "new-hope", "crystal"],
  },
  {
    slug: "brooklyn-park",
    geo: { lat: 45.0941, lng: -93.3563 },
    name: "Brooklyn Park",
    county: "Hennepin County",
    zips: ["55428", "55443", "55444", "55445"],
    neighborhoods: ["Edinburgh", "Oxbow Creek", "Riverview", "Northwood"],
    local: [
      "Brooklyn Park runs from older ramblers in the south to newer developments along the river. Soils shift from clay to sandy loam as you head north, and so does how often a lawn needs watering and feeding.",
      "Sandier northern lots burn out first in a dry July, so we raise the mowing height early and lean on slow-release feed there.",
    ],
    lawnNote: "Mixed clay and sand, heat stress in July.",
    nearby: ["maple-grove", "brooklyn-center", "champlin", "osseo"],
  },
  {
    slug: "osseo",
    geo: { lat: 45.1194, lng: -93.4025 },
    name: "Osseo",
    county: "Hennepin County",
    zips: ["55369"],
    neighborhoods: ["Downtown Osseo", "Boundary Creek"],
    local: [
      "Osseo is small and walkable, with tight city lots, alleys, and a lot of older boulevard trees. We run compact mowers here so we can fit through narrow side yards and gates.",
      "Boulevard strips along the street take the brunt of winter salt. We seed them with a salt-tolerant blend each fall.",
    ],
    lawnNote: "Small lots, narrow gates, salt-damaged boulevards.",
    nearby: ["maple-grove", "brooklyn-park"],
  },
  {
    slug: "champlin",
    geo: { lat: 45.1889, lng: -93.3975 },
    name: "Champlin",
    county: "Hennepin County",
    zips: ["55316"],
    neighborhoods: ["Elm Creek", "Mississippi Point", "Oxbow"],
    local: [
      "Champlin sits along the Mississippi on the Anoka sand plain. The soil drains fast, which is good in a wet spring and hard on grass in August.",
      "We schedule Champlin fertilization with lighter, more frequent feeding so nutrients do not wash straight through the sandy soil.",
    ],
    lawnNote: "Sandy, fast-draining soil and river-bluff slopes.",
    nearby: ["dayton", "brooklyn-park", "maple-grove"],
  },
  {
    slug: "dayton",
    geo: { lat: 45.2436, lng: -93.515 },
    name: "Dayton",
    county: "Hennepin County",
    zips: ["55327"],
    neighborhoods: ["Brayburn Trails", "Sundance Greens", "Rush Creek"],
    local: [
      "Dayton is growing fast, with new construction lots where builders often laid sod over compacted fill. Those first few years decide whether the lawn roots in or peels up.",
      "New-build lawns in Dayton get an aeration and seed plan for the first two falls, plus a watering schedule that trains roots to go deep.",
    ],
    lawnNote: "New construction, sod over compacted fill.",
    nearby: ["maple-grove", "champlin"],
  },
  {
    slug: "brooklyn-center",
    geo: { lat: 45.0761, lng: -93.3327 },
    name: "Brooklyn Center",
    county: "Hennepin County",
    zips: ["55429", "55430"],
    neighborhoods: ["Palmer Lake", "Twin Lake", "Evergreen Park"],
    local: [
      "Brooklyn Center neighborhoods were mostly built in the 1950s and 60s, with mature trees and lawns that have been mowed short for decades.",
      "Raising the cut height and a steady fall overseeding program usually thickens these lawns within one season.",
    ],
    lawnNote: "Older lawns, mature trees, thin turf.",
    nearby: ["brooklyn-park", "crystal", "new-hope"],
  },
  {
    slug: "new-hope",
    geo: { lat: 45.038, lng: -93.3866 },
    name: "New Hope",
    county: "Hennepin County",
    zips: ["55427", "55428"],
    neighborhoods: ["Northwood Lake", "Meadow Lake", "Begin Oaks"],
    local: [
      "New Hope lots are compact and tree-lined, and many have steep front slopes down to the street. We hand-trim slopes that are unsafe for a mower.",
      "Creeping Charlie is the weed we see most here. It needs a fall treatment timed to the first frost to knock it back.",
    ],
    lawnNote: "Tree-lined lots, steep front slopes, creeping Charlie.",
    nearby: ["plymouth", "crystal", "brooklyn-center"],
  },
  {
    slug: "crystal",
    geo: { lat: 45.0327, lng: -93.3602 },
    name: "Crystal",
    county: "Hennepin County",
    zips: ["55422", "55427", "55428"],
    neighborhoods: ["Twin Oak", "Bassett Creek", "Crystal Lake"],
    local: [
      "Crystal is dense with post-war ramblers on tidy lots, many with detached garages and alley access. Alley access lets us service back yards without going through the house gate.",
      "A lot of Crystal lawns sit on heavy clay near Bassett Creek. Yearly aeration is the fix for standing water after spring rains.",
    ],
    lawnNote: "Heavy clay, alley access, standing water in spring.",
    nearby: ["new-hope", "brooklyn-center", "plymouth"],
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
