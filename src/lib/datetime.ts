// Dates are shown in the Mandal's own timezone with a fixed locale, so the
// server (Docker/Vercel, UTC) and the browser always agree - otherwise
// server-rendered dates can differ from the hydrated ones near midnight.
export const MANDAL_TIME_ZONE = "America/Toronto"; // Montreal
export const MANDAL_LOCALE = "en-CA";

// Today's date in Montreal as "YYYY-MM-DD" (en-CA formats dates that way),
// directly comparable with Odoo date strings.
export function todayInMandal(): string {
  return new Date().toLocaleDateString(MANDAL_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: MANDAL_TIME_ZONE,
  });
}
