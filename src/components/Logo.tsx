// Om mark in a saffron-to-maroon circle, per the client's reference site.
export default function Logo({
  className = "h-11 w-11 text-[22px]",
  variant = "gradient",
}: {
  className?: string;
  variant?: "gradient" | "solid";
}) {
  const background =
    variant === "gradient"
      ? "bg-linear-to-br from-saffron-500 to-maroon-700 shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
      : "bg-saffron-500";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full text-white ${background} ${className}`}
      aria-hidden="true"
    >
      🕉️
    </span>
  );
}
