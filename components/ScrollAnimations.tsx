"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* The animations start only after the page has loaded and React has finished hydrating it.
   immediateRender: false keeps GSAP from writing inline styles before the start, so the server HTML and the client match. */
export default function ScrollAnimations() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ctx: gsap.Context | undefined;
    let frame = 0;

    const start = () => {
      ctx = gsap.context(() => {
        // Sections: lift + fade in
        gsap.utils.toArray<HTMLElement>(".hero, .modes, .pl, .showcase, .about, .why, .im, .tp, .ct").forEach((sec) => {
          gsap.from(sec, {
            autoAlpha: 0,
            y: 60,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              once: true,
            },
          });
        });

        // Hero-specific pop
        gsap.from(".hero h1, .hero .hero-sub, .hero .hero-actions, .hero .hero-stats", {
          autoAlpha: 0,
          y: 30,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
          immediateRender: false,
        });

        // Headings and key text blocks
        gsap.utils.toArray<HTMLElement>("h2, .im-lead, .im-body, .tp-head p, .ct-in > p").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        });

        // Card grids / list items stagger
        const groups: Array<[string, string]> = [
          [".modes .cards", ".modes .card"],
          [".im-cards", ".im-card"],
          [".tp-grid", ".tp-tile"],
          [".why-list", ".why-list li"],
          [".pl ul", ".pl li"],
        ];
        groups.forEach(([trigger, items]) => {
          const t = document.querySelector(trigger);
          if (!t) return;
          gsap.from(items, {
            autoAlpha: 0,
            y: 36,
            scale: 0.98,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: t,
              start: "top 85%",
              once: true,
            },
          });
        });

        // Footer reveal
        gsap.from(".ft-in > *, .ft-bar", {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".ft",
            start: "top 90%",
            once: true,
          },
        });
      });

      ScrollTrigger.refresh();
    };

    // wait one frame after load so React has finished hydrating before GSAP touches the DOM
    const begin = () => {
      frame = requestAnimationFrame(start);
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", begin);
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, []);

  return null;
}
