import type { Metadata } from "next";
import "./globals.css";
import { getBannerAnnouncement, getConfig } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export const metadata: Metadata = {
  title: "MMBMA - Montreal Mauritian Bajrang Mandal Association",
  description: "Tradition in motion. Faith, culture and community - lived together in Montreal.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, announcement] = await Promise.all([getConfig(), getBannerAnnouncement()]);

  return (
    <html
      lang="en"
      className="h-full"
      // Browser extensions (Dark Reader, Grammarly, etc.) inject attributes
      // like data-darkreader-mode onto <html> after the initial paint, which
      // otherwise trips React's hydration mismatch warning even though
      // nothing is actually broken.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <AnnouncementBanner announcement={announcement} />
        <SiteHeader
          orgName={config?.org_name || "MMBMA"}
          donationLink={config?.donation_link || ""}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter config={config} />
      </body>
    </html>
  );
}
