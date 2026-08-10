import type { Metadata } from "next";
import { getAnnouncements } from "@/lib/api";
import type { Announcement } from "@/lib/types";
import RichText from "@/components/RichText";

export const metadata: Metadata = { title: "Announcements - MMBMA" };

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const urgent = announcement.priority === "urgent";
  return (
    <article className="rounded-brand border border-mist bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {announcement.is_highest_priority && (
          <span className="rounded-brand bg-gold px-2 py-1 text-xs font-bold text-indigo">
            Top Announcement
          </span>
        )}
        <span
          className={`rounded-brand px-2 py-1 text-xs font-bold text-white ${
            urgent ? "bg-coral" : "bg-teal"
          }`}
        >
          {urgent ? "Urgent" : "Normal"}
        </span>
      </div>
      <h3 className="mb-2 text-lg">{announcement.title}</h3>
      {announcement.message && (
        <RichText html={announcement.message} className="text-sm text-ink/80 [&_p]:mb-2" />
      )}
      {announcement.link_url && (
        <a
          href={announcement.link_url}
          className="mt-2 inline-block text-sm font-bold text-teal hover:underline"
        >
          {announcement.link_label || "View details"} &rarr;
        </a>
      )}
      {(announcement.start_date || announcement.end_date) && (
        <p className="mt-3 text-xs text-ink/50">
          {formatDate(announcement.start_date)}
          {announcement.end_date && announcement.end_date !== announcement.start_date
            ? ` - ${formatDate(announcement.end_date)}`
            : ""}
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
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Info Room
      </p>
      <h1 className="mb-2 text-3xl md:text-4xl">Announcements</h1>
      <p className="mb-8 max-w-2xl text-ink/70">
        Schedule changes, notices and other community updates, newest first.
      </p>

      {sorted.length === 0 ? (
        <p className="text-ink/60">No announcements right now - check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
