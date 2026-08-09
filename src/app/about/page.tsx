import type { Metadata } from "next";
import { getConfig } from "@/lib/api";
import RichText from "@/components/RichText";

export const metadata: Metadata = { title: "About Us - MMBMA" };

export default async function AboutPage() {
  const config = await getConfig();

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-14">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-teal">
        About Us
      </p>
      <h1 className="mb-8 text-3xl md:text-4xl">
        {config?.org_name || "Montreal Mauritian Bajrang Mandal Association"}
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xl">History</h2>
          {config?.history ? (
            <RichText html={config.history} className="[&_p]:mb-3" />
          ) : (
            <p className="text-ink/50">[History to be added]</p>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xl">Organisation Structure</h2>
          {config?.org_structure ? (
            <RichText html={config.org_structure} className="[&_p]:mb-3" />
          ) : (
            <p className="text-ink/50">[Organisation structure to be added]</p>
          )}
        </section>
      </div>

      {config?.president_message && (
        <section className="mt-10 rounded-brand bg-mist p-6">
          <h2 className="mb-3 text-xl">
            Message from {config.president_name || "the President"}
          </h2>
          <RichText html={config.president_message} className="[&_p]:mb-3" />
        </section>
      )}

      {config?.vision_objectives && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl">Vision &amp; Objectives</h2>
          <RichText html={config.vision_objectives} className="[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5" />
        </section>
      )}

      <section className="mt-14 border-t border-mist pt-10">
        <h2 className="mb-3 text-xl">Contact Us</h2>
        <ul className="space-y-2 text-sm">
          {config?.contact_email && (
            <li>
              Email:{" "}
              <a href={`mailto:${config.contact_email}`} className="text-teal">
                {config.contact_email}
              </a>
            </li>
          )}
          {config?.contact_phone && <li>Phone: {config.contact_phone}</li>}
          {config?.contact_address && <li>Address: {config.contact_address}</li>}
          {!config?.contact_email && !config?.contact_phone && !config?.contact_address && (
            <li className="text-ink/50">[Contact details to be added]</li>
          )}
        </ul>
      </section>
    </div>
  );
}
