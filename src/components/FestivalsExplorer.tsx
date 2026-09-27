"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import type { Festival } from "@/lib/types";
import { MANDAL_LOCALE } from "@/lib/datetime";
import RichText from "./RichText";

// "upcoming" (default): today onwards. "year": every festival of one year,
// past ones included, with a month overview. Switching happens client-side
// (instant, no refetch); the URL (?view=year&year=YYYY) is kept in sync so
// a given view can still be linked to or reloaded.
export type View = "upcoming" | "year";
type Status = "past" | "next" | "upcoming";

// Formatting uses the fixed MANDAL_LOCALE: this renders on the server and
// hydrates in the browser, and both must produce the same text.
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
  return d ? d.toLocaleDateString(MANDAL_LOCALE, { weekday: "short" }) : "";
}

function monthYearLabel(iso: string | null, fallbackYear: number | null) {
  const d = parseDate(iso);
  if (!d) return fallbackYear ? `Date to be confirmed · ${fallbackYear}` : "Date to be confirmed";
  const month = d.toLocaleDateString(MANDAL_LOCALE, { month: "long" });
  return `${month} ${d.getFullYear()}`;
}

function monthKey(festival: Festival) {
  const d = parseDate(festival.date);
  if (!d) return "unknown";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// todayAt: index in `items` before which the "Today" marker goes (items.length = after the last).
type MonthGroup = { key: string; label: string; items: Festival[]; todayAt?: number };

function groupByMonth(festivals: Festival[]) {
  const groups: MonthGroup[] = [];
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

// Puts the "Today" marker in date order: inside today's month if it has
// festivals, otherwise as its own month section between the others.
function placeToday(groups: MonthGroup[], today: string): MonthGroup[] {
  const key = today.slice(0, 7);
  const month = groups.find((g) => g.key === key);
  if (month) {
    const i = month.items.findIndex((f) => f.date !== null && f.date >= today);
    month.todayAt = i === -1 ? month.items.length : i;
    return groups;
  }
  // "unknown" (undated) sorts after every "YYYY-MM" key, so it stays last.
  const at = groups.findIndex((g) => g.key > key);
  const todayGroup: MonthGroup = { key, label: monthYearLabel(today, null), items: [], todayAt: 0 };
  return at === -1 ? [...groups, todayGroup] : [...groups.slice(0, at), todayGroup, ...groups.slice(at)];
}

function festivalYear(festival: Festival) {
  return festival.date ? Number(festival.date.slice(0, 4)) : festival.year;
}

// Date order, undated ("to be confirmed") festivals last.
function byDate(a: Festival, b: Festival) {
  if (!a.date || !b.date) return (a.date ? 0 : 1) - (b.date ? 0 : 1);
  return a.date.localeCompare(b.date);
}

// The requested year if there's data for it, else this year, else the next
// year with festivals, else the latest one.
function pickYear(years: number[], requested: number | null, currentYear: number) {
  if (requested !== null && years.includes(requested)) return requested;
  if (years.includes(currentYear)) return currentYear;
  return years.find((y) => y > currentYear) ?? years[years.length - 1] ?? currentYear;
}

function hrefFor(view: View, year: number) {
  return view === "year" ? `/festivals?view=year&year=${year}` : "/festivals";
}

function TimelineItem({
  festival,
  status,
  isToday,
}: {
  festival: Festival;
  status: Status;
  isToday: boolean;
}) {
  const past = status === "past";
  const next = status === "next";
  const dot = past
    ? "border-stone-300 bg-cream"
    : next
      ? "border-saffron-500 bg-saffron-500 ring-4 ring-saffron-100"
      : "border-saffron-500 bg-cream";

  return (
    <li
      className={`relative grid grid-cols-[2rem_1fr] gap-x-3 md:grid-cols-[5.5rem_2rem_1fr] md:gap-x-0 ${
        past ? "opacity-60" : ""
      }`}
    >
      <div className="hidden pt-0.5 text-right md:block md:pr-3">
        <p
          className={`font-serif text-3xl font-semibold leading-none ${
            past ? "text-stone-400" : "text-maroon-800"
          }`}
        >
          {dayNumber(festival.date)}
        </p>
        <p
          className={`mt-1 text-xs font-semibold uppercase tracking-wider ${
            past ? "text-stone-400" : "text-saffron-600"
          }`}
        >
          {weekday(festival.date)}
        </p>
      </div>
      <div className="relative flex justify-center" aria-hidden="true">
        <span className="absolute inset-y-0 w-0.5 bg-saffron-200" />
        <span className={`relative z-10 mt-2 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] ${dot}`} />
      </div>
      <article
        className={`card p-5 md:ml-4 md:p-6 ${past ? "" : "card-hover"} ${
          next ? "border-saffron-300 ring-2 ring-saffron-100" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p
            className={`text-sm font-semibold uppercase tracking-wider md:hidden ${
              past ? "text-stone-400" : "text-saffron-600"
            }`}
          >
            {dayNumber(festival.date)} {weekday(festival.date)}
          </p>
          <h3 className="text-lg md:text-xl">{festival.name}</h3>
          {next && <span className="tag tag-maroon">{isToday ? "★ Today" : "★ Next up"}</span>}
          {past && <span className="tag bg-stone-100 text-stone-500">Past</span>}
        </div>
        {festival.significance ? (
          <RichText
            html={festival.significance}
            className="mt-2 text-sm text-stone-600 [&_p]:mb-2 [&_p:last-child]:mb-0"
          />
        ) : null}
        {festival.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={festival.image_url}
            alt=""
            className="mt-4 max-h-40 w-full rounded-xl object-cover"
          />
        ) : null}
      </article>
    </li>
  );
}

// Where "today" falls in the full-year timeline. The label is assembled from
// the long month name because short month names differ between ICU versions
// ("Sep" vs "Sept"), which would break hydration.
function TodayMarker({ today }: { today: string }) {
  const month = parseDate(today)?.toLocaleDateString(MANDAL_LOCALE, { month: "long" }) ?? "";
  const label = `${weekday(today)}, ${month.slice(0, 3)} ${Number(today.slice(8, 10))}`;
  return (
    <li className="relative grid grid-cols-[2rem_1fr] gap-x-3 md:grid-cols-[5.5rem_2rem_1fr] md:gap-x-0">
      <p className="hidden self-center pr-3 text-right text-xs font-bold uppercase tracking-wider text-saffron-600 md:block">
        Today
      </p>
      <div className="relative flex justify-center" aria-hidden="true">
        <span className="absolute inset-y-0 w-0.5 bg-saffron-200" />
        <span className="relative z-10 my-3 h-2.5 w-2.5 rounded-full bg-saffron-600 ring-4 ring-saffron-100" />
      </div>
      <div className="flex items-center gap-3 md:ml-4">
        <span className="h-0 flex-1 border-t-2 border-dashed border-saffron-300" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wider text-saffron-600">
          <span className="md:hidden">Today · </span>
          {label}
        </span>
      </div>
    </li>
  );
}

// 12 month tiles for the selected year: festival count per month, each one
// jumping to that month's section of the timeline.
function YearOverview({
  year,
  festivals,
  today,
}: {
  year: number;
  festivals: Festival[];
  today: string;
}) {
  const counts = Array.from({ length: 12 }, () => 0);
  for (const f of festivals) {
    if (f.date) counts[Number(f.date.slice(5, 7)) - 1] += 1;
  }
  const currentMonth = today.slice(0, 7);

  return (
    <nav
      aria-label={`Festivals in ${year}, by month`}
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
    >
      {counts.map((count, i) => {
        const key = `${year}-${String(i + 1).padStart(2, "0")}`;
        const month = new Date(year, i, 1).toLocaleDateString(MANDAL_LOCALE, { month: "long" });
        const isCurrent = key === currentMonth;
        const className = `rounded-xl border px-3 py-2.5 text-center transition-colors ${
          isCurrent
            ? "border-saffron-400 bg-saffron-50 ring-2 ring-saffron-200"
            : "border-saffron-100 bg-white"
        } ${key < currentMonth ? "opacity-60" : ""}`;
        const content = (
          <>
            <span className="block text-xs font-semibold uppercase tracking-wider text-saffron-600">
              {month.slice(0, 3)}
            </span>
            <span className="mt-0.5 block font-serif text-xl text-maroon-800">
              {count || <span aria-hidden="true">–</span>}
            </span>
          </>
        );
        if (!count) {
          return (
            <div key={key} className={`${className} text-stone-400`}>
              {content}
              <span className="sr-only">no festivals</span>
            </div>
          );
        }
        return (
          <a
            key={key}
            href={`#month-${key}`}
            aria-label={`${month}: ${count} festival${count > 1 ? "s" : ""}`}
            className={`${className} hover:border-saffron-300 hover:bg-saffron-50`}
          >
            {content}
          </a>
        );
      })}
    </nav>
  );
}

