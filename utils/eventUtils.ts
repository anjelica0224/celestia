// ─── HTML entity decoding ─────────────────────────────────────────────────────

export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&deg;/g, "°")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C");
}

// ─── iCal date parsing ───────────────────────────────────────────────────────

export function parseICalDate(dtstart: string): { date: string; time: string } {
  const y = dtstart.slice(0, 4);
  const m = dtstart.slice(4, 6);
  const d = dtstart.slice(6, 8);
  const hh = dtstart.slice(9, 11);
  const mm = dtstart.slice(11, 13);
  return {
    date: `${y}-${m}-${d}`,
    time: hh && mm ? `${hh}:${mm} UTC` : "Check local times",
  };
}

export function displayDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

// ─── Categorization ──────────────────────────────────────────────────────────

export function categorize(summary: string): {
  category: string;
  keywords: string;
} {
  const s = summary.toLowerCase();
  let category: string;

  if (s.includes("meteor shower")) category = "meteor_shower";
  else if (s.includes("total lunar eclipse")) category = "eclipse";
  else if (s.includes("partial lunar eclipse")) category = "eclipse";
  else if (s.includes("annular solar eclipse")) category = "eclipse";
  else if (s.includes("total solar eclipse")) category = "eclipse";
  else if (s.includes("eclipse")) category = "eclipse";
  else if (s.includes("blue moon")) category = "full_moon";
  else if (s.includes("full moon")) category = "full_moon";
  else if (s.includes("new moon")) category = "full_moon";
  else if (s.includes("first quarter") || s.includes("last quarter"))
    category = "full_moon";
  else if (s.includes("conjunction")) category = "conjunction";
  else if (s.includes("close approach")) category = "conjunction";
  else if (s.includes("occultation")) category = "occultation";
  else if (s.includes("greatest elongation") || s.includes("highest altitude"))
    category = "elongation";
  else if (s.includes("dichotomy")) category = "elongation";
  else if (s.includes("at opposition")) category = "opposition";
  else if (s.includes("equinox")) category = "equinox";
  else if (s.includes("solstice")) category = "equinox";
  else if (s.includes("perihelion") || s.includes("aphelion"))
    category = "orbit";
  else if (s.includes("perigee") || s.includes("apogee")) category = "orbit";
  else if (s.includes("retrograde")) category = "retrograde";
  else if (s.includes("greatest brightness")) category = "elongation";
  else if (s.includes("solar conjunction") || s.includes("inferior solar"))
    category = "conjunction";
  else if (s.includes("superior solar")) category = "conjunction";
  else if (s.includes("comet")) category = "comet";
  else if (s.includes("asteroid")) category = "asteroid";
  else if (s.includes("is well placed")) category = "deep_sky";
  else category = "other";

  return { category, keywords: imageKeyword(summary, category) };
}

// ─── Equipment & brightness metadata ─────────────────────────────────────────

export function equipmentFromCategory(category: string): string {
  switch (category) {
    case "meteor_shower":
    case "eclipse":
    case "full_moon":
    case "equinox":
      return "No special equipment needed";
    case "conjunction":
      return "No special equipment needed";
    case "occultation":
    case "elongation":
      return "Binoculars recommended";
    case "deep_sky":
      return "Binoculars or telescope recommended";
    case "comet":
    case "asteroid":
      return "Telescope required";
    default:
      return "No special equipment needed";
  }
}

export function brightnessFromCategory(category: string): string {
  switch (category) {
    case "full_moon":
      return "Bright (visible to naked eye)";
    case "eclipse":
      return "Varies";
    case "meteor_shower":
      return "Moderately bright (visible in dark skies)";
    case "conjunction":
      return "Bright (visible to naked eye)";
    case "deep_sky":
      return "Faint (binoculars recommended)";
    case "comet":
    case "asteroid":
      return "Very faint (telescope required)";
    default:
      return "Varies";
  }
}

