"use client";

// Google Analytics gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface GoogleAnalyticsConfig {
  measurementId: string;
}

let isInitialized = false;
let currentMeasurementId: string | null = null;
let isScriptLoaded = false;

// Helper function to wait for GA script to be loaded
function waitForGAScript(callback: () => void, maxAttempts = 50) {
  if (isScriptLoaded) {
    callback();
    return;
  }

  // Check if the real gtag script has loaded by checking if window.ga or window.gtag.d exists
  if ((window as any).ga || (window as any).gtag?.q) {
    isScriptLoaded = true;
    callback();
    return;
  }

  if (maxAttempts > 0) {
    setTimeout(() => waitForGAScript(callback, maxAttempts - 1), 100);
  } else {
    console.warn('Google Analytics script failed to load after 5 seconds');
    // Call anyway to put events in dataLayer
    callback();
  }
}

export function initializeGoogleAnalytics(config: GoogleAnalyticsConfig) {
  // Prevent multiple initializations with the same measurement ID
  if (isInitialized && currentMeasurementId === config.measurementId) {
    return;
  }

  // Only initialize on client side
  if (typeof window === 'undefined') {
    return;
  }

  const { measurementId } = config;
  currentMeasurementId = measurementId;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  // Wait for script to load before making initial config calls
  script.onload = () => {
    isScriptLoaded = true;
    // Configure Google Analytics after script loads
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
    console.log('Google Analytics script loaded and configured');
  };

  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };

  document.head.appendChild(script);
  isInitialized = true;
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  waitForGAScript(() => {
    window.gtag('config', currentMeasurementId, {
      page_path: url || window.location.pathname + window.location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  });
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  waitForGAScript(() => {
    window.gtag('event', eventName, {
      event_category: 'website-header',
      ...parameters,
    });
  });
}

export function trackNavigationClick(item: { label: string; href: string; external?: boolean }) {
  trackEvent('navigation_click', {
    event_category: 'navigation',
    event_label: item.label,
    destination: item.href,
    link_type: item.external ? 'external' : 'internal',
  });
}