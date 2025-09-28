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
    console.log('📊 [GA Debug] Already initialized with same measurement ID');
    return;
  }

  // Only initialize on client side
  if (typeof window === 'undefined') {
    console.log('📊 [GA Debug] Not on client side, skipping initialization');
    return;
  }

  console.log('📊 [GA Debug] Initializing Google Analytics with:', config);

  const { measurementId } = config;
  currentMeasurementId = measurementId;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];
  console.log('📊 [GA Debug] DataLayer initialized, current length:', window.dataLayer.length);

  // Define gtag function
  window.gtag = function gtag(...args: any[]) {
    console.log('📊 [GA Debug] gtag called with:', args);
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

  console.log('📊 [GA Debug] Loading GA script:', script.src);

  script.onload = () => {
    console.log('📊 [GA Debug] GA script loaded successfully');
    setTimeout(() => {
      isScriptLoaded = true;
      console.log('📊 [GA Debug] Script marked as loaded');
    }, 100);
  };

  script.onerror = () => {
    console.error('📊 [GA Debug] Failed to load Google Analytics script');
  };

  document.head.appendChild(script);

  // Mark as initialized after a short delay to allow for processing
  setTimeout(() => {
    isScriptLoaded = true;
    console.log('📊 [GA Debug] Backup script loaded flag set');
  }, 1000);
  isInitialized = true;
  console.log('📊 [GA Debug] Initialization complete');
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('📊 [GA Debug] trackPageView called but gtag not available', { window: typeof window, gtag: !!window.gtag });
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

  console.log('📊 [GA Debug] Attempting to track page view:', pageData);
  console.log('📊 [GA Debug] GA state:', { isScriptLoaded, currentMeasurementId, dataLayerLength: window.dataLayer?.length });

  // Wait for GA script to load before sending page view
  waitForGAScript(() => {
    console.log('📊 [GA Debug] Sending page view config to GA');
    window.gtag('config', currentMeasurementId, pageData);
    console.log('📊 [GA Debug] DataLayer after page view:', window.dataLayer.slice(-3));
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