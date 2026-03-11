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
// detectCategory runs on one text string. categorize tries summary first,
// then falls back to description so vague titles still get a real category.

function detectCategory(text: string): string | null {
  const s = text.toLowerCase();
  if (s.includes("meteor shower"))                                     return "meteor_shower";
  if (s.includes("total lunar eclipse"))                               return "eclipse";
  if (s.includes("partial lunar eclipse"))                             return "eclipse";
  if (s.includes("annular solar eclipse"))                             return "eclipse";
  if (s.includes("total solar eclipse"))                               return "eclipse";
  if (s.includes("eclipse"))                                           return "eclipse";
  if (s.includes("blue moon"))                                         return "full_moon";
  if (s.includes("full moon"))                                         return "full_moon";
  if (s.includes("new moon"))                                          return "full_moon";
  if (s.includes("first quarter") || s.includes("last quarter"))      return "full_moon";
  if (s.includes("conjunction"))                                       return "conjunction";
  if (s.includes("close approach"))                                    return "conjunction";
  if (s.includes("occultation"))                                       return "occultation";
  if (s.includes("greatest elongation") || s.includes("highest altitude")) return "elongation";
  if (s.includes("dichotomy"))                                         return "elongation";
  if (s.includes("greatest brightness"))                               return "elongation";
  if (s.includes("at opposition"))                                     return "opposition";
  if (s.includes("equinox"))                                           return "equinox";
  if (s.includes("solstice"))                                          return "equinox";
  if (s.includes("perihelion") || s.includes("aphelion"))             return "orbit";
  if (s.includes("perigee") || s.includes("apogee"))                  return "orbit";
  if (s.includes("retrograde"))                                        return "retrograde";
  if (s.includes("solar conjunction") || s.includes("inferior solar")) return "conjunction";
  if (s.includes("superior solar"))                                    return "conjunction";
  if (s.includes("comet"))                                             return "comet";
  if (s.includes("asteroid"))                                          return "asteroid";
  if (s.includes("is well placed") || s.includes("well placed"))      return "deep_sky";
  if (s.includes("transit"))                                           return "transit";
  if (s.includes("aurora"))                                            return "aurora";
  return null;
}

export function categorize(
  summary: string,
  description: string = "",
): { category: string; keywords: string } {
  const category =
    detectCategory(summary) ??
    detectCategory(description) ??
    "other";

  return { category, keywords: imageKeyword(summary, description, category) };
}

// ─── Equipment & brightness metadata ─────────────────────────────────────────

export function equipmentFromCategory(category: string): string {
  switch (category) {
    case "meteor_shower":
    case "eclipse":
    case "full_moon":
    case "equinox":
    case "conjunction":
    case "aurora":
      return "No special equipment needed";
    case "occultation":
    case "elongation":
    case "transit":
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
    case "full_moon":     return "Bright (visible to naked eye)";
    case "eclipse":       return "Varies";
    case "meteor_shower": return "Moderately bright (visible in dark skies)";
    case "conjunction":   return "Bright (visible to naked eye)";
    case "aurora":        return "Varies with solar activity";
    case "deep_sky":      return "Faint (binoculars recommended)";
    case "comet":
    case "asteroid":      return "Very faint (telescope required)";
    default:              return "Varies";
  }
}

// ─── Keyword map ──────────────────────────────────────────────────────────────
// 1-2 word queries only. Multi-word matches listed before single-word ones
// so "orion nebula" wins over "orion", "meteor shower" wins over "meteor".
// Sorted at module load time so imageKeyword() doesn't re-sort every call.

