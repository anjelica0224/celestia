import axios from "axios";
import { CONFIG } from "../constants/keys";
import {
  brightnessFromCategory,
  categorize,
  decodeEntities,
  displayDate,
  equipmentFromCategory,
  getAllKeywords,
  parseICalDate,
} from "../utils/eventUtils";

const CACHE_MS = 60 * 60 * 1000;
let _cache: Events[] | null = null;
let _cacheTime = 0;

function parseICal(text: string): Events[] {
  const events: Events[] = [];
  const blocks = text.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];

    const getField = (name: string): string => {
      const regex = new RegExp(`^${name}:(.*)`, "m");
      const match = block.match(regex);
      if (!match) return "";
      let value = match[1].trim();
      const startIdx = block.indexOf(match[0]);
      const afterMatch = block.slice(startIdx + match[0].length);
      const lines = afterMatch.split("\n");
      for (const line of lines) {
        if (line.startsWith(" ") || line.startsWith("\t")) {
          value += line.slice(1);
        } else {
          break;
        }
      }
      return value.trim();
    };

    const summary = decodeEntities(getField("SUMMARY"));
    const description = decodeEntities(getField("DESCRIPTION"));
    const dtstart = getField("DTSTART");
    const url = getField("URL");

    if (!summary || !dtstart) continue;

    const { date, time } = parseICalDate(dtstart);

    const cleanDesc = description
      .replace(/\s*https?:\/\/in-the-sky\.org\/\S*/g, "")
      .trim();

    // Pass description as fallback so vague summaries still get a real category
    const { category, keywords } = categorize(summary, cleanDesc);
    const allKeywords = getAllKeywords(summary, cleanDesc, category);

    events.push({
      id: i,
      date,
      date_display: displayDate(date),
      event_name: summary,
      category,
      description: cleanDesc || summary,
      viewing_time: `Best viewing around ${time}`,
      visibility: "Check your location for visibility",
      constellation: "",
      brightness: brightnessFromCategory(category),
      requires_equipment: equipmentFromCategory(category),
      keywords,
      allKeywords,
      raw_description: cleanDesc || summary,
      detail_url: url || "",
    });
  }

  events.sort((a, b) => a.date.localeCompare(b.date));
  events.forEach((e, idx) => (e.id = idx + 1));

  return events;
}

export async function fetchSkyEvents(): Promise<Events[]> {
  if (_cache && Date.now() - _cacheTime < CACHE_MS) return _cache;

  const year = new Date().getFullYear();
  const url = `${CONFIG.SKY_CALENDAR_URL}?year=${year}&maxdiff=7`;

  try {
    const { data } = await axios.get<string>(url, { responseType: "text" });
    const events = parseICal(data);
    _cache = events;
    _cacheTime = Date.now();
    return events;
  } catch (err: any) {
    console.error("in-the-sky.org fetch error:", err?.message);
    return _cache ?? [];
  }
}