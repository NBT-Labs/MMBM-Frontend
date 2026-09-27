import { MANDAL_LOCALE, MANDAL_TIME_ZONE } from "@/lib/datetime";

export function formatEventTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(MANDAL_LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: MANDAL_TIME_ZONE,
  });
}

// Square saffron-to-maroon date tile (day number over short month). Uses the
// Mandal's fixed locale + timezone since it's server-rendered then hydrated.
export default function EventDateBadge({
  iso,
  className = "h-20 w-20",
}: {
  iso: string | null;
  className?: string;
}) {
  const date = iso ? new Date(iso) : null;
  const part = (options: Intl.DateTimeFormatOptions) =>
    date?.toLocaleDateString(MANDAL_LOCALE, { ...options, timeZone: MANDAL_TIME_ZONE });

  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl bg-linear-to-br from-saffron-500 to-maroon-700 text-white ${className}`}
    >
      <span className="text-2xl font-bold leading-none">{part({ day: "numeric" }) ?? "--"}</span>
      <span className="mt-1 text-[11px] uppercase tracking-wider">
        {/* Sliced from the long name: short names vary by ICU version ("Sep"/"Sept"). */}
        {part({ month: "long" })?.slice(0, 3) ?? "TBC"}
      </span>
    </div>
  );
}
