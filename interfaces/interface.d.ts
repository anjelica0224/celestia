interface Events {
  id: number;
  date: string;
  date_display: string;
  event_name: string;
  category: string;
  description: string;
  viewing_time: string;
  visibility: string;
  constellation: string;
  brightness: string;
  requires_equipment: string;
  keywords: string;
  allKeywords: string[];
  raw_description: string;
  detail_url?: string;
}