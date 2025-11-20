import axios from "axios";
import { CONFIG } from "../constants/keys";

export const fetchAllEvents = async (): Promise<Events[]> => {
  const response = await axios.get(CONFIG.BASE_URL!);
  return response.data.events;
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
  const eventDescription = events.find((item) => item.id === id);
  return eventDescription?.description ?? "";
};

export const fetchImages = async (query: string): Promise<string> => {
  const response = await axios.get(
    `${CONFIG.NASA_URL}/search?q=${query}&media_type=image&year_start=2005&year_end=2025`
  );
    const items = response.data.collection.items;
    return items.length > 0 ? items[0].links[0].href : CONFIG.DEFAULT_IMAGE;
};