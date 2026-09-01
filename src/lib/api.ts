import type {
  Announcement,
  EventLegendItem,
  Festival,
  MmbmEvent,
  SiteConfig,
} from "./types";

// Two different base URLs on purpose (matters once this runs in Docker):
//
// - INTERNAL_API_BASE_URL: used by Server Component `fetch()` calls, which
//   run inside the Next.js container itself. In docker-compose this points
//   at the Odoo container over the shared `mmbm_network` (e.g.
//   http://mmbm_odoo:8069), which is faster and doesn't depend on the host's
//   published port.
// - PUBLIC_API_BASE_URL (NEXT_PUBLIC_*): used for anything that ends up in
//   HTML sent to the browser (image <img src> URLs) - the browser runs on
//   the host machine, not inside Docker, so it must use a host-reachable
//   URL (e.g. http://localhost:8069).
//
// Outside Docker (plain `npm run dev`), both simply default to the same
// value, so nothing extra needs to be configured for local, non-Docker dev.
// Exported for client components (e.g. the contact form) that need to fetch
// directly from the browser - they can't use the internal Docker URL below.
export const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8069";
const INTERNAL_API_BASE_URL = process.env.API_BASE_URL_INTERNAL || PUBLIC_API_BASE_URL;

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(
      `${INTERNAL_API_BASE_URL}${path}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`${path} -> ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`Failed to fetch ${path} from ${INTERNAL_API_BASE_URL}`, err);
    return fallback;
  }
}

function toPublicImageUrl(path: string | null): string | null {
  if (!path) return null;
  return `${PUBLIC_API_BASE_URL}${path}`;
}

export function getConfig(): Promise<SiteConfig | null> {
  return getJson<SiteConfig | null>("/api/mmbm/config", null);
}

export function getBannerAnnouncement(): Promise<Announcement | null> {
  return getJson<Announcement | null>("/api/mmbm/announcements/banner", null);
}

export function getAnnouncements(): Promise<Announcement[]> {
  return getJson<Announcement[]>("/api/mmbm/announcements", []);
}

export async function getEvents(): Promise<MmbmEvent[]> {
  const events = await getJson<MmbmEvent[]>("/api/mmbm/events", []);
  return events.map((e) => ({ ...e, image_url: toPublicImageUrl(e.image_url) }));
}

export function getEventLegend(): Promise<EventLegendItem[]> {
  return getJson<EventLegendItem[]>("/api/mmbm/events/legend", []);
}

export async function getFestivals(): Promise<Festival[]> {
  const festivals = await getJson<Festival[]>("/api/mmbm/festivals", []);
  return festivals.map((f) => ({ ...f, image_url: toPublicImageUrl(f.image_url) }));
}
