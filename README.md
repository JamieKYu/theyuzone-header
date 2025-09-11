# @theyuzone/header

A reusable header component for TheYuZone Next.js applications.

## Installation

```bash
npm install @theyuzone/header
```

## Usage

```tsx
import { Header } from '@theyuzone/header';

function App() {
  return (
    <Header
      title="My App"
      navigationItems={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "External Link", href: "https://example.com", external: true }
      ]}
      alwaysVisible={true}
    />
  );
}
```

## Props

- `alwaysVisible?: boolean` - Whether the header should always be visible (default: false)
- `title?: string` - The title/logo text (default: "the yu zone")
- `titleHref?: string` - The href for the title link (default: "/")
- `navigationItems?: NavigationItem[]` - Array of navigation items
- `className?: string` - Additional CSS classes

## NavigationItem

- `label: string` - The display text
- `href: string` - The URL to navigate to
- `external?: boolean` - Whether this is an external link (uses <a> instead of Next.js Link)