import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Network, Quote, Sunrise } from "lucide-react";
import { getConfig } from "@/lib/api";
import RichText from "@/components/RichText";
import PageHero from "@/components/PageHero";
import IconTile from "@/components/IconTile";
import { ContactMethodCard, getContactMethods } from "@/components/ContactMethods";

export const metadata: Metadata = { title: "About Us - MMBMA" };

export default async function AboutPage() {
  const config = await getConfig();
  const contactMethods = getContactMethods(config);
  const hasBoth = Boolean(config?.president_message && config?.vision_objectives);

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={config?.org_name || "Montreal Mauritian Bajrang Mandal Association"}
      >
        <p>
          Rooted in Mauritian Hindu heritage, flourishing in Montreal through the grace of
          Bajrang Bali.
        </p>
      </PageHero>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1152px] items-start gap-12 px-6 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div>
            <p className="eyebrow">Who We Are</p>
            <h2 className="section-title">History</h2>
            <div className="mt-6 border-l-2 border-saffron-200 pl-6">
              {config?.history ? (
                <RichText
                  html={config.history}
                  className="text-stone-600 [&_p]:mb-4 [&_p:first-child]:font-serif [&_p:first-child]:text-xl [&_p:first-child]:leading-relaxed [&_p:first-child]:text-maroon-800"
                />
              ) : (
                <p className="text-stone-400">[History to be added]</p>
              )}
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center gap-4">
              <IconTile icon={Network} variant="solid" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">
                  How we&apos;re run
                </p>
                <h3 className="text-2xl">Organisation Structure</h3>
              </div>
            </div>
            <div className="mt-6 border-t border-saffron-100 pt-6">
              {config?.org_structure ? (
                <RichText
                  html={config.org_structure}
                  className="list-check text-stone-600 [&_p]:mb-4"
                />
              ) : (
                <p className="text-stone-400">[Organisation structure to be added]</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {(config?.president_message || config?.vision_objectives) && (
        <section className="border-y border-saffron-100 bg-white py-20">
          <div
            className={`mx-auto grid max-w-[1152px] items-start gap-6 px-6 ${
              hasBoth ? "lg:grid-cols-[7fr_5fr]" : ""
            }`}
          >
            {config?.president_message && (
              <figure className="relative overflow-hidden rounded-3xl border border-saffron-100 bg-linear-to-br from-saffron-50 to-white p-8 md:p-12">
                <Quote
                  size={140}
                  strokeWidth={1}
                  className="absolute -right-4 -top-6 text-saffron-200/60"
                  aria-hidden="true"
                />
                <p className="eyebrow relative">A Word of Welcome</p>
                <h2 className="relative mt-2 text-3xl">Message from the President</h2>
                <blockquote className="relative mt-6">
                  <RichText
                    html={config.president_message}
                    className="font-serif text-lg leading-relaxed text-stone-700 [&_p]:mb-4"
                  />
                </blockquote>
                <figcaption className="relative mt-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-saffron-400" aria-hidden="true" />
                  <span>
                    <span className="block font-serif text-lg font-semibold text-maroon-800">
                      {config.president_name || "The President"}
                    </span>
                    <span className="block text-xs uppercase tracking-wider text-stone-500">
                      President
                    </span>
                  </span>
                </figcaption>
              </figure>
            )}

            {config?.vision_objectives && (
              <div className="card p-8 md:p-10">
                <IconTile icon={Sunrise} variant="solid" />
                <h3 className="mt-5 text-2xl">Vision &amp; Objectives</h3>
                <p className="mt-1 text-sm text-stone-500">What the Mandal is working towards.</p>
                <div className="mt-6 border-t border-saffron-100 pt-6">
                  <RichText
                    html={config.vision_objectives}
                    className="list-check text-stone-600 [&_p]:mb-4"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="mx-auto max-w-[1152px] px-6">
          <div className="text-center">
            <p className="eyebrow">Reach the Mandal</p>
            <h2 className="section-title">Contact Us</h2>
          </div>
          {contactMethods.length > 0 ? (
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {contactMethods.map((method) => (
                <li key={method.label}>
                  <ContactMethodCard method={method} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-center text-stone-400">[Contact details to be added]</p>
          )}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="page-hero mx-auto max-w-[1104px] rounded-3xl px-6 py-16 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] md:py-20">
          <Quote
            size={96}
            strokeWidth={1}
            className="absolute left-6 top-6 text-saffron-300/20 md:left-10 md:top-10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[720px]">
            <p className="font-serif text-[26px] leading-snug text-saffron-200 md:text-3xl">
              &ldquo;संकट ते हनुमान छुड़ावै, मन क्रम बचन ध्यान जो लावै&rdquo;
            </p>
            <span className="mx-auto mt-8 block h-px w-12 bg-saffron-300/50" aria-hidden="true" />
            <p className="mt-6 text-saffron-100/85">
              Hanuman removes all difficulties for those who remember him in thought, word and
              deed.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-saffron-300">
              Hanuman Chalisa
            </p>
            <Link href="/contact" className="btn btn-saffron mt-10">
              Join Our Community
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
