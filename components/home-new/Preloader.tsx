"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import { beginPreload, completePreload } from "@/lib/preloader-gate";

const WORDMARK = "Helpperr";
const TEXT_CLASSES =
  "block select-none text-preloader font-extrabold leading-none tracking-tight";

// A single wave period as an inline SVG, tiled horizontally via background-repeat.
const WAVE_SVG = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'><path d='M0 60 Q50 15 100 60 T200 60 V100 H0 Z' fill='white'/></svg>"
)}`;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Layout effects run for the WHOLE tree, before any component's regular
  // effect runs — so this is guaranteed to flip the gate closed before
  // Hero/Reveal/etc. get a chance to start their own entrance animations.
  useLayoutEffect(() => {
    beginPreload();
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      setHidden(true);
      document.body.style.overflow = original;
      completePreload();
    };

    if (prefersReducedMotion()) {
      const t = setTimeout(() => {
        setProgress(100);
        finish();
      }, 150);
      return () => clearTimeout(t);
    }

    const { gsap } = getGsap();
    const counter = { value: 0 };
    const tl = gsap.timeline();

    tl.to(counter, {
      value: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
    })
      .to(rootRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.3,
      })
      .call(finish);

    return () => {
      tl.kill();
      document.body.style.overflow = original;
    };
  }, []);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-page" aria-hidden>
      <div>
        <div className="relative inline-block">
          {/* Empty / unfilled wordmark */}
          <span className={`${TEXT_CLASSES} text-fg/15`}>{WORDMARK}</span>

          {/* Water-filled wordmark: clipped from the bottom up as progress climbs.
              Both the solid fill and the wave riding its edge are real text —
              painted via normal color / background-clip:text respectively —
              so the water never bleeds into the gaps between letters. */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
          >
            <span className={`${TEXT_CLASSES} text-fg`}>{WORDMARK}</span>

            <span
              className={`${TEXT_CLASSES} preloader-wave-mask absolute inset-0 bg-repeat-x bg-clip-text text-transparent`}
              style={{
                backgroundImage: `url("${WAVE_SVG}")`,
                backgroundSize: "11vw 5vw",
                backgroundPositionY: `calc(${100 - progress}% - 2.5vw)`,
              }}
            >
              {WORDMARK}
            </span>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2 text-sm">
          <span className="text-fg-muted/80">loading...</span>
          <span className="font-medium text-fg">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
