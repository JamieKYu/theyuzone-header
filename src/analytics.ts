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
function waitForGAScript(callback: () => void, maxAttempts = 30) {
  if (isScriptLoaded) {
    callback();
    return;
  }

  // Check if the real GA gtag function is loaded (not our initial stub)
  // The real GA gtag function is much more complex than our simple stub
  const gtagIsReal = window.gtag && window.gtag.toString().length > 100 && !window.gtag.toString().includes('function gtag');
  const gaExists = !!(window as any).ga;

  // Only consider GA loaded when we have the real gtag function OR the ga object
  if (gtagIsReal || gaExists) {
    isScriptLoaded = true;
    callback();
    return;
  }

  if (maxAttempts > 0) {
    setTimeout(() => waitForGAScript(callback, maxAttempts - 1), 200);
  } else {
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

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
  });

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  script.onload = () => {
    setTimeout(() => {
      isScriptLoaded = true;
    }, 100);
  };

  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };

  document.head.appendChild(script);

  // Mark as initialized after a short delay to allow for processing
  setTimeout(() => {
    isScriptLoaded = true;
  }, 1000);
  isInitialized = true;
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  const pageData = {
    page_path: url || window.location.pathname + window.location.search,
    page_title: document.title,
    page_location: window.location.href,
  };

  // Check if we're in Storybook environment
  const isStorybook = window.location.href.includes('iframe.html') && window.location.href.includes('localhost');

  if (isStorybook) {
    console.log('📊 [Storybook] Page View:', pageData);
    return;
  }

  // Wait for GA script to load before sending page view
  waitForGAScript(() => {
    window.gtag('config', currentMeasurementId, pageData);
  });
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Check if we're in Storybook environment
  const isStorybook = window.location.href.includes('iframe.html') && window.location.href.includes('localhost');

  if (isStorybook) {
    console.log('📊 [Storybook] Event:', eventName, parameters);
    return;
  }

  // Wait for GA script to load before sending events
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