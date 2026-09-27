import Logo from "@/components/Logo";

// Shown right away while a page's Odoo data loads (every page fetches fresh
// data on each request), so clicking a link never looks like nothing
// happened. Header and footer stay in place around it.
export default function Loading() {
  return (
    <div
      role="status"
      className="loader-delayed flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 py-24"
    >
      <span className="relative grid place-items-center p-2" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border-[3px] border-saffron-200 border-t-saffron-600 motion-safe:animate-spin" />
        <Logo />
      </span>
      <p className="font-serif text-lg text-maroon-800">Loading…</p>
    </div>
  );
}
