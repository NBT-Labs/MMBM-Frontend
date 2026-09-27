import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import type { SiteConfig } from "@/lib/types";
import { NAV_LINKS } from "@/lib/nav";
import { getContactMethods } from "./ContactMethods";
import Logo from "./Logo";

export default function SiteFooter({ config }: { config: SiteConfig | null }) {
  const year = new Date().getFullYear();
  const orgName = config?.org_name || "Montreal Mauritian Bajrang Mandal Association";

  return (
    <footer className="bg-linear-to-b from-maroon-800 to-maroon-900 text-saffron-100">
      <div className="mx-auto grid max-w-[1152px] gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo variant="solid" />
            <span className="font-serif text-xl text-white">{orgName}</span>
          </div>
          <p className="mt-4 max-w-[460px] text-sm text-saffron-100/80">
            A devotional Hindu community in Montreal rooted in Mauritian heritage, dedicated to
            the seva and worship of Shri Hanuman ji — Bajrang Bali.
          </p>
          <p className="mt-6 font-serif text-lg text-saffron-300">
            ॐ जय हनुमान · Jai Bajrang Bali
          </p>
        </div>

        <div>
          <h3 className="font-sans text-[13px] uppercase tracking-wider text-saffron-300">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-saffron-100/80">
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-[13px] uppercase tracking-wider text-saffron-300">
            Reach Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-saffron-100/80">
            {getContactMethods(config).map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-3">
                <Icon size={16} className="mt-0.5 shrink-0 text-saffron-300" aria-hidden="true" />
                {href ? (
                  <a href={href} className="break-words hover:text-white">
                    {value}
                  </a>
                ) : (
                  <span>{value}</span>
                )}
              </li>
            ))}
            {config?.donation_link && (
              <li className="flex gap-3">
                <HeartHandshake
                  size={16}
                  className="mt-0.5 shrink-0 text-saffron-300"
                  aria-hidden="true"
                />
                <a
                  href={config.donation_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Donate / Seva
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-white/10 px-5 py-5 text-center text-xs text-saffron-100/60 sm:flex-row sm:justify-center sm:gap-3">
        <p>&copy; {year} {orgName}</p>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <p>
          Designed and powered by{" "}
          <a
            href="https://www.nbtlabs.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-200 hover:text-white"
          >
            NBT Labs
          </a>{" "}
          through{" "}
          <a
            href="https://www.odoo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-200 hover:text-white"
          >
            Odoo
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
