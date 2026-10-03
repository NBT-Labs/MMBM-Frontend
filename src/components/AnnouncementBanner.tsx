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
  const hasDescription = Boolean(
    announcement.message?.replace(/<[^>]*>/g, "").trim(),
  );

  return (
    <div className="relative z-50 border-b border-maroon-900/10 bg-[#f5a623] text-maroon-900 shadow-[0_4px_14px_rgba(74,20,9,0.18)]">
      <div className="mx-auto flex min-h-12 max-w-[1152px] items-center gap-4 px-4 py-3 pr-12 sm:gap-6 sm:px-6 sm:pr-14">
        <span className="inline-flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon-800/75">
          {urgent ? (
            <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-white motion-safe:animate-ping" />
              <span className="relative m-auto block h-3 w-3 rounded-full bg-white shadow-[0_0_0_2px_rgba(74,20,9,0.35)]" />
            </span>
          ) : (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-maroon-800/45"
              aria-hidden="true"
            />
          )}
          {urgent && <span className="sr-only">Urgent:</span>}
          Community Update
        </span>

        <span className="hidden h-4 w-px shrink-0 bg-maroon-900/20 sm:block" aria-hidden="true" />

        <div
          className={`min-w-0 flex-1 ${hasDescription ? "" : "flex items-center"}`}
        >
          <p className="text-[15px] font-semibold leading-snug tracking-tight">
            {announcement.title}
          </p>
          {hasDescription && (
            <div
              className="mt-0.5 truncate text-xs text-maroon-900/70 [&_p]:m-0 [&_p]:inline"
              dangerouslySetInnerHTML={{ __html: announcement.message || "" }}
            />
          )}
        </div>

        {announcement.link_url && (
          <a
            href={announcement.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-bold text-maroon-800 underline decoration-maroon-800/30 underline-offset-4 transition-colors hover:decoration-maroon-800"
          >
            {announcement.link_label || "View details"}
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-lg leading-none text-maroon-900/55 transition-colors hover:bg-maroon-900/10 hover:text-maroon-900 sm:right-3"
      >
        &times;
      </button>
    </div>
  );
}
