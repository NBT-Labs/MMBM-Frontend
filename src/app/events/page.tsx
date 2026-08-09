import type { Metadata } from "next";
import { getEventLegend, getEvents } from "@/lib/api";
import EventCalendar from "@/components/EventCalendar";

export const metadata: Metadata = { title: "Our Events - MMBMA" };

export default async function EventsPage() {
  const [events, legend] = await Promise.all([getEvents(), getEventLegend()]);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Our Events
      </p>
      <h1 className="mb-2 text-3xl md:text-4xl">Upcoming &amp; Past Gatherings</h1>
      <p className="mb-8 max-w-2xl text-ink/70">
        Click any event on the calendar for details, including time, location and how to
        join. Colors correspond to the event type - see the legend below the calendar.
      </p>

      {events.length === 0 ? (
        <p className="text-ink/60">
          No events published yet. Check back soon, or contact us if you&apos;d like to
          suggest one.
        </p>
      ) : (
        <EventCalendar events={events} legend={legend} />
      )}
    </div>
  );
}
