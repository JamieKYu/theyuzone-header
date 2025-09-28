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
  // Look for Google Analytics global object or enhanced gtag function
  const gtagIsReal = window.gtag && typeof window.gtag === 'function' && window.gtag.toString().length > 100;
  const gaExists = !!(window as any).ga;
  const gtagObjectExists = !!(window as any).gtag && (window as any).gtag.l;

  // Only consider GA loaded when we have the real gtag function OR the ga object OR gtag with .l property
  if (gtagIsReal || gaExists || gtagObjectExists) {
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

  // Validate measurement ID format
  if (!measurementId || !measurementId.startsWith('G-')) {
    console.error('[GA] Invalid measurement ID:', measurementId);
    return;
  }

  console.log('[GA] Initializing with measurement ID:', measurementId);
  currentMeasurementId = measurementId;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Configure Google Analytics
  window.gtag('js', new Date());

  // Configure with localhost debugging enabled
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const configOptions: any = {
    page_title: document.title,
    page_location: window.location.href,
  };

  // Override localhost settings to force GA to work in development
  if (isLocalhost) {
    configOptions.debug_mode = true;
    configOptions.send_page_view = true;
    // Override the page_location to use a fake domain for localhost testing
    configOptions.page_location = window.location.href.replace('localhost:3002', 'theyuzone.com');
  }

  // Enhanced config for proper GA4 data collection
  const finalConfig = {
    ...configOptions,
    // Ensure data collection is enabled
    send_page_view: true,
    transport_type: 'beacon',
    // Force enable tracking
    anonymize_ip: false,
    allow_ad_personalization_signals: true,
    allow_google_signals: true,
    cookie_flags: 'SameSite=None;Secure'
  };

  window.gtag('config', measurementId, finalConfig);
  console.log('[GA] Config applied:', finalConfig);

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  script.onload = () => {
    // Give GA more time to initialize properly
    setTimeout(() => {
      isScriptLoaded = true;
    }, 500);
  };

  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };

  document.head.appendChild(script);

  // Backup timer - mark as loaded after longer delay
  setTimeout(() => {
    if (!isScriptLoaded) {
      isScriptLoaded = true;
    }
  }, 2000);
  isInitialized = true;
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('[GA] trackPageView failed - window or gtag not available');
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

  console.log('[GA] Attempting to track page view:', pageData);

  // Wait for GA script to load before sending page view
  waitForGAScript(() => {
    console.log('[GA] GA script ready, sending page view');

    // Apply localhost override for page_location if needed
    const eventData: any = {
      page_title: pageData.page_title,
      page_location: pageData.page_location,
      page_path: pageData.page_path
    };

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      eventData.page_location = eventData.page_location.replace(/localhost:\d+/, 'theyuzone.com');
      console.log('[GA] Applied localhost override');
    }

    // Verify gtag function before sending
    console.log('[GA] gtag function type:', typeof window.gtag);
    console.log('[GA] gtag function source:', window.gtag.toString().substring(0, 100));

    // Use the proper GA4 page_view event format
    console.log('[GA] Sending gtag event:', eventData);
    window.gtag('event', 'page_view', eventData);

    // Also try sending a test event to verify tracking
    window.gtag('event', 'test_event', {
      event_category: 'debug',
      event_label: 'ga_tracking_test'
    });

    // Check dataLayer after event
    setTimeout(() => {
      console.log('[GA] DataLayer length after event:', window.dataLayer?.length);
      console.log('[GA] Recent dataLayer entries:', window.dataLayer?.slice(-3));
    }, 1000);
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