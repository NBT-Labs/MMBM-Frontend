"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type Event as RbcEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { EventLegendItem, MmbmEvent } from "@/lib/types";

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

  return (
    <div>
      <div className="rounded-brand border border-mist bg-white p-2 md:p-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 640 }}
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

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-brand bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <span
                  className="mb-2 inline-block rounded-brand px-2 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: selected.color }}
                >
                  {selected.event_type_label}
                </span>
                <h3 className="text-xl">{selected.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="text-2xl leading-none text-ink/50 hover:text-ink"
              >
                &times;
              </button>
            </div>

            {selected.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.image_url}
                alt=""
                className="mb-4 aspect-video w-full rounded-brand object-cover"
              />
            )}

            <p className="mb-1 text-sm text-ink/70">
              {new Date(selected.date_start as string).toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
            {selected.location && (
              <p className="mb-3 text-sm text-ink/70">{selected.location}</p>
            )}
            {selected.description && (
              <div
                className="prose-mmbm max-w-none text-sm [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: selected.description }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
