"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav";
import Logo from "./Logo";

export default function SiteHeader({
  orgName,
  donationLink,
}: {
  orgName: string;
  donationLink: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-saffron-200 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1152px] items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={orgName || "MMBMA"}
          onClick={() => setOpen(false)}
        >
          <Logo />
          {/* Short two-line wordmark from the client's reference site - the full
              Odoo org name is too long to sit next to the nav. */}
          <span aria-hidden="true">
            <span className="block font-serif text-lg font-semibold leading-tight text-maroon-800">
              Bajrang Mandal
            </span>
            <span className="block whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-saffron-600">
              Montreal · Mauritian
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors hover:bg-saffron-100 hover:text-maroon-800 ${
                  active ? "bg-saffron-100 text-maroon-800" : "text-stone-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {donationLink && (
          <a
            href={donationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-saffron hidden shrink-0 whitespace-nowrap px-5 py-2.5 xl:inline-flex"
          >
            Donate (Daan) 🙏
          </a>
        )}

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-saffron-300 text-lg text-maroon-800 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-2 border-t border-saffron-200 px-5 py-3 xl:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[10px] p-3 text-[15px] font-medium hover:bg-saffron-100 hover:text-maroon-800 ${
                pathname === link.href ? "bg-saffron-100 text-maroon-800" : "text-stone-700"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {donationLink && (
            <a
              href={donationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-saffron mt-2 w-fit"
            >
              Donate (Daan) 🙏
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
