import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  Flame,
  HandHeart,
  HeartHandshake,
  Music,
} from "lucide-react";
import { getConfig, getEvents } from "@/lib/api";
import RichText from "@/components/RichText";
import FeaturedEvents from "@/components/FeaturedEvents";
import IconTile from "@/components/IconTile";

const WAYS_TO_PARTICIPATE = [
  {
    label: "Attend",
    icon: Flame,
    text: "Join aarti, bhajans and festival gatherings through the year.",
    href: "/events",
  },
  {
    label: "Learn",
    icon: BookOpen,
    text: "Discover the Mandal's story, values and traditions.",
    href: "/about",
  },
  {
    label: "Chant",
    icon: Music,
    text: "Hanuman Chalisa and Ramcharitmanas chanting, every week.",
    href: "/prayer",
  },
  {
    label: "Volunteer",
    icon: HandHeart,
    text: "Lend a hand with seva, events and prasad.",
    href: "/contact",
  },
  {
    label: "Book",
    icon: CalendarCheck,
    text: "Request a puja or chanting for your family.",
    href: "/prayer",
  },
  {
    label: "Give",
    icon: HeartHandshake,
    text: "Support the Mandal through daan and sponsorship.",
    href: null as string | null,
  },
];

// Internal routes go through next/link, anything absolute (the Odoo-managed
// donation link, mailto:) is a plain anchor.
function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

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

  const orgName = config?.org_name || "Montreal Mauritian Bajrang Mandal Association";
  const joinHref = config?.contact_email ? `mailto:${config.contact_email}` : "/contact";

  return (
    <>
      <section className="on-dark relative isolate overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.webp"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-[1152px] px-6 py-20 md:py-36">
          <p className="font-serif text-lg text-saffron-300">॥ श्री हनुमते नमः ॥</p>
          <h1 className="mt-4 max-w-[720px] text-[38px] leading-[1.1] text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.55)] md:text-[54px]">
            {orgName}
          </h1>
          {config?.welcome_text && (
            <RichText
              html={config.welcome_text}
              className="mt-6 max-w-[640px] text-lg text-saffron-100/90 [&_p]:mb-3"
            />
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/events" className="btn btn-saffron">
              See Upcoming Gatherings
            </Link>
            <SmartLink href={joinHref} className="btn btn-ghost">
              Join the Mandal
            </SmartLink>
            {config?.donation_link && (
              <a
                href={config.donation_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 text-sm font-semibold text-saffron-200 hover:text-white hover:underline"
              >
                Give with purpose &rarr;
              </a>
            )}
          </div>
          <p className="mt-10 font-serif text-2xl text-saffron-300">
            🚩 {config?.tagline || "Jai Bajrang Bali"} 🚩
          </p>
        </div>
      </section>

      <section className="border-b border-saffron-100 bg-white py-20">
        <div className="mx-auto max-w-[1152px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Ways to Participate</p>
            <h2 className="section-title">Find your place in the Mandal</h2>
            <p className="mt-4 text-stone-600">
              Whether you come once a year or every week, there is a way to take part.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WAYS_TO_PARTICIPATE.map((w) => {
              const href = w.label === "Give" ? config?.donation_link || null : w.href;
              const content = (
                <>
                  <IconTile icon={w.icon} variant="solid" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl">{w.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">{w.text}</p>
                  </div>
                  {href && (
                    <ArrowUpRight
                      size={20}
                      className="mt-0.5 shrink-0 text-saffron-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-saffron-600"
                      aria-hidden="true"
                    />
                  )}
                </>
              );
              const className = "card flex items-start gap-4 p-6";
              if (!href) {
                return (
                  <div key={w.label} className={className}>
                    {content}
                  </div>
                );
              }
              return (
                <SmartLink
                  key={w.label}
                  href={href}
                  className={`${className} card-hover group hover:border-saffron-200`}
                >
                  {content}
                </SmartLink>
              );
            })}
          </div>
        </div>
      </section>

      {config?.mission_statement && (
        <section className="py-20">
          <div className="mx-auto grid max-w-[1152px] items-center gap-12 px-6 md:grid-cols-2">
            <div className="relative pb-6">
              <div className="rounded-3xl bg-linear-to-br from-maroon-800 to-saffron-700 p-10 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.2)] md:p-14">
                <IconTile icon={Flame} variant="glass" size="lg" className="mx-auto" />
                <p className="mt-6 font-serif text-2xl leading-snug text-saffron-200">
                  &ldquo;संकट ते हनुमान छुड़ावै, मन क्रम बचन ध्यान जो लावै&rdquo;
                </p>
                <p className="mt-4 text-sm text-saffron-100/80">
                  Hanuman removes all difficulties for those who remember him in thought, word
                  and deed. — Hanuman Chalisa
                </p>
              </div>
              <span className="absolute bottom-0 right-0 rounded-2xl bg-maroon-800 px-6 py-4 text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <span className="font-serif text-[22px]" aria-hidden="true">
                  🚩
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-saffron-300">
                  Sankat Mochan
                </span>
              </span>
            </div>
            <div>
              <p className="eyebrow">Our Mission</p>
              <h2 className="section-title">A home for devotion, far from home</h2>
              <RichText
                html={config.mission_statement}
                className="mt-5 text-stone-600 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
              />
              <Link href="/about" className="btn btn-saffron mt-7">
                Read Our Story &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-linear-to-b from-saffron-50 to-cream py-20">
        <div className="mx-auto max-w-[1152px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Mark Your Calendar</p>
              <h2 className="section-title">Featured Events at MMBMA</h2>
            </div>
            <Link href="/events" className="btn btn-outline">
              View calendar &rarr;
            </Link>
          </div>
          <div className="mt-10">
            {featuredEvents.length === 0 ? (
              <p className="text-stone-500">
                No featured events right now - check the calendar for everything upcoming.
              </p>
            ) : (
              <FeaturedEvents events={featuredEvents} />
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1104px] rounded-3xl bg-linear-to-br from-maroon-800 to-saffron-700 px-6 py-14 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] md:px-14">
          <h2 className="text-3xl text-white md:text-[34px]">
            Become Part of Our Mandal Parivar 🙏
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-saffron-100/90">
            Whether you wish to attend aarti, volunteer for seva, book a prayer or simply learn
            more — we would love to welcome you into our family.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-light">
              Get in Touch
            </Link>
            {config?.donation_link ? (
              <a
                href={config.donation_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Support with Seva / Donation
              </a>
            ) : (
              <Link href="/prayer" className="btn btn-ghost">
                Book a Prayer
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
