"use client";

import { useEffect, useState } from "react";
import type { Announcement } from "@/lib/types";

const DISMISSED_KEY = "mmbma_dismissed_announcement_id";

export default function AnnouncementBanner({
  announcement,
}: {
  announcement: Announcement | null;
}) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!announcement) return;
    const dismissedId = window.localStorage.getItem(DISMISSED_KEY);
    setDismissed(dismissedId === String(announcement.id));
  }, [announcement]);

  if (!announcement || dismissed) return null;

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, String(announcement.id));
    setDismissed(true);
  };

  const urgent = announcement.priority === "urgent";

  return (
    <div className="relative border-b border-maroon-900/10 bg-marigold px-12 py-2.5 text-center text-sm text-maroon-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex min-w-0 max-w-[1152px] flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-3">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-maroon-800 px-3 py-1 text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-saffron-100">
          {urgent && (
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-marigold" />
            </span>
          )}
          {urgent && <span className="sr-only">Urgent:</span>}
          Community Update
        </span>
        <p className="min-w-0 text-balance font-semibold sm:truncate">
          {announcement.title}
          {announcement.link_url && (
            <a
              href={announcement.link_url}
              className="ml-2 whitespace-nowrap font-bold underline underline-offset-2 hover:text-maroon-700"
            >
              {announcement.link_label || "View details"} &rarr;
            </a>
          )}
        </p>
      </div>
      {announcement.message && (
        <div
          className="mx-auto mt-1 max-w-[1152px] truncate text-xs text-maroon-900/80 [&_p]:inline [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: announcement.message }}
        />
      )}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-lg leading-none text-maroon-900/80 hover:bg-maroon-900/10 hover:text-maroon-900"
      >
        &times;
      </button>
    </div>
  );
}
