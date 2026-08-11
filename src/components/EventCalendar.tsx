"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type Event as RbcEvent,
  type ToolbarProps,
  type View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { EventLegendItem, MmbmEvent } from "@/lib/types";
import EventModal from "./EventModal";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales,
});

interface CalendarEvent extends RbcEvent {
  resource: MmbmEvent;
}

const VIEW_OPTIONS: { key: View; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
  { key: "agenda", label: "Agenda" },
];

// react-big-calendar's default Toolbar looks like an unstyled browser
// button and doesn't match the brand system, so we swap it out for our own
// via the `components.toolbar` prop. It still drives navigation through the
// same onNavigate/onView callbacks the Calendar passes down, so Today/Prev/
// Next/view-switching all keep working exactly as before - just restyled.
function BrandToolbar({ label, onNavigate, onView, view }: ToolbarProps<CalendarEvent, object>) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="rounded-brand bg-indigo px-3 py-1.5 font-display text-sm font-bold text-white hover:brightness-110"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          aria-label="Previous"
          className="rounded-brand border border-mist px-3 py-1.5 text-sm font-bold text-indigo hover:bg-mist/60"
        >
          &larr;
        </button>
        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          aria-label="Next"
          className="rounded-brand border border-mist px-3 py-1.5 text-sm font-bold text-indigo hover:bg-mist/60"
        >
          &rarr;
        </button>
      </div>

      <h2 className="font-display text-lg font-bold text-indigo">{label}</h2>

      <div className="flex gap-1 rounded-brand bg-mist/60 p-1">
        {VIEW_OPTIONS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onView(v.key)}
            className={`rounded-brand px-3 py-1.5 text-sm font-bold transition-colors ${
              view === v.key ? "bg-gold text-indigo" : "text-indigo/70 hover:bg-white"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function toCalendarEvents(events: MmbmEvent[]): CalendarEvent[] {
  return events
    .filter((e) => e.date_start)
    .map((e) => ({
      title: e.title,
      start: new Date(e.date_start as string),
      end: new Date((e.date_end || e.date_start) as string),
      resource: e,
    }));
}

export default function EventCalendar({
  events,
  legend,
}: {
  events: MmbmEvent[];
  legend: EventLegendItem[];
}) {
  const calendarEvents = useMemo(() => toCalendarEvents(events), [events]);
  const [selected, setSelected] = useState<MmbmEvent | null>(null);

  // Drive navigation/view from our own state instead of leaving the
  // Calendar uncontrolled. react-big-calendar 1.20's internal state updates
  // for Today/Prev/Next/view-switching weren't causing re-renders under
  // React 19 - our own useState (already proven working via onSelectEvent
  // below) sidesteps that entirely.
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("month");

  // react-big-calendar highlights "today" by comparing against the system
  // clock on every render. If the server (Docker container, often UTC) and
  // the browser (local timezone) disagree on what "today" is even by a few
  // hours, the server-rendered HTML and the client's first render disagree
  // too, which React flags as a hydration error. There's no SEO value in
  // pre-rendering an interactive calendar anyway, so it's simplest to just
  // not render it until after mount - server and the pre-mount client render
  // both show the same placeholder, then the real (client-clock-accurate)
  // calendar swaps in.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div>
        <div
          className="flex items-center justify-center rounded-brand border border-mist bg-white p-2 text-sm text-ink/50 md:p-4"
          style={{ height: 640 }}
        >
          Loading calendar...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-brand border border-mist bg-white p-2 md:p-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 640 }}
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          components={{ toolbar: BrandToolbar }}
          eventPropGetter={(event) => {
            const e = (event as CalendarEvent).resource;
            return {
              style: {
                backgroundColor: e.color,
                borderRadius: 6,
                border: "none",
                color: "#fff",
              },
            };
          }}
          onSelectEvent={(event) => setSelected((event as CalendarEvent).resource)}
        />
      </div>

      {legend.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-brand bg-mist/60 px-4 py-3 text-sm">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-ink/60">
            Legend
          </span>
          {legend.map((item) => (
            <span key={item.event_type} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      )}

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
