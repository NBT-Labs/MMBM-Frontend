"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import type { MmbmEvent } from "@/lib/types";
import EventModal from "./EventModal";
import { formatEventTimeRange } from "@/lib/datetime";
import EventDateBadge from "./EventDateBadge";

export default function FeaturedEvents({ events }: { events: MmbmEvent[] }) {
  const [selected, setSelected] = useState<MmbmEvent | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setSelected(event)}
            className="card card-hover flex cursor-pointer items-start gap-4 text-left"
          >
            <EventDateBadge iso={event.date_start} />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1.5">
                <span className="tag">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: event.color }}
                    aria-hidden="true"
                  />
                  {event.event_type_label}
                </span>
                <span className="tag tag-maroon">★ Featured</span>
              </div>
              <h3 className="mt-2 text-lg">{event.title}</h3>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                {event.date_start && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="shrink-0 text-saffron-600" aria-hidden="true" />
                    {formatEventTimeRange(event.date_start, event.date_end)}
                  </span>
                )}
                {event.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="shrink-0 text-saffron-600" aria-hidden="true" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
