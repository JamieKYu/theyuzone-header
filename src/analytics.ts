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
  console.log(`waitForGAScript: attempt ${31 - maxAttempts}, isScriptLoaded: ${isScriptLoaded}`);

  if (isScriptLoaded) {
    console.log('GA script already loaded, executing callback');
    callback();
    return;
  }

  // Check multiple indicators that GA script has loaded
  const gaExists = !!(window as any).ga;
  const gtagHasQueue = !!(window as any).gtag?.q;
  const dataLayerProcessed = window.dataLayer && window.dataLayer.length > 0 &&
    window.dataLayer.some((item: any) => Array.isArray(item) && item[0] === 'js');

  console.log('GA detection:', { gaExists, gtagHasQueue, dataLayerProcessed });

  if (gaExists || gtagHasQueue || dataLayerProcessed) {
    console.log('GA script detected as loaded via detection logic');
    isScriptLoaded = true;
    callback();
    return;
  }

  if (maxAttempts > 0) {
    setTimeout(() => waitForGAScript(callback, maxAttempts - 1), 200);
  } else {
    console.warn('Google Analytics script failed to load after 6 seconds, executing anyway');
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

  // Initialize Google Analytics immediately (standard approach)
  console.log('🚀 Initializing Google Analytics...');

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
    console.log('✅ GA script loaded');
    isScriptLoaded = true;
  };

  script.onerror = () => {
    console.error('❌ Failed to load Google Analytics script');
  };

  document.head.appendChild(script);

  console.log('📡 Google Analytics script added to page');

  // Mark as initialized after a short delay to allow for processing
  setTimeout(() => {
    isScriptLoaded = true;
    console.log('⚡ Google Analytics marked as ready');
  }, 1000);
  isInitialized = true;
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  console.log('🔍 Making trackPageView call');
  window.gtag('config', currentMeasurementId, {
    page_path: url || window.location.pathname + window.location.search,
    page_title: document.title,
    page_location: window.location.href,
  });
  console.log('📤 trackPageView call made');
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  console.log('🎯 Making trackEvent call:', eventName);
  window.gtag('event', eventName, {
    event_category: 'website-header',
    ...parameters,
  });
  console.log('📤 trackEvent call made:', eventName);
}

export function trackNavigationClick(item: { label: string; href: string; external?: boolean }) {
  trackEvent('navigation_click', {
    event_category: 'navigation',
    event_label: item.label,
    destination: item.href,
    link_type: item.external ? 'external' : 'internal',
  });
}