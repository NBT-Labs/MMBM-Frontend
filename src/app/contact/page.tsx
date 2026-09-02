import type { Metadata } from "next";
import Link from "next/link";
import { getConfig } from "@/lib/api";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact Us - MMBMA" };

export default async function ContactPage() {
  const config = await getConfig();

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        Contact Us
      </p>
      <h1 className="mb-8 text-3xl md:text-4xl">Get in Touch</h1>

      <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
        <section>
          <h2 className="mb-3 text-xl">Contact Details</h2>
          <ul className="space-y-3 text-sm">
            {config?.contact_email && (
              <li>
                <span className="block font-semibold text-indigo">Email</span>
                <a href={`mailto:${config.contact_email}`} className="text-teal">
                  {config.contact_email}
                </a>
              </li>
            )}
            {config?.contact_phone && (
              <li>
                <span className="block font-semibold text-indigo">Phone</span>
                {config.contact_phone}
              </li>
            )}
            {config?.contact_address && (
              <li>
                <span className="block font-semibold text-indigo">Address</span>
                {config.contact_address}
              </li>
            )}
            {!config?.contact_email && !config?.contact_phone && !config?.contact_address && (
              <li className="text-ink/50">[Contact details to be added]</li>
            )}
          </ul>
          <p className="mt-6 text-sm text-ink/70">
            We aim to respond to messages within a few days. For anything urgent, calling
            is faster than the form.
          </p>
          <p className="mt-4 text-sm text-ink/70">
            Looking to arrange a Puja or chanting?{" "}
            <Link href="/prayer" className="text-teal hover:underline">
              Book a prayer
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl">Send a Message</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
