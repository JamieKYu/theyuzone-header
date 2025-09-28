"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getHeaderConfig } from './config';
import { initializeGoogleAnalytics, trackPageView, trackNavigationClick } from './analytics';

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeaderProps {
  alwaysVisible?: boolean;
  title?: string;
  titleHref?: string;
  navigationItems?: NavigationItem[];
  className?: string;
  googleAnalytics?: {
    measurementId: string;
  };
}

export default function Header({
  alwaysVisible,
  title,
  titleHref,
  navigationItems,
  className = "",
  googleAnalytics
}: HeaderProps) {
  const config = getHeaderConfig();

  const finalAlwaysVisible = alwaysVisible ?? config.alwaysVisible ?? false;
  const finalTitle = title ?? config.title ?? "";
  const finalTitleHref = titleHref ?? config.titleHref ?? "/";
  const finalNavigationItems = navigationItems ?? config.navigationItems ?? [];
  const finalGoogleAnalytics = googleAnalytics ?? config.googleAnalytics;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(finalAlwaysVisible);

  // Initialize Google Analytics
  useEffect(() => {
    if (finalGoogleAnalytics?.measurementId) {
      initializeGoogleAnalytics(finalGoogleAnalytics);
      // Track initial page view
      trackPageView();
    }
  }, [finalGoogleAnalytics?.measurementId]);

  // Track route changes for Next.js apps
  useEffect(() => {
    if (!finalGoogleAnalytics?.measurementId) return;
    if (typeof window === 'undefined') return;

    let currentPath = window.location.pathname + window.location.search;
    let cleanup: (() => void) | undefined;

    // Enhanced route change detection for App Router
    const handleRouteChange = () => {
      const newPath = window.location.pathname + window.location.search;
      if (newPath !== currentPath) {
        currentPath = newPath;
        // Use a longer delay to ensure page content and title are updated
        setTimeout(() => trackPageView(), 150);
      }
    };

    // Method 1: Listen to Next.js App Router navigation events
    // Next.js App Router dispatches custom events during navigation
    const handleNextNavigation = () => {
      setTimeout(() => handleRouteChange(), 50);
    };

    // Method 2: Enhanced popstate listener for browser navigation
    const handlePopState = () => {
      setTimeout(() => handleRouteChange(), 50);
    };

    // Method 3: Observe DOM changes that indicate route changes
    // This catches cases where the URL changes without triggering other events
    const observer = new MutationObserver((mutations) => {
      // Only check for route changes if there were significant DOM changes
      const hasSignificantChanges = mutations.some(mutation =>
        mutation.type === 'childList' && mutation.addedNodes.length > 0
      );
      if (hasSignificantChanges) {
        setTimeout(() => handleRouteChange(), 100);
      }
    });

    // Method 4: Periodically check for URL changes as fallback
    const urlCheckInterval = setInterval(() => {
      handleRouteChange();
    }, 1000);

    try {
      // Listen for Next.js navigation events (works in both Pages and App Router)
      window.addEventListener('beforeunload', handleRouteChange);
      window.addEventListener('popstate', handlePopState);

      // Listen for custom navigation events that Next.js might dispatch
      window.addEventListener('navigationstart', handleNextNavigation);
      window.addEventListener('navigationend', handleNextNavigation);

      // Start observing DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        // Observe attribute changes that might indicate route changes
        attributes: true,
        attributeFilter: ['data-pathname', 'data-route']
      });

      cleanup = () => {
        window.removeEventListener('beforeunload', handleRouteChange);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('navigationstart', handleNextNavigation);
        window.removeEventListener('navigationend', handleNextNavigation);
        observer.disconnect();
        clearInterval(urlCheckInterval);
      };
    } catch (error) {
      console.warn('Route tracking setup failed:', error);
      // Fallback to just the interval check
      cleanup = () => clearInterval(urlCheckInterval);
    }

    return cleanup;
  }, [finalGoogleAnalytics?.measurementId]);

  useEffect(() => {
    if (finalAlwaysVisible) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      setIsVisible(scrollPosition > heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [finalAlwaysVisible]);

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const baseClassName = `wh-no-underline wh-text-gray-700 hover:wh-text-gray-900 wh-px-3 wh-py-2 wh-text-sm wh-font-medium ${
      isMobile ? '' : 'wh-transition-colors'
    }`;

    const handleClick = () => {
      // Track navigation click
      if (finalGoogleAnalytics?.measurementId) {
        trackNavigationClick(item);
      }

      if (isMobile) {
        setIsMenuOpen(false);
      }
    };

    if (item.external) {
      return (
        <a
          key={item.href}
          href={item.href}
          className={baseClassName}
          onClick={handleClick}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={baseClassName}
        onClick={handleClick}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className={`wh-fixed wh-top-0 wh-left-0 wh-right-0 wh-z-50 wh-bg-white wh-shadow-sm wh-border-b wh-border-gray-200 wh-transition-transform wh-duration-300 ${
      isVisible ? 'wh-translate-y-0' : 'wh--translate-y-full'
    } ${className}`}>
      <div className="wh-max-w-7xl wh-mx-auto wh-px-4 sm:wh-px-6 lg:wh-px-8">
        <div className="wh-flex wh-justify-between wh-items-center wh-h-16">
          {/* Logo */}
          <div className="wh-flex-shrink-0">
            <Link
              href={finalTitleHref}
              className="wh-no-underline wh-text-2xl wh-font-bold wh-text-gray-900 hover:wh-text-gray-700"
              onClick={() => {
                if (finalGoogleAnalytics?.measurementId) {
                  trackNavigationClick({
                    label: finalTitle || 'Logo',
                    href: finalTitleHref,
                    external: false
                  });
                }
              }}
            >
              {finalTitle}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="wh-hidden md:wh-flex wh-space-x-8">
            {finalNavigationItems.map(item => renderNavigationItem(item))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:wh-hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="wh-bg-transparent wh-border-0 wh-text-gray-700 hover:wh-text-gray-900 wh-p-2"
            >
              <svg
                className="wh-h-6 wh-w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:wh-hidden wh-border-t wh-border-solid wh-border-gray-200 wh-pt-4 wh-pb-4">
            <div className="wh-flex wh-flex-col wh-space-y-2">
              {finalNavigationItems.map(item => renderNavigationItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
