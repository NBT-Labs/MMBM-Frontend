import Link from "next/link";
import { getConfig, getEvents } from "@/lib/api";
import RichText from "@/components/RichText";
import FeaturedEvents from "@/components/FeaturedEvents";

const WAYS_TO_PARTICIPATE = [
  { label: "Attend", color: "bg-teal" },
  { label: "Learn", color: "bg-coral" },
  { label: "Chant", color: "bg-gold" },
  { label: "Volunteer", color: "bg-teal" },
  { label: "Book", color: "bg-coral" },
  { label: "Give", color: "bg-gold" },
];

export default async function HomePage() {
  const [config, events] = await Promise.all([getConfig(), getEvents()]);

  // Featured events only - set in Odoo, capped at 3 there. Whoever manages
  // content controls exactly what shows here by checking/unchecking
  // "Featured" on events, rather than it being an automatic "next 3" list.
  const byDate = (a: (typeof events)[number], b: (typeof events)[number]) =>
    (a.date_start || "").localeCompare(b.date_start || "");
  const featuredEvents = events
    .filter((e) => e.is_featured && !e.is_past)
    .sort(byDate)
    .slice(0, 3);

  return (
    <>
      <section className="meeting-lines-bg border-b-4 border-coral">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-teal">
              Welcome to {config?.org_name?.split(" ")[0] || "MMBMA"}
            </p>
            <h1 className="text-4xl leading-tight md:text-5xl">
              {config?.tagline || "Tradition in motion."}
            </h1>
            {config?.welcome_text && (
              <RichText
                html={config.welcome_text}
                className="mt-4 text-base text-ink/80 [&_p]:mb-3"
              />
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="rounded-brand bg-gold px-5 py-3 font-display text-sm font-bold text-indigo hover:brightness-95"
              >
                See Upcoming Gatherings
              </Link>
              <a
                href={config?.contact_email ? `mailto:${config.contact_email}` : "/about"}
                className="rounded-brand bg-indigo px-5 py-3 font-display text-sm font-bold text-white hover:brightness-110"
              >
                Join the Mandal
              </a>
              {config?.donation_link && (
                <a
                  href={config.donation_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-2 font-display text-sm font-bold text-teal hover:underline"
                >
                  Give with purpose &rarr;
                </a>
              )}
            </div>

            <div className="mt-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/60">
                Ways to Participate
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {WAYS_TO_PARTICIPATE.map((w) => (
                  <span key={w.label} className="flex items-center gap-2 text-sm">
                    <span className={`h-3 w-3 rounded-sm ${w.color}`} />
                    {w.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] w-full rounded-brand bg-mist" aria-hidden="true" />
        </div>
      </section>

      {config?.mission_statement && (
        <section className="bg-indigo px-6 py-14 text-white">
          <div className="mx-auto max-w-[1280px]">
            <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-gold">
              Our Mission
            </p>
            <RichText
              html={config.mission_statement}
              className="text-lg text-white/90 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
            />
            <Link
              href="/about"
              className="mt-6 inline-block font-display text-sm font-bold text-gold hover:underline"
            >
              Read more about us &rarr;
            </Link>
          </div>
        </section>
      )}

      <section className="px-6 py-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl">Featured Events at MMBMA</h2>
            <Link href="/events" className="font-display text-sm font-bold text-teal hover:underline">
              View calendar &rarr;
            </Link>
          </div>
          {featuredEvents.length === 0 ? (
            <p className="text-ink/60">
              No featured events right now - check the calendar for everything upcoming.
            </p>
          ) : (
            <FeaturedEvents events={featuredEvents} />
          )}
        </div>
      </section>
    </>
  );
}
