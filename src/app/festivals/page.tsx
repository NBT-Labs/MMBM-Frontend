import type { Metadata } from "next";
import { getFestivals } from "@/lib/api";
import type { Festival, FestivalCategory } from "@/lib/types";
import RichText from "@/components/RichText";

export const metadata: Metadata = { title: "Festivals - MMBMA" };

const CATEGORY_LABEL: Record<FestivalCategory, string> = {
  major: "Major Festival",
  observance: "Observance / Fast",
  regional: "Regional / Community",
};

const CATEGORY_COLOR: Record<FestivalCategory, string> = {
  major: "#F4B942",
  observance: "#00747A",
  regional: "#F06A5E",
};

function formatDate(iso: string | null) {
  if (!iso) return "[Date to be confirmed]";
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function FestivalCard({ festival }: { festival: Festival }) {
  return (
    <article className="overflow-hidden rounded-brand border border-mist bg-white shadow-sm">
      {festival.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={festival.image_url}
          alt=""
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div
          className="flex aspect-[16/9] w-full items-center justify-center"
          style={{ backgroundColor: CATEGORY_COLOR[festival.category] }}
        >
          <span className="font-display text-4xl font-extrabold text-white/90">
            {formatDate(festival.date).split(" ")[1] /* month, oversized-date flourish */}
          </span>
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-brand px-2 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: CATEGORY_COLOR[festival.category] }}
          >
            {CATEGORY_LABEL[festival.category]}
          </span>
          {festival.verification_status === "awaiting" && (
            <span className="rounded-brand bg-mist px-2 py-1 text-xs font-semibold text-indigo/70">
              Awaiting annual confirmation
            </span>
          )}
        </div>
        <h3 className="mb-1 text-lg">{festival.name}</h3>
        <p className="mb-3 text-sm font-semibold text-ink/70">{formatDate(festival.date)}</p>
        {festival.significance && (
          <RichText html={festival.significance} className="text-sm text-ink/80 [&_p]:mb-2" />
        )}
      </div>
    </article>
  );
}

export default async function FestivalsPage() {
  const festivals = await getFestivals();

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Our Events
      </p>
      <h1 className="mb-2 text-3xl md:text-4xl">Festivals</h1>
      <p className="mb-8 max-w-2xl text-ink/70">
        Verified name, date, meaning and practices for the festivals the Mandal observes.
        Dates are reviewed locally each year - lunar/tithi-based observances can shift, so
        anything still marked &ldquo;awaiting annual confirmation&rdquo; should be
        double-checked closer to the date.
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
