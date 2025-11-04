import axios from 'axios';
import { CONFIG } from '../config';
export const fetchEvents = async(date: string) : Promise<Events[]> => {
    const allEvents = await axios.get(CONFIG.BASE_URL!);
    const filteredEvents = allEvents.data.events.filter((item: any)=> item.date === date);
    return filteredEvents;
}

export const fetchOtherEvents = async(date: string) : Promise<Events[]> => {
    const allEvents = await axios.get(CONFIG.BASE_URL!);
    const filteredEvents = allEvents.data.events.find((item: any)=> item.date === date).id;
    return allEvents.data.events.filter((item: any) => item.id > filteredEvents && item.id < filteredEvents + 5);
}

export const fetchDescription = async(id: number) : Promise<Events> => {
    const allEvents = await axios.get(CONFIG.BASE_URL!);
    const eventDescription = allEvents.data.events.find((item: any)=> item.id === id);
    return eventDescription.description;
}

export const fetchImages = async(query: string) : Promise<string> => {
    const response = await axios.get(`${CONFIG.NASA_URL}/search?q=${query}&media_type=image&year_start=2005&year_end=2025&api_key=${process.env.NASA_API_KEY}`);
    const items = response.data.collection.items;
    return items.length > 0 ? items[0].links[0].href : CONFIG.DEFAULT_IMAGE;
}