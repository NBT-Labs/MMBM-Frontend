"use client";

import { useCallback, useEffect, useState } from "react";
import { rewriteOdooMediaUrls } from "@/lib/api";

/** RichText that opens clicked images in a full-size lightbox. */
export default function LightboxRichText({
  html,
  className = "",
}: {
  html: string | undefined | null;
  className?: string;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const close = useCallback(() => setLightboxSrc(null), []);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc, close]);

  if (!html) return null;

  return (
    <>
      <div
        className={`prose-mmbm max-w-none [&_img]:cursor-zoom-in [&_img]:rounded-lg ${className}`}
        dangerouslySetInnerHTML={{ __html: rewriteOdooMediaUrls(html) }}
        onClick={(e) => {
          const img = (e.target as HTMLElement).closest("img");
          if (img?.src) {
            e.preventDefault();
            setLightboxSrc(img.src);
          }
        }}
      />

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-900/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/90 text-2xl leading-none text-maroon-800 shadow-md hover:bg-white"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt=""
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
