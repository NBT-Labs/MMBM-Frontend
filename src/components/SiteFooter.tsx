import type { SiteConfig } from "@/lib/types";

export default function SiteFooter({ config }: { config: SiteConfig | null }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-indigo px-6 py-8 text-sm text-white/80">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2">
        <p className="font-display font-bold text-white">
          {config?.org_name || "Montreal Mauritian Bajrang Mandal Association"}
        </p>
        {config?.contact_email && (
          <p>
            <a href={`mailto:${config.contact_email}`} className="text-mist">
              {config.contact_email}
            </a>
          </p>
        )}
        {config?.contact_address && <p>{config.contact_address}</p>}
        <p className="mt-4 text-white/50">
          &copy; {year} {config?.org_name || "MMBMA"}. Faith, culture and community - lived
          together in Montreal.
        </p>
      </div>
    </footer>
  );
}
