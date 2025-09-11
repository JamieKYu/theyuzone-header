"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  alwaysVisible = false,
  title = "the yu zone",
  titleHref = "/",
  navigationItems = [
    { label: "home", href: "/" },
    { label: "photos", href: "/photos", external: true },
    { label: "videos", href: "/videos" },
    { label: "about us", href: "/about" }
  ],
  className = ""
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
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
  }, [alwaysVisible]);

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
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={titleHref} className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              {title}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map(item => renderNavigationItem(item))}
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
              {navigationItems.map(item => renderNavigationItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}