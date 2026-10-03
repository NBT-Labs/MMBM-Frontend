"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";
import { formatEventClockRange, formatEventDay } from "@/lib/datetime";
import type { MmbmEvent } from "@/lib/types";

// Shared between EventCalendar (click an event on the grid) and the Home
// page's Featured section (click a featured card) - same details popup
// either way.
export default function EventModal({
  event,
  onClose,
}: {
  event: MmbmEvent | null;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-saffron-100 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <span className="tag mb-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: event.color }}
                aria-hidden="true"
              />
              {event.event_type_label}
            </span>
            <h3 className="text-2xl">{event.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-2xl leading-none text-stone-500 hover:bg-saffron-100 hover:text-maroon-800"
          >
            &times;
          </button>
        </div>

        {event.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt=""
            className="mb-4 aspect-video w-full rounded-xl object-cover"
          />
        )}

        {event.date_start && (
          <div className="mb-1.5 space-y-1.5 text-sm text-stone-600">
            <p className="flex items-start gap-2">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-saffron-600" aria-hidden="true" />
              <span>
                <span className="font-semibold text-stone-700">Day:</span>{" "}
                {formatEventDay(event.date_start, event.date_end)}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-saffron-600" aria-hidden="true" />
              <span>
                <span className="font-semibold text-stone-700">Time:</span>{" "}
                {formatEventClockRange(event.date_start, event.date_end)}
              </span>
            </p>
          </div>
        )}
        {event.location && (
          <p className="mb-3 flex items-center gap-2 text-sm text-stone-600">
            <MapPin size={16} className="shrink-0 text-saffron-600" aria-hidden="true" />
            {event.location}
          </p>
        )}
        {event.description && (
          <div
            className="prose-mmbm mt-4 max-w-none border-t border-saffron-100 pt-4 text-sm text-stone-700 [&_p]:mb-2"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}
      </div>
    </div>
  );
}
