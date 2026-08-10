"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Our Events" },
  { href: "/festivals", label: "Festivals" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Contact Us" },
];

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
    <header className="sticky top-0 z-40 bg-indigo text-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <span className="font-display text-lg font-extrabold leading-tight">
            {orgName || "MMBMA"}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm font-medium transition-colors hover:text-gold ${
                  active ? "text-gold underline underline-offset-8" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {donationLink && (
            <a
              href={donationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-brand bg-gold px-4 py-2 text-sm font-bold text-indigo hover:brightness-95"
            >
              Donate (Daan)
            </a>
          )}
        </nav>

        <button
          type="button"
          className="rounded-brand border border-white/30 px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-6 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium"
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
              className="mt-2 w-fit rounded-brand bg-gold px-4 py-2 text-sm font-bold text-indigo"
            >
              Donate (Daan)
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
