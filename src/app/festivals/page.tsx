import type { Metadata } from "next";
import { getConfig, getFestivals } from "@/lib/api";
import type { Festival } from "@/lib/types";
import RichText from "@/components/RichText";

export const metadata: Metadata = { title: "Festivals - MMBMA" };

function formatDate(iso: string | null) {
  if (!iso) return "[Date to be confirmed]";
  const d = new Date(`${iso}T12:00:00`);
  const weekday = d.toLocaleDateString(undefined, { weekday: "long" });
  const month = d.toLocaleDateString(undefined, { month: "long" });
  // Use getFullYear() so locales don't render "2,026".
  return `${weekday}, ${month} ${d.getDate()}, ${d.getFullYear()}`;
}

function monthLabel(iso: string | null) {
  if (!iso) return "TBD";
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { month: "short" });
}

function FestivalCard({ festival }: { festival: Festival }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-brand border border-mist bg-white shadow-sm">
      {festival.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={festival.image_url}
          alt=""
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-teal">
          <span className="font-display text-4xl font-extrabold text-white/90">
            {monthLabel(festival.date)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-lg">{festival.name}</h3>
        <p className="mb-3 text-sm font-semibold text-ink/70">{formatDate(festival.date)}</p>
        {festival.significance ? (
          <RichText
            html={festival.significance}
            className="text-sm text-ink/80 [&_p]:mb-2 [&_p:last-child]:mb-0"
          />
        ) : null}
      </div>
    </article>
  );
}

export default async function FestivalsPage() {
  const [festivals, config] = await Promise.all([getFestivals(), getConfig()]);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Hindu Calendar
      </p>
      <h1 className="mb-2 text-3xl md:text-4xl">Festivals</h1>
      <p className="mb-8 max-w-2xl text-ink/70">
        Name, date, meaning and practices for the festivals the Mandal observes.
        {config?.hindu_calendar_link ? (
          <>
            {" "}
            <a
              href={config.hindu_calendar_link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal hover:underline"
            >
              Full Hindu calendar &rarr;
            </a>
          </>
        ) : null}
      </p>

      {festivals.length === 0 ? (
        <p className="text-ink/60">No festivals published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {festivals.map((f) => (
            <FestivalCard key={f.id} festival={f} />
          ))}
        </div>
      )}
    </div>
  );
}
