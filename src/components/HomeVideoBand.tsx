"use client";

import { useEffect, useRef } from "react";

// Full-bleed ambient reel below the still hero. Starts only when scrolled into
// view; pauses when it leaves. Honors prefers-reduced-motion.
export default function HomeVideoBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setPlaying = (shouldPlay: boolean) => {
      if (reduceMotion.matches || !shouldPlay) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        /* Autoplay can still be blocked; poster stays visible. */
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.35, rootMargin: "0px" },
    );

    observer.observe(section);

    const onMotionChange = () => {
      const visible =
        section.getBoundingClientRect().top < window.innerHeight &&
        section.getBoundingClientRect().bottom > 0;
      setPlaying(visible && !reduceMotion.matches);
    };
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", onMotionChange);
      video.pause();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[min(52vh,560px)] min-h-[260px] overflow-hidden"
      aria-label="Scenes from MMBMA community gatherings"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/mmbm-anim.mp4"
        poster="/hero.webp"
        muted
        loop
        playsInline
        preload="metadata"
      />
    </section>
  );
}
