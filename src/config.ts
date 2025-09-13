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

export function getHeaderConfig(): HeaderConfig {
  // Parse navigation items from environment variable
  const parseNavigationItems = () => {
    const navItemsStr = process.env.NEXT_PUBLIC_HEADER_NAV_ITEMS;
    if (!navItemsStr) return undefined;
    
    try {
      return JSON.parse(navItemsStr);
    } catch {
      console.warn('Invalid NEXT_PUBLIC_HEADER_NAV_ITEMS format, using defaults');
      return undefined;
    }
  };

  return {
    alwaysVisible: process.env.NEXT_PUBLIC_HEADER_ALWAYS_VISIBLE === 'true',
    title: process.env.NEXT_PUBLIC_HEADER_TITLE,
    titleHref: process.env.NEXT_PUBLIC_HEADER_TITLE_HREF,
    navigationItems: parseNavigationItems(),
  };
}