export interface HeaderConfig {
  alwaysVisible?: boolean;
  title?: string;
  titleHref?: string;
  navigationItems?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

// Server-side function to load config from JSON file
export function loadConfigFromFile(): HeaderConfig | null {
  // Only run on server side and if Node.js modules are available
  if (typeof window !== 'undefined' || typeof require === 'undefined') return null;
  
  const configPath = process.env.HEADER_CONFIG_PATH;
  if (!configPath) return null;
  
  try {
    const fs = require('fs');
    const path = require('path');
    const fullPath = path.resolve(configPath);
    const configData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    return configData;
  } catch (error) {
    console.warn(`Failed to load config from ${configPath}:`, error);
    return null;
  }
}

export function getHeaderConfig(): HeaderConfig {
  // First try to load from JSON file (server-side only)
  const fileConfig = loadConfigFromFile();
  if (fileConfig) return fileConfig;

  // Parse navigation items from environment variable
  const parseNavigationItems = () => {
    if (typeof process === 'undefined' || !process.env) return undefined;
    
    const navItemsStr = process.env.NEXT_PUBLIC_HEADER_NAV_ITEMS;
    if (!navItemsStr) return undefined;
    
    try {
      return JSON.parse(navItemsStr);
    } catch {
      console.warn('Invalid NEXT_PUBLIC_HEADER_NAV_ITEMS format, using defaults');
      return undefined;
    }
  };

  // Handle browser environment gracefully
  if (typeof process === 'undefined' || !process.env) {
    return {};
  }

  return {
    alwaysVisible: process.env.NEXT_PUBLIC_HEADER_ALWAYS_VISIBLE === 'true',
    title: process.env.NEXT_PUBLIC_HEADER_TITLE,
    titleHref: process.env.NEXT_PUBLIC_HEADER_TITLE_HREF,
    navigationItems: parseNavigationItems(),
  };
}