export interface SiteConfig {
  org_name: string;
  tagline: string;
  welcome_text: string;
  mission_statement: string;
  history: string;
  org_structure: string;
  president_name: string;
  president_message: string;
  vision_objectives: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  donation_link: string;
  hindu_calendar_link: string;
  chanting_join_link: string;
  prayer_intro: string;
  prayer_expectations: string;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  priority: "normal" | "urgent";
  is_highest_priority: boolean;
  link_url: string;
  link_label: string;
  start_date: string | null;
  end_date: string | null;
}

export type EventType = "festival" | "regular" | "special";

export interface MmbmEvent {
  id: number;
  title: string;
  event_type: EventType;
  event_type_label: string;
  color: string;
  date_start: string | null;
  date_end: string | null;
  location: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
  is_past: boolean;
}

export interface EventLegendItem {
  event_type: EventType;
  label: string;
  color: string;
}

export interface Festival {
  id: number;
  name: string;
  date: string | null;
  year: number | null;
  significance: string;
  image_url: string | null;
}

export type PrayerType = "puja" | "hanuman_chalisa" | "ramcharitmanas" | "other";

export const PRAYER_TYPE_OPTIONS: { value: PrayerType; label: string }[] = [
  { value: "puja", label: "Puja" },
  { value: "hanuman_chalisa", label: "Hanuman Chalisa" },
  { value: "ramcharitmanas", label: "Ramcharitmanas Chanting" },
  { value: "other", label: "Other" },
];
