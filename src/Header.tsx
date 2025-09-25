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

    // Only run if Next.js router is available
    if (typeof window === 'undefined') return;

    // Check if we're in a Next.js app by looking for Next.js router
    let nextRouter: any = null;
    try {
      // Try to access Next.js router if available
      const { useRouter } = require('next/router') || {};
      if (useRouter) {
        nextRouter = useRouter();
      }
    } catch {
      // Not a Next.js app with pages router, try app router
      try {
        const { usePathname } = require('next/navigation') || {};
        if (usePathname) {
          // We'll track URL changes using a different approach for app router
          let currentPath = window.location.pathname;

          const handleRouteChange = () => {
            if (window.location.pathname !== currentPath) {
              currentPath = window.location.pathname;
              setTimeout(() => trackPageView(), 100); // Small delay to ensure page title is updated
            }
          };

          // Use MutationObserver to detect URL changes in Next.js app router
          const observer = new MutationObserver(handleRouteChange);
          observer.observe(document, { subtree: true, childList: true });

          // Also listen to popstate for back/forward navigation
          window.addEventListener('popstate', handleRouteChange);

          return () => {
            observer.disconnect();
            window.removeEventListener('popstate', handleRouteChange);
          };
        }
      } catch {
        // Not a Next.js app, no route tracking needed
      }
    }

    // For pages router
    if (nextRouter) {
      const handleRouteChange = () => {
        setTimeout(() => trackPageView(), 100); // Small delay to ensure page title is updated
      };

      nextRouter.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        nextRouter.events.off('routeChangeComplete', handleRouteChange);
      };
    }
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
