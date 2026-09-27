import type { LucideIcon } from "lucide-react";

const BOX = {
  sm: "h-10 w-10 rounded-lg",
  md: "h-12 w-12 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
};
const GLYPH = { sm: 18, md: 22, lg: 26 };
const TONE = {
  solid:
    "bg-linear-to-br from-saffron-500 to-maroon-700 text-white shadow-[0_6px_16px_rgba(124,45,18,0.25)]",
  soft: "bg-saffron-50 text-saffron-700 ring-1 ring-saffron-100",
  glass: "bg-white/15 text-white ring-1 ring-white/25",
};

// A line icon in a rounded tile - the site's icon language. (Emoji render
// differently on every device and clash with the palette.)
// solid: saffron-to-maroon, for headline features. soft: light, for lists.
// glass: translucent white, for maroon/gradient backgrounds.
export default function IconTile({
  icon: Icon,
  variant = "soft",
  size = "md",
  className = "",
}: {
  icon: LucideIcon;
  variant?: keyof typeof TONE;
  size?: keyof typeof BOX;
  className?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center ${BOX[size]} ${TONE[variant]} ${className}`}
      aria-hidden="true"
    >
      <Icon size={GLYPH[size]} strokeWidth={1.75} />
    </span>
  );
}