export default function FestivalsExplorer({
  festivals,
  today,
  initialView,
  requestedYear,
}: {
  festivals: Festival[];
  /** Today in Montreal, "YYYY-MM-DD" - computed once on the server. */
  today: string;
  initialView: View;
  requestedYear: number | null;
}) {
  const currentYear = Number(today.slice(0, 4));
  const sorted = useMemo(() => [...festivals].sort(byDate), [festivals]);
  const years = useMemo(
    () =>
      [...new Set(sorted.map(festivalYear).filter((y): y is number => typeof y === "number"))].sort(
        (a, b) => a - b
      ),
    [sorted]
  );

  const [view, setView] = useState<View>(initialView);
  const [selectedYear, setSelectedYear] = useState(() =>
    pickYear(years, requestedYear, currentYear)
  );

  // Plain clicks switch instantly in place; modified clicks (new tab/window)
  // fall through to the link's real URL.
  function show(e: React.MouseEvent<HTMLAnchorElement>, nextView: View, nextYear: number) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setView(nextView);
    setSelectedYear(nextYear);
    window.history.replaceState(null, "", hrefFor(nextView, nextYear));
  }

  const prevYear = [...years].reverse().find((y) => y < selectedYear);
  const nextYear = years.find((y) => y > selectedYear);

  const upcoming = sorted.filter((f) =>
    f.date ? f.date >= today : (f.year ?? currentYear) >= currentYear
  );
  const yearFestivals = sorted.filter((f) => festivalYear(f) === selectedYear);
  const list = view === "year" ? yearFestivals : upcoming;
  const showToday = view === "year" && selectedYear === currentYear && list.length > 0;
  const groups = showToday ? placeToday(groupByMonth(list), today) : groupByMonth(list);

  // The next dated festival from today on, highlighted in both views.
  const nextFestival = sorted.find((f) => f.date && f.date >= today);

  const statusOf = (f: Festival): Status =>
    f.id === nextFestival?.id ? "next" : f.date && f.date < today ? "past" : "upcoming";

  const tabClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      active ? "bg-maroon-800 text-white" : "text-maroon-800/70 hover:bg-white hover:text-maroon-800"
    }`;
  const countClass = (active: boolean) =>
    `ml-0.5 rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-saffron-100"}`;
  const yearButtonClass =
    "rounded-full border border-saffron-300 px-3 py-1.5 transition-colors hover:bg-saffron-100";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav
          aria-label="Festival views"
          className="flex gap-1 rounded-full bg-saffron-50 p-1 ring-1 ring-saffron-100"
        >
          <Link
            href={hrefFor("upcoming", selectedYear)}
            prefetch={false}
            onClick={(e) => show(e, "upcoming", selectedYear)}
            aria-current={view === "upcoming" ? "page" : undefined}
            className={tabClass(view === "upcoming")}
          >
            Upcoming{" "}
            <span className={countClass(view === "upcoming")}>{upcoming.length}</span>
          </Link>
          <Link
            href={hrefFor("year", selectedYear)}
            prefetch={false}
            onClick={(e) => show(e, "year", selectedYear)}
            aria-current={view === "year" ? "page" : undefined}
            className={tabClass(view === "year")}
          >
            Full year {selectedYear}{" "}
            <span className={countClass(view === "year")}>{yearFestivals.length}</span>
          </Link>
        </nav>

        {view === "year" && (prevYear || nextYear) && (
          <div className="flex items-center gap-2 text-sm font-semibold text-maroon-800">
            {prevYear ? (
              <Link
                href={hrefFor("year", prevYear)}
                prefetch={false}
                onClick={(e) => show(e, "year", prevYear)}
                className={yearButtonClass}
              >
                &larr; {prevYear}
              </Link>
            ) : null}
            {nextYear ? (
              <Link
                href={hrefFor("year", nextYear)}
                prefetch={false}
                onClick={(e) => show(e, "year", nextYear)}
                className={yearButtonClass}
              >
                {nextYear} &rarr;
              </Link>
            ) : null}
          </div>
        )}
      </div>

      {/* Keyed on the view so switching re-mounts it and it fades in. */}
      <div key={`${view}-${selectedYear}`} className="fade-in">
        {view === "year" && (
          <div className="mt-8">
            <YearOverview year={selectedYear} festivals={yearFestivals} today={today} />
          </div>
        )}

        {list.length === 0 ? (
          <div className="card mt-10 text-center text-stone-500">
            {view === "year" ? (
              <p>No festivals published for {selectedYear} yet.</p>
            ) : (
              <p>
                No upcoming festivals published yet.{" "}
                <Link
                  href={hrefFor("year", selectedYear)}
                  prefetch={false}
                  onClick={(e) => show(e, "year", selectedYear)}
                  className="font-semibold text-saffron-700 hover:underline"
                >
                  See the full year &rarr;
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {groups.map((group) => (
              <section key={group.key} id={`month-${group.key}`} className="scroll-mt-28">
                <h2 className="eyebrow mb-6 font-sans">{group.label}</h2>
                <ol className="space-y-2">
                  {group.items.map((f, i) => (
                    <Fragment key={f.id}>
                      {group.todayAt === i && <TodayMarker today={today} />}
                      <TimelineItem festival={f} status={statusOf(f)} isToday={f.date === today} />
                    </Fragment>
                  ))}
                  {group.todayAt === group.items.length && <TodayMarker today={today} />}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
