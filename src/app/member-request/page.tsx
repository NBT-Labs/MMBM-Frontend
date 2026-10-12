import type { Metadata } from "next";
import Link from "next/link";
import { Music } from "lucide-react";
import { getConfig } from "@/lib/api";
import MemberRequestForm from "@/components/MemberRequestForm";
import RichText from "@/components/RichText";
import PageHero from "@/components/PageHero";
import IconTile from "@/components/IconTile";

export const metadata: Metadata = { title: "Become a Member - MMBMA" };

const DEFAULT_MEMBER_INTRO =
  "<p>Interested in joining the Mandal? Fill in the form below and a member will reach out to welcome you and confirm the details.</p>";

const DEFAULT_MEMBER_EXPECTATIONS =
  "<ul><li>Submit your request with your contact details and any notes.</li><li>A Mandal member will contact you to confirm and welcome you.</li></ul>";

export default async function MemberRequestPage() {
  const config = await getConfig();

  return (
    <>
      <PageHero eyebrow="Join the Mandal" title="Become a Member">
        <RichText
          html={config?.member_intro || DEFAULT_MEMBER_INTRO}
          className="[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-left"
        />
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-[1152px] gap-12 px-6 md:grid-cols-[2fr_3fr]">
          <div>
            <h2 className="text-[26px]">What to Expect</h2>
            <RichText
              html={config?.member_expectations || DEFAULT_MEMBER_EXPECTATIONS}
              className="mt-3 text-stone-600 [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
            />
            <p className="mt-4 text-stone-600">
              For urgent matters, call{" "}
              {config?.contact_phone ? (
                <span className="font-semibold text-maroon-800">{config.contact_phone}</span>
              ) : (
                <Link href="/contact" className="font-semibold text-saffron-700 hover:underline">
                  us directly
                </Link>
              )}{" "}
              rather than waiting on the form.
            </p>

            {config?.chanting_join_link && (
              <div className="mt-8 rounded-2xl bg-linear-to-br from-maroon-800 to-saffron-700 p-6 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                <IconTile icon={Music} variant="glass" />
                <p className="mt-4 font-serif text-xl text-white">
                  Weekly Ramcharitmanas Chanting
                </p>
                <p className="mt-1 text-sm text-saffron-100/90">
                  Join our regular chanting sessions - no booking required.
                </p>
                <a
                  href={config.chanting_join_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light mt-5 px-5 py-2.5"
                >
                  Join the chanting &rarr;
                </a>
              </div>
            )}

            <p className="mt-8 text-sm text-stone-600">
              Have a general question instead?{" "}
              <Link href="/contact" className="font-semibold text-saffron-700 hover:underline">
                Send us a message
              </Link>
              .
            </p>
          </div>

          <div className="form-box">
            <h2 className="mb-6 text-[26px]">Membership Form</h2>
            <MemberRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