// ─── Celestial body extraction ───────────────────────────────────────────────

const PLANET_NAMES = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "ceres",
];

const STAR_NAMES = [
  "antares",
  "regulus",
  "aldebaran",
  "spica",
  "pollux",
  "sirius",
  "betelgeuse",
  "vega",
  "altair",
  "deneb",
];

/** Extract all celestial bodies mentioned in a title, in order of appearance. */
function extractBodies(summary: string): string[] {
  const s = summary.toLowerCase();
  const found: string[] = [];

  for (const name of [...PLANET_NAMES, ...STAR_NAMES, "moon", "sun", "earth"]) {
    if (s.includes(name)) found.push(name);
  }

  // Messier objects – e.g. M44, M45, Messier 10
  const messierNum = s.match(/(?:messier\s+|m)(\d+)/);
  if (messierNum) found.push(`messier ${messierNum[1]}`);

  // NGC objects
  const ngc = s.match(/ngc\s*(\d+)/);
  if (ngc) found.push(`NGC ${ngc[1]}`);

  // IC objects
  const ic = s.match(/ic\s+(\d+)/);
  if (ic) found.push(`IC ${ic[1]}`);

  return found;
}

// ─── NASA image keyword generation ──────────────────────────────────────────
//
// Multiple alternate queries per body so that repeated events for the same
// planet don't all show the same image.  The caller (fetchImages) picks
// result [0] or can rotate through pages.

const PLANET_ALTERNATES: Record<string, string[]> = {
  jupiter: [
    "jupiter juno",
    "jupiter great red spot",
    "jupiter hubble",
    "jupiter atmosphere",
    "jupiter europa",
  ],
  saturn: [
    "saturn rings",
    "saturn cassini",
    "saturn hubble",
    "saturn titan",
    "saturn enceladus",
  ],
  mars: [
    "mars surface",
    "mars rover",
    "mars hubble",
    "mars olympus mons",
    "mars perseverance",
  ],
  venus: [
    "venus atmosphere",
    "venus magellan",
    "venus planet",
    "venus transit sun",
  ],
  mercury: ["mercury messenger", "mercury planet surface", "mercury crater"],
  uranus: ["uranus hubble", "uranus planet", "uranus rings"],
  neptune: ["neptune voyager", "neptune hubble", "neptune planet"],
  pluto: ["pluto new horizons", "pluto heart", "pluto charon"],
  moon: [
    "moon crescent",
    "full moon nasa",
    "quarter moon",
    "moon earth orbit",
    "lunar surface",
  ],
  earth: ["earth sunrise space", "earth from space", "blue marble earth"],
  ceres: ["ceres dawn", "ceres dwarf planet"],
  sun: ["sun corona", "solar flare", "sun ultraviolet"],
};

// Deep-sky objects that appear in "is well placed" events
const DEEP_SKY_KEYWORDS: Record<string, string> = {
  "andromeda galaxy": "andromeda galaxy",
  "sombrero galaxy": "sombrero galaxy",
  "whirlpool galaxy": "whirlpool galaxy",
  "triangulum galaxy": "triangulum galaxy",
  "orion nebula": "orion nebula",
  "lagoon nebula": "lagoon nebula",
  "rosette nebula": "rosette nebula",
  "omega centauri": "omega centauri",
  "large magellanic": "large magellanic cloud",
  "small magellanic": "small magellanic cloud",
  pleiades: "pleiades star cluster",
  hyades: "hyades star cluster",
  beehive: "beehive cluster",
  "jewel box": "jewel box cluster",
  "perseus double": "perseus double cluster",
  "47 tuc": "47 tucanae globular",
  "running man": "running man nebula",
  "butterfly cluster": "butterfly cluster",
  "wishing well": "wishing well cluster",
  "centaurus a": "centaurus a galaxy",
  "great globular cluster in hercules": "hercules globular cluster",
  "great peacock": "NGC 6752 globular",
};

