import { ArrowUpRight, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { SiteConfig } from "@/lib/types";
import IconTile from "./IconTile";

export interface ContactMethod {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

// The Mandal's contact details from Odoo, in display order. Email and phone
// get mailto:/tel: links so they're one tap away on a phone.
export function getContactMethods(config: SiteConfig | null): ContactMethod[] {
  const methods: ContactMethod[] = [];
  if (config?.contact_email) {
    methods.push({
      icon: Mail,
      label: "Email",
      value: config.contact_email,
      href: `mailto:${config.contact_email}`,
    });
  }
  if (config?.contact_phone) {
    methods.push({
      icon: Phone,
      label: "Phone",
      value: config.contact_phone,
      href: `tel:${config.contact_phone.replace(/[^\d+]/g, "")}`,
    });
  }
  if (config?.contact_address) {
    methods.push({ icon: MapPin, label: "Address", value: config.contact_address });
  }
  return methods;
}

function Body({ method }: { method: ContactMethod }) {
  return (
    <>
      <IconTile icon={method.icon} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">
          {method.label}
        </p>
        <p className="mt-0.5 break-words font-medium text-maroon-900">{method.value}</p>
      </div>
      {method.href && (
        <ArrowUpRight
          size={18}
          className="shrink-0 text-saffron-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-saffron-600"
          aria-hidden="true"
        />
      )}
    </>
  );
}

// Standalone card (About page grid).
export function ContactMethodCard({ method }: { method: ContactMethod }) {
  const className = "card flex items-center gap-4 p-5";
  return method.href ? (
    <a href={method.href} className={`${className} card-hover group hover:border-saffron-200`}>
      <Body method={method} />
    </a>
  ) : (
    <div className={className}>
      <Body method={method} />
    </div>
  );
}

// Row inside a divided list card (Contact page).
export function ContactMethodRow({ method }: { method: ContactMethod }) {
  const className = "flex items-center gap-4 p-5";
  return method.href ? (
    <a href={method.href} className={`${className} group transition-colors hover:bg-saffron-50/70`}>
      <Body method={method} />
    </a>
  ) : (
    <div className={className}>
      <Body method={method} />
    </div>
  );
}
