import type { Metadata } from "next";
import Link from "next/link";
import { getConfig } from "@/lib/api";
import PrayerBookingForm from "@/components/PrayerBookingForm";
import RichText from "@/components/RichText";

export const metadata: Metadata = { title: "Book a Prayer - MMBMA" };

const DEFAULT_PRAYER_INTRO =
  "<p>Whether you'd like to arrange a Puja, Hanuman Chalisa, or Ramcharitmanas chanting, fill in the form below and a member of the Mandal will reach out to confirm the details.</p>";

const DEFAULT_PRAYER_EXPECTATIONS =
  "<ul><li>Submit your request with your preferred date and any special notes.</li><li>A Mandal member will contact you to confirm availability and arrangements.</li></ul>";

export default async function PrayerPage() {
  const config = await getConfig();

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Book a Prayer
      </p>
      <h1 className="mb-4 text-3xl md:text-4xl">Request a Prayer</h1>
      <RichText
        html={config?.prayer_intro || DEFAULT_PRAYER_INTRO}
        className="mb-8 max-w-2xl text-ink/80 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
      />

      <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
        <section>
          <h2 className="mb-3 text-xl">What to Expect</h2>
          <RichText
            html={config?.prayer_expectations || DEFAULT_PRAYER_EXPECTATIONS}
            className="mb-3 text-sm text-ink/80 [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
          />
          <ul className="space-y-3 text-sm text-ink/80">
            <li>
              For urgent matters, call{" "}
              {config?.contact_phone ? (
                <span className="font-semibold text-indigo">{config.contact_phone}</span>
              ) : (
                <Link href="/contact" className="text-teal hover:underline">
                  us directly
                </Link>
              )}{" "}
              rather than waiting on the form.
            </li>
          </ul>

          {config?.chanting_join_link && (
            <div className="mt-6 rounded-brand bg-mist p-4 text-sm">
              <p className="font-semibold text-indigo">Weekly Ramcharitmanas Chanting</p>
              <p className="mt-1 text-ink/80">
                Join our regular chanting sessions - no booking required.
              </p>
              <a
                href={config.chanting_join_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-display text-sm font-bold text-teal hover:underline"
              >
                Join the chanting &rarr;
              </a>
            </div>
          )}

          <p className="mt-6 text-sm text-ink/70">
            Have a general question instead?{" "}
            <Link href="/contact" className="text-teal hover:underline">
              Send us a message
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl">Prayer Request Form</h2>
          <PrayerBookingForm />
        </section>
      </div>
    </div>
  );
}
