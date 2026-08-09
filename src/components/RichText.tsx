// Renders Odoo Html-field content. Source is trusted (edited by association
// admins in Odoo), not public user input, so this mirrors the previous
// vanilla frontend's use of innerHTML.
export default function RichText({
  html,
  className = "",
}: {
  html: string | undefined | null;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={`prose-mmbm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
