// The "Confluence MM" mark: two rounded M paths (teal + coral) meeting at a
// gold diamond node. Simplified inline SVG per the brand identity's
// construction guardrails (no Om/lotus/arch/flag additions).
export default function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <path
        d="M4 44 L18 8 L32 30 L46 8 L60 44"
        fill="none"
        stroke="#F06A5E"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 44 L18 8 L32 30 L46 8 L60 44"
        fill="none"
        stroke="#00747A"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="52 200"
        transform="translate(0,0)"
      />
      <circle cx="32" cy="30" r="4" fill="#F4B942" />
    </svg>
  );
}
