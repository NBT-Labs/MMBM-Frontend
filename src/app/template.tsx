// Unlike layout.tsx, a template re-mounts on every navigation, so each page's
// content (and the loading state before it) gets the short enter animation
// from globals.css (.page-enter).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
