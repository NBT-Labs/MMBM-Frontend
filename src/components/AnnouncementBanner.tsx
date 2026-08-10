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

  return (
    <div className="relative flex items-center justify-center gap-4 bg-coral px-12 py-2 text-center text-sm text-white">
      <div className="min-w-0">
        <p className="truncate">
          <span className="mr-2 font-display font-bold uppercase tracking-wide">
            Community Update
          </span>
          {announcement.title}
          {announcement.link_url && (
            <a
              href={announcement.link_url}
              className="ml-2 whitespace-nowrap font-semibold text-white underline underline-offset-2"
            >
              {announcement.link_label || "View details"} &rarr;
            </a>
          )}
        </p>
        {announcement.message && (
          <div
            className="truncate text-xs text-white/85 [&_p]:inline [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: announcement.message }}
          />
        )}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-lg leading-none text-white/90 hover:text-white"
      >
        &times;
      </button>
    </div>
  );
}
