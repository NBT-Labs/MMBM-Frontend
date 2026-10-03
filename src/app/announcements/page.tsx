import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { getAnnouncements } from "@/lib/api";
import type { Announcement } from "@/lib/types";
import RichText from "@/components/RichText";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Announcements - MMBMA" };

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const urgent = announcement.priority === "urgent";
  return (
    <article
      className={`card card-hover flex flex-col ${
        urgent ? "border-t-4 border-t-saffron-500" : ""
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {announcement.is_highest_priority && (
          <span className="tag tag-maroon">★ Top Announcement</span>
        )}
        <span className={`tag ${urgent ? "bg-saffron-600 text-white" : ""}`}>
          {urgent ? "Urgent" : "Normal"}
        </span>
      </div>
      <h3 className="mb-2 text-xl">{announcement.title}</h3>
      {announcement.message && (
        <RichText html={announcement.message} className="text-sm text-stone-600 [&_p]:mb-2" />
      )}
      {announcement.link_url && (
        <a
          href={announcement.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 self-start text-sm font-semibold text-saffron-700 hover:underline"
        >
          {announcement.link_label || "View details"} &rarr;
        </a>
      )}
      {(announcement.start_date || announcement.end_date) && (
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-stone-500">
          <CalendarDays size={14} className="shrink-0 text-saffron-600" aria-hidden="true" />
          <span>
            {formatDate(announcement.start_date)}
            {announcement.end_date && announcement.end_date !== announcement.start_date
              ? ` - ${formatDate(announcement.end_date)}`
              : ""}
          </span>
        </p>
      )}
    </article>
  );
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  const sorted = [...announcements].sort((a, b) => {
    const dateDiff = (b.start_date || "").localeCompare(a.start_date || "");
    if (dateDiff !== 0) return dateDiff;
    // Same start date: urgent first.
    if (a.priority === b.priority) return 0;
    return a.priority === "urgent" ? -1 : 1;
  });

  return (
    <>
      <PageHero eyebrow="Info Room" title="Announcements">
        <p>Schedule changes, notices and other community updates, newest first.</p>
      </PageHero>

      <section className="py-16">
        <div className="mx-auto max-w-[1152px] px-6">
          {sorted.length === 0 ? (
            <p className="card text-center text-stone-500">
              No announcements right now - check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
