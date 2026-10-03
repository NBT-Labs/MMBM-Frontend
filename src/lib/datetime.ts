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

function mandalDayKey(iso: string): string {
  return new Date(iso).toLocaleDateString(MANDAL_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: MANDAL_TIME_ZONE,
  });
}

function formatMandalDate(iso: string): string {
  return new Date(iso).toLocaleDateString(MANDAL_LOCALE, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: MANDAL_TIME_ZONE,
  });
}

function formatMandalTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(MANDAL_LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: MANDAL_TIME_ZONE,
  });
}

/** Day line for event details (modal). */
export function formatEventDay(
  dateStart: string | null,
  dateEnd: string | null,
): string {
  if (!dateStart) return "";
  const startDay = formatMandalDate(dateStart);
  if (!dateEnd || mandalDayKey(dateStart) === mandalDayKey(dateEnd)) {
    return startDay;
  }
  return `${startDay} to ${formatMandalDate(dateEnd)}`;
}

/** Clock times only — for the event popup Time line. */
export function formatEventClockRange(
  dateStart: string | null,
  dateEnd: string | null,
): string {
  if (!dateStart) return "";
  const startTime = formatMandalTime(dateStart);
  if (!dateEnd || dateEnd === dateStart) return startTime;
  return `${startTime} to ${formatMandalTime(dateEnd)}`;
}

/** Compact time (or time range) for event cards. */
export function formatEventTimeRange(
  dateStart: string | null,
  dateEnd: string | null,
): string {
  if (!dateStart) return "";
  const startTime = formatMandalTime(dateStart);
  if (!dateEnd || dateEnd === dateStart) return startTime;

  const endTime = formatMandalTime(dateEnd);
  if (mandalDayKey(dateStart) === mandalDayKey(dateEnd)) {
    return `${startTime} to ${endTime}`;
  }

  const endDate = new Date(dateEnd).toLocaleDateString(MANDAL_LOCALE, {
    month: "short",
    day: "numeric",
    timeZone: MANDAL_TIME_ZONE,
  });
  return `${startTime} to ${endDate}, ${endTime}`;
}
