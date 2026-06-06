"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * SWRegistrar
 * Registers the (now minimal safe) service worker ONLY on non-mobile devices.
 * This removes PWA/SW interference on mobile browsers, which was causing
 * the "stuck on loading" and rendering issues on deployed mobile.
 *
 * On desktop, the minimal SW still provides basic PWA capabilities if desired,
 * but without the aggressive caching that broke things.
 */
export function SWRegistrar() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // On mobile: do not register SW at all.
      // Also try to unregister any existing one from previous deploys
      // to fully clean the PWA behavior on mobile.
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().catch(() => {});
          }
        });
      }
      return;
    }

    // Desktop only: register the safe minimal SW
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js", { updateViaCache: "none" })
          .then((registration) => {
            console.log("[PWA] SW registered (desktop only):", registration);
            registration.update().catch(() => {});
          })
          .catch((err) => {
            console.warn("[PWA] SW registration failed (desktop):", err);
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW, { once: true });
      }
    }
  }, [isMobile]);

  return null;
}
