"use client";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-brand bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <span
              className="mb-2 inline-block rounded-brand px-2 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: event.color }}
            >
              {event.event_type_label}
            </span>
            <h3 className="text-xl">{event.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-ink/50 hover:text-ink"
          >
            &times;
          </button>
        </div>

        {event.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt=""
            className="mb-4 aspect-video w-full rounded-brand object-cover"
          />
        )}

        <p className="mb-1 text-sm text-ink/70">
          {new Date(event.date_start as string).toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>
        {event.location && <p className="mb-3 text-sm text-ink/70">{event.location}</p>}
        {event.description && (
          <div
            className="prose-mmbm max-w-none text-sm [&_p]:mb-2"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}
      </div>
    </div>
  );
}
