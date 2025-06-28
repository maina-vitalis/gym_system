"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handleServiceWorkerUpdate = (
        registration: ServiceWorkerRegistration,
      ) => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdatePrompt(true);
        }
      };

      const handleControllerChange = () => {
        // Reload the page when the new service worker takes control
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleControllerChange,
      );

      // Check for existing service worker
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  handleServiceWorkerUpdate(registration);
                }
              });
            }
          });

          // Check if there's already a waiting worker
          if (registration.waiting) {
            handleServiceWorkerUpdate(registration);
          }
        }
      });

      return () => {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleControllerChange,
        );
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting worker to skip waiting and become active
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setShowUpdatePrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 left-4 z-50 md:right-4 md:left-auto md:w-80">
      <div className="bg-card border-border rounded-lg border p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold">Update Available</h3>
            <p className="text-muted-foreground mb-3 text-xs">
              A new version of Tumaini Gym is available. Update now for the
              latest features and improvements.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Update
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                Later
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
