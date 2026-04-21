"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const registration = navigator.serviceWorker.register("/sw.js").catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("Service worker registration failed:", err);
      }
      return null;
    });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      void registration;
    };
  }, []);

  return null;
}
