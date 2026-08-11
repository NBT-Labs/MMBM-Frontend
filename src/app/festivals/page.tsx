import type { Metadata } from "next";
import { getConfig, getFestivals } from "@/lib/api";
import type { Festival } from "@/lib/types";
import RichText from "@/components/RichText";

export const metadata: Metadata = { title: "Festivals - MMBMA" };

function parseDate(iso: string | null) {
  if (!iso) return null;
  return new Date(`${iso}T12:00:00`);
}

function dayNumber(iso: string | null) {
  const d = parseDate(iso);
  return d ? String(d.getDate()).padStart(2, "0") : "--";
}

function weekday(iso: string | null) {
  const d = parseDate(iso);
  return d ? d.toLocaleDateString(undefined, { weekday: "short" }) : "";
}

function monthYearLabel(iso: string | null, fallbackYear: number | null) {
  const d = parseDate(iso);
  if (!d) return fallbackYear ? String(fallbackYear) : "Date to be confirmed";
  const month = d.toLocaleDateString(undefined, { month: "long" });
  return `${month} ${d.getFullYear()}`;
}

function monthKey(festival: Festival) {
  const d = parseDate(festival.date);
  if (!d) return "unknown";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function groupByMonth(festivals: Festival[]) {
  const groups: { key: string; label: string; items: Festival[] }[] = [];
  for (const festival of festivals) {
    const key = monthKey(festival);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(festival);
    } else {
      groups.push({
        key,
        label: monthYearLabel(festival.date, festival.year),
        items: [festival],
      });
    }
  }
  return groups;
}

function TimelineItem({ festival }: { festival: Festival }) {
  return (
    <li className="relative grid grid-cols-[2rem_1fr] gap-x-3 md:grid-cols-[5.5rem_2rem_1fr] md:gap-x-0">
      <div className="hidden pt-0.5 text-right md:block md:pr-3">
        <p className="font-display text-2xl font-extrabold leading-none text-indigo">
          {dayNumber(festival.date)}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/50">
          {weekday(festival.date)}
        </p>
      </div>
      <div className="relative flex justify-center" aria-hidden="true">
        <span className="absolute inset-y-0 w-0.5 bg-mist" />
        <span className="relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-gold bg-cloud" />
      </div>
      <article className="rounded-brand border border-mist bg-white p-5 md:ml-4 md:p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-base font-bold text-gold md:hidden">
            {dayNumber(festival.date)} {weekday(festival.date)}
          </p>
          <h3 className="text-lg md:text-xl">{festival.name}</h3>
        </div>
        {festival.significance ? (
          <RichText
            html={festival.significance}
            className="mt-2 text-sm text-ink/80 [&_p]:mb-2 [&_p:last-child]:mb-0"
          />
        ) : null}
        {festival.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={festival.image_url}
            alt=""
            className="mt-4 max-h-40 w-full rounded-brand object-cover"
          />
        ) : null}
      </article>
    </li>
  );
}

export default async function FestivalsPage() {
  const [festivals, config] = await Promise.all([getFestivals(), getConfig()]);
  const groups = groupByMonth(festivals);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Hindu Calendar
      </p>
      <h1 className="mb-2 text-3xl md:text-4xl">Festivals</h1>
      <p className="mb-10 max-w-2xl text-ink/70">
        The year&apos;s observances, in order. Name, date, meaning and practices for the
        festivals the Mandal observes.
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
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.key}>
              <h2 className="mb-6 font-display text-sm font-bold uppercase tracking-widest text-teal">
                {group.label}
              </h2>
              <ol className="space-y-2">
                {group.items.map((f) => (
                  <TimelineItem key={f.id} festival={f} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
