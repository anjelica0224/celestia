import axios from "axios";
import { CONFIG } from "../constants/keys";
import { fetchSkyEvents } from "./intheskyapi";

export const fetchAllEvents = async (): Promise<Events[]> => {
  return fetchSkyEvents();
};

export const fetchEvents = async (date: string): Promise<Events[]> => {
  const events = await fetchAllEvents();
  return events.filter((item) => item.date === date);
};

export const fetchOtherEvents = async (date: string): Promise<Events[]> => {
  const events = await fetchAllEvents();
  const todayIndex = events.findIndex((item) => item.date === date);
  const startIndex = todayIndex >= 0 ? todayIndex + 1 : 0;
  return events.slice(startIndex, startIndex + 5);
};

export const fetchEventById = async (id: number): Promise<Events | null> => {
  const events = await fetchAllEvents();
  return events.find((item) => item.id === id) ?? null;
};

export const fetchDescription = async (id: number): Promise<string> => {
  const events = await fetchAllEvents();
  return events.find((item) => item.id === id)?.description ?? "";
};

export const fetchImages = async (
  keywords: string[],
  eventId: number = 0,
): Promise<string> => {
  const year = new Date().getFullYear();

  for (const query of keywords) {
    try {
      const response = await axios.get(
        `${CONFIG.NASA_URL}/search?q=${encodeURIComponent(query)}&media_type=image&year_start=2005&year_end=${year}`,
      );
      const items: any[] = response.data.collection.items ?? [];
      const top3 = items.slice(0, 3);
      if (top3.length > 0) {
        const pick = top3[eventId % top3.length];
        const href = pick?.links?.[0]?.href;
        if (href) return href;
      }
    } catch {
      // network blip on this keyword — try the next one
    }
  }

  return CONFIG.DEFAULT_IMAGE;
};