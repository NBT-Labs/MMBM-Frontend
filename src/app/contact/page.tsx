import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Clock } from "lucide-react";
import { getConfig } from "@/lib/api";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { ContactMethodRow, getContactMethods } from "@/components/ContactMethods";

export const metadata: Metadata = { title: "Contact Us - MMBMA" };

export default async function ContactPage() {
  const config = await getConfig();
  const contactMethods = getContactMethods(config);

  return (
    <>
      <PageHero eyebrow="We'd Love to Hear From You" title="Get in Touch">
        <p>
          Questions, membership, volunteering or sponsorships — reach out and a member of our
          parivar will respond.
        </p>
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-[1152px] gap-12 px-6 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow">Reach the Mandal</p>
            <h2 className="section-title">Contact Details</h2>
            <p className="mt-4 text-stone-600">
              Everyone is welcome at our gatherings. Come for darshan, stay for bhajan and
              prasad.
            </p>

            {contactMethods.length > 0 ? (
              <ul className="card mt-8 divide-y divide-saffron-100 overflow-hidden p-0">
                {contactMethods.map((method) => (
                  <li key={method.label}>
                    <ContactMethodRow method={method} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-stone-400">[Contact details to be added]</p>
            )}

            <div className="mt-6 space-y-4 rounded-2xl border border-saffron-100 bg-saffron-50/70 p-5 text-sm text-stone-600">
              <p className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-saffron-600" aria-hidden="true" />
                <span>
                  We aim to respond to messages within a few days. For anything urgent, calling
                  is faster than the form.
                </span>
              </p>
              <p className="flex gap-3">
                <CalendarCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-saffron-600"
                  aria-hidden="true"
                />
                <span>
                  Looking to arrange a Puja or chanting?{" "}
                  <Link
                    href="/prayer"
                    className="inline-flex items-center gap-1 font-semibold text-saffron-700 hover:underline"
                  >
                    Book a prayer
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </span>
              </p>
            </div>
          </div>

          <div className="form-box">
            <h2 className="text-[26px]">Send a Message</h2>
            <p className="mb-6 mt-2 text-sm text-stone-500">
              We usually respond within a few days. Jai Bajrang Bali! 🙏
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
