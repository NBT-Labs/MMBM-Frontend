import type { Metadata } from "next";
import { getEventLegend, getEvents } from "@/lib/api";
import EventCalendar from "@/components/EventCalendar";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Our Events - MMBMA" };

export default async function EventsPage() {
  const [events, legend] = await Promise.all([getEvents(), getEventLegend()]);

  return (
    <>
      <PageHero eyebrow="Community Calendar" title="Upcoming & Past Gatherings">
        <p>
          Click any event on the calendar for details, including time, location and how to
          join. Colors correspond to the event type - see the legend below the calendar.
        </p>
      </PageHero>

      <section className="py-16">
        <div className="mx-auto max-w-[1152px] px-6">
          {events.length === 0 ? (
            <p className="card text-center text-stone-500">
              No events published yet. Check back soon, or contact us if you&apos;d like to
              suggest one.
            </p>
          ) : (
            <EventCalendar events={events} legend={legend} />
          )}
        </div>
      </section>
    </>
  );
}