const KEYWORD_MAP: { match: string; query: string }[] = [
  // Planets
  { match: "mercury", query: "mercury" },
  { match: "venus",   query: "venus" },
  { match: "mars",    query: "mars" },
  { match: "jupiter", query: "jupiter" },
  { match: "saturn",  query: "saturn" },
  { match: "uranus",  query: "uranus" },
  { match: "neptune", query: "neptune" },
  { match: "pluto",   query: "pluto" },
  { match: "ceres",   query: "ceres" },

  // Moon phases
  { match: "full moon",     query: "supermoon" },
  { match: "blue moon",     query: "supermoon" },
  { match: "new moon",      query: "crescent moon" },
  { match: "first quarter", query: "quarter moon" },
  { match: "last quarter",  query: "quarter moon" },
  { match: "supermoon",     query: "supermoon" },
  { match: "crescent moon", query: "crescent moon" },
  { match: "lunar surface", query: "lunar surface" },
  { match: "moon",          query: "lunar" },

  // Sun / solar
  { match: "solar flare",       query: "solar flare" },
  { match: "solar eclipse",     query: "solar eclipse" },
  { match: "annular eclipse",   query: "annular eclipse" },
  { match: "annular",           query: "annular eclipse" },
  { match: "solar conjunction", query: "solar corona" },
  { match: "solar corona",      query: "solar corona" },
  { match: "sun",               query: "solar corona" },

  // Eclipses
  { match: "total lunar eclipse",   query: "lunar eclipse" },
  { match: "partial lunar eclipse", query: "lunar eclipse" },
  { match: "lunar eclipse",         query: "lunar eclipse" },

  // Meteor showers — named first so they beat "meteor shower" / "meteor"
  { match: "perseid",        query: "perseid" },
  { match: "leonid",         query: "leonid" },
  { match: "geminid",        query: "geminid" },
  { match: "orionid",        query: "orionid" },
  { match: "lyrid",          query: "lyrid" },
  { match: "ursid",          query: "ursid" },
  { match: "quadrantid",     query: "quadrantid" },
  { match: "delta aquariid", query: "meteor shower" },
  { match: "eta aquariid",   query: "meteor shower" },
  { match: "meteor shower",  query: "meteor shower" },
  { match: "meteor",         query: "meteor" },

  // Comets
  { match: "halley",  query: "halley comet" },
  { match: "neowise", query: "neowise" },
  { match: "comet",   query: "comet" },

  // Asteroids
  { match: "asteroid", query: "asteroid" },

  // Galaxies (longer matches first)
  { match: "andromeda galaxy",  query: "andromeda" },
  { match: "whirlpool galaxy",  query: "whirlpool galaxy" },
  { match: "sombrero galaxy",   query: "sombrero galaxy" },
  { match: "triangulum galaxy", query: "triangulum galaxy" },
  { match: "large magellanic",  query: "magellanic cloud" },
  { match: "small magellanic",  query: "magellanic cloud" },
  { match: "centaurus a",       query: "centaurus" },
  { match: "milky way",         query: "milky way" },
  { match: "andromeda",         query: "andromeda" },
  { match: "galaxy",            query: "galaxy" },

  // Nebulae
  { match: "orion nebula",   query: "orion nebula" },
  { match: "horsehead",      query: "horsehead" },
  { match: "lagoon nebula",  query: "lagoon nebula" },
  { match: "crab nebula",    query: "crab nebula" },
  { match: "rosette nebula", query: "rosette nebula" },
  { match: "eagle nebula",   query: "eagle nebula" },
  { match: "nebula",         query: "nebula" },

  // Clusters
  { match: "omega centauri",   query: "omega centauri" },
  { match: "47 tucanae",       query: "47 tucanae" },
  { match: "47 tuc",           query: "47 tucanae" },
  { match: "globular cluster", query: "globular cluster" },
  { match: "star cluster",     query: "star cluster" },
  { match: "open cluster",     query: "star cluster" },
  { match: "pleiades",         query: "pleiades" },
  { match: "hyades",           query: "hyades" },
  { match: "beehive",          query: "beehive cluster" },
  { match: "hercules",         query: "hercules cluster" },
  { match: "globular",         query: "globular cluster" },

  // Stars
  { match: "sirius",     query: "sirius" },
  { match: "betelgeuse", query: "betelgeuse" },
  { match: "antares",    query: "antares" },
  { match: "vega",       query: "vega" },
  { match: "aldebaran",  query: "aldebaran" },
  { match: "spica",      query: "spica" },
  { match: "regulus",    query: "regulus" },
  { match: "pollux",     query: "pollux" },
  { match: "altair",     query: "altair" },
  { match: "deneb",      query: "deneb" },

  // Event types
  { match: "occultation", query: "occultation" },
  { match: "conjunction", query: "conjunction" },
  { match: "opposition",  query: "opposition" },
  { match: "elongation",  query: "elongation" },
  { match: "retrograde",  query: "retrograde" },
  { match: "perihelion",  query: "perihelion" },
  { match: "aphelion",    query: "aphelion" },
  { match: "perigee",     query: "lunar perigee" },
  { match: "apogee",      query: "lunar apogee" },
  { match: "equinox",     query: "equinox" },
  { match: "solstice",    query: "solstice" },
  { match: "transit",     query: "transit" },
  { match: "aurora",      query: "aurora" },
];

const SORTED_KEYWORD_MAP = [...KEYWORD_MAP].sort(
  (a, b) => b.match.length - a.match.length,
);

// ─── Image keywords ───────────────────────────────────────────────────────────

function categoryFallback(category: string): string {
  switch (category) {
    case "meteor_shower": return "meteor shower";
    case "eclipse":       return "solar eclipse";
    case "full_moon":     return "supermoon";
    case "conjunction":   return "conjunction";
    case "occultation":   return "occultation";
    case "opposition":    return "opposition";
    case "elongation":    return "elongation";
    case "retrograde":    return "retrograde";
    case "orbit":         return "lunar";
    case "equinox":       return "equinox";
    case "comet":         return "comet";
    case "asteroid":      return "asteroid";
    case "transit":       return "transit";
    case "aurora":        return "aurora";
    case "deep_sky":      return "nebula";
    default:              return "night sky";
  }
}

/** Primary keyword — first match wins. Stored on event.keywords. */
export function imageKeyword(
  summary: string,
  description: string,
  category: string,
): string {
  const haystack = `${summary} ${description}`.toLowerCase();
  for (const { match, query } of SORTED_KEYWORD_MAP) {
    if (haystack.includes(match)) return query;
  }
  return categoryFallback(category);
}

/**
 * All matching queries in priority order (longest match first, deduped).
 * fetchImages uses this list to fall back to the next keyword if the
 * primary one returns no NASA results.
 */
export function getAllKeywords(
  summary: string,
  description: string,
  category: string,
): string[] {
  const haystack = `${summary} ${description}`.toLowerCase();
  const seen = new Set<string>();
  const results: string[] = [];

  for (const { match, query } of SORTED_KEYWORD_MAP) {
    if (haystack.includes(match) && !seen.has(query)) {
      seen.add(query);
      results.push(query);
    }
  }

  // Always append the category fallback as final safety net
  const fallback = categoryFallback(category);
  if (!seen.has(fallback)) results.push(fallback);

  return results;
}