"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("reveal-ready");

    const revealNow = (el: Element) => {
      el.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealNow(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    const observeReveals = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isNearViewport = rect.top < window.innerHeight + 32 && rect.bottom > -32;

        if (isNearViewport) {
          revealNow(el);
          return;
        }

        observer.observe(el);
      });
    };

    observeReveals();

    const handlePageShow = () => observeReveals();
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
