// Maroon banner at the top of every inner page (eyebrow, title, intro).
export default function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero on-dark px-6 py-16 text-center text-white md:py-20">
      <div className="relative mx-auto max-w-[760px]">
        <p className="font-serif text-[13px] font-semibold uppercase tracking-[0.25em] text-saffron-300">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl text-white md:text-[44px] md:leading-tight">{title}</h1>
        {children && <div className="mt-5 text-saffron-100/85">{children}</div>}
      </div>
    </section>
  );
}
