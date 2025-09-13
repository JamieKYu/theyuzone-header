"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getHeaderConfig } from './config';

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
}

export default function Header({
  alwaysVisible,
  title,
  titleHref,
  navigationItems,
  className = ""
}: HeaderProps) {
  const config = getHeaderConfig();

  const finalAlwaysVisible = alwaysVisible ?? config.alwaysVisible ?? false;
  const finalTitle = title ?? config.title ?? "";
  const finalTitleHref = titleHref ?? config.titleHref ?? "/";
  const finalNavigationItems = navigationItems ?? config.navigationItems ?? [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(finalAlwaysVisible);

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
    const baseClassName = `text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
      isMobile ? '' : 'transition-colors'
    }`;

    const handleClick = () => {
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
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={finalTitleHref} className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              {finalTitle}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {finalNavigationItems.map(item => renderNavigationItem(item))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <svg
                className="h-6 w-6"
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
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {finalNavigationItems.map(item => renderNavigationItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
