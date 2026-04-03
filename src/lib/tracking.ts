interface TrackParams {
  [key: string]: string;
}

export function trackEvent(eventName: string, params?: TrackParams) {
  const payload: TrackParams = {
    ...params,
    source: params?.source || "landing",
    page: params?.page || "home",
    offre: params?.offre || "site-48h",
    timestamp: new Date().toISOString(),
  };

  // gtag (Google Analytics 4)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  // dataLayer (GTM)
  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload });
  }

  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log("[track]", eventName, payload);
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}
