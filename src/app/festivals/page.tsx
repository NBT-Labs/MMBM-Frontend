import type { Metadata } from "next";
import { getConfig, getFestivals } from "@/lib/api";
import { todayInMandal } from "@/lib/datetime";
import PageHero from "@/components/PageHero";
import FestivalsExplorer from "@/components/FestivalsExplorer";

export const metadata: Metadata = { title: "Festivals - MMBMA" };

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FestivalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, festivals, config] = await Promise.all([
    searchParams,
    getFestivals(),
    getConfig(),
  ]);
  const requestedYear = Number(firstParam(params.year));

  return (
    <>
      <PageHero eyebrow="Hindu Calendar" title="Festivals">
        <p>
          The year&apos;s observances, in order. Name, date, meaning and practices for the
          festivals the Mandal observes.
        </p>
        {config?.hindu_calendar_link ? (
          <a
            href={config.hindu_calendar_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            Full Hindu calendar &rarr;
          </a>
        ) : null}
      </PageHero>

      <section className="py-16">
        <div className="mx-auto max-w-[880px] px-6">
          {festivals.length === 0 ? (
            <p className="card text-center text-stone-500">
              No festivals published yet. Check back soon.
            </p>
          ) : (
            <FestivalsExplorer
              festivals={festivals}
              today={todayInMandal()}
              initialView={firstParam(params.view) === "year" ? "year" : "upcoming"}
              requestedYear={Number.isFinite(requestedYear) ? requestedYear : null}
            />
          )}
        </div>
      </section>
    </>
  );
}
