"use client";

import { useState } from "react";
import type { MmbmEvent } from "@/lib/types";
import EventModal from "./EventModal";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function FeaturedEvents({ events }: { events: MmbmEvent[] }) {
  const [selected, setSelected] = useState<MmbmEvent | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setSelected(event)}
            className="cursor-pointer rounded-brand border border-mist bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span
              className="mb-2 inline-block rounded-brand px-2 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: event.color }}
            >
              {event.event_type_label}
            </span>
            <p className="font-display text-3xl font-extrabold text-indigo">
              {formatDate(event.date_start)}
            </p>
            <p className="mt-1 font-semibold">{event.title}</p>
            {event.location && <p className="mt-1 text-sm text-ink/60">{event.location}</p>}
          </button>
        ))}
      </div>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
