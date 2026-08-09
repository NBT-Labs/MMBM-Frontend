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
    <div className="flex items-center justify-between gap-4 bg-coral px-6 py-2 text-sm text-white">
      <p className="min-w-0 flex-1 truncate">
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
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 text-lg leading-none text-white/90 hover:text-white"
      >
        &times;
      </button>
    </div>
  );
}