// Track which alternate has been used per body so we rotate through them
const _usedIndex: Record<string, number> = {};

function pickAlternate(body: string): string {
  const alts = PLANET_ALTERNATES[body];
  if (!alts || alts.length === 0) return `${body} space`;
  const idx = (_usedIndex[body] ?? -1) + 1;
  _usedIndex[body] = idx % alts.length;
  return alts[idx % alts.length];
}

function imageKeyword(summary: string, category: string): string {
  const bodies = extractBodies(summary);
  const s = summary.toLowerCase();

  // ── Deep-sky objects ("is well placed") ──
  if (category === "deep_sky") {
    for (const [pattern, keyword] of Object.entries(DEEP_SKY_KEYWORDS)) {
      if (s.includes(pattern)) return keyword;
    }
    // Messier / NGC / IC fallback
    const body = bodies.find(
      (b) =>
        b.startsWith("messier") || b.startsWith("NGC") || b.startsWith("IC"),
    );
    if (body) return `${body} hubble`;
    return "star cluster hubble";
  }

  // ── Meteor showers ──
  if (category === "meteor_shower") return "meteor streak night sky";

  // ── Eclipses ──
  if (category === "eclipse") {
    if (s.includes("total solar")) return "solar eclipse total";
    if (s.includes("annular solar")) return "solar eclipse corona";
    if (s.includes("total lunar")) return "lunar eclipse blood";
    if (s.includes("partial lunar")) return "lunar eclipse";
    return "eclipse";
  }

  // ── Moon phases ──
  if (category === "full_moon") {
    if (s.includes("blue moon")) return "full moon nasa";
    if (s.includes("full moon")) return "full moon nasa";
    if (s.includes("new moon")) return "new moon earth";
    if (s.includes("last quarter")) return "quarter moon";
    if (s.includes("first quarter")) return "moon crescent";
    return "moon earth orbit";
  }

  // ── Conjunctions / close approaches ──
  if (category === "conjunction" || category === "occultation") {
    // Pick the most visually interesting body from the pair
    const bestBody =
      bodies.find((b) => PLANET_NAMES.includes(b)) ??
      bodies.find((b) => STAR_NAMES.includes(b)) ??
      bodies.find((b) => b === "moon");
    if (bestBody) return pickAlternate(bestBody);
    return "conjunction planets night sky";
  }

  // ── Opposition ──
  if (category === "opposition") {
    const body = bodies.find((b) => PLANET_NAMES.includes(b));
    if (body) return pickAlternate(body);
    return "planet opposition";
  }

  // ── Retrograde ──
  if (category === "retrograde") {
    const body = bodies.find((b) => PLANET_NAMES.includes(b));
    if (body) return pickAlternate(body);
    return "planets solar system";
  }

  // ── Elongation / greatest brightness / dichotomy ──
  if (category === "elongation") {
    const body = bodies.find((b) => PLANET_NAMES.includes(b));
    if (body) return pickAlternate(body);
    return "planet twilight sky";
  }

  // ── Orbital events (perihelion, aphelion, perigee, apogee) ──
  if (category === "orbit") {
    if (s.includes("earth")) return "earth from space";
    const body = bodies.find((b) => b !== "earth");
    if (body) return pickAlternate(body);
    return "moon earth orbit";
  }

  // ── Equinox / solstice ──
  if (category === "equinox") {
    if (s.includes("solstice")) return "earth solstice";
    return "earth sunrise space";
  }

  // ── Comets ──
  if (category === "comet") return "comet tail space";

  // ── Asteroids ──
  if (category === "asteroid") return "asteroid belt";

  // ── Fallback: try body name, then generic ──
  if (bodies.length > 0) {
    const body = bodies[0];
    if (PLANET_ALTERNATES[body]) return pickAlternate(body);
    return `${body} space`;
  }

  return "night sky stars";
}
