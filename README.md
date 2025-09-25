# @jamiekyu/website-header

A reusable header component for Next.js applications.

## Installation

```bash
npm install @jamiekyu/website-header
```

## Usage

### Method 1: With Pre-compiled CSS (Recommended)

This method requires no Tailwind CSS configuration on the consumer side:

```tsx
import { Header } from '@jamiekyu/website-header';
import '@jamiekyu/website-header/dist/header.css';

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

### Method 2: Environment Variables (Automatic Configuration)

For even simpler usage, you can configure the header via environment variables in your Next.js config:

```tsx
// Just import and use - no props needed!
import { Header } from '@jamiekyu/website-header';
import '@jamiekyu/website-header/dist/header.css';

function App() {
  return <Header />;
}
```

The header will automatically read from these environment variables:
- `NEXT_PUBLIC_HEADER_ALWAYS_VISIBLE`
- `NEXT_PUBLIC_HEADER_TITLE`
- `NEXT_PUBLIC_HEADER_TITLE_HREF`
- `NEXT_PUBLIC_HEADER_NAV_ITEMS`
- `NEXT_PUBLIC_HEADER_GA_MEASUREMENT_ID` - Google Analytics measurement ID

### Method 3: With Your Own Tailwind CSS

If you already use Tailwind CSS and want to customize the styling, you can include the header component in your Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@jamiekyu/website-header/dist/**/*.{js,jsx,ts,tsx}'
  ],
  // ... rest of your config
}
```

Then use without importing CSS:

```tsx
import { Header } from '@jamiekyu/website-header';

function App() {
  return <Header title="My App" />;
}
```

## Props

- `alwaysVisible?: boolean` - Whether the header should always be visible (default: false)
- `title?: string` - The title/logo text (default: "the yu zone")
- `titleHref?: string` - The href for the title link (default: "/")
- `navigationItems?: NavigationItem[]` - Array of navigation items
- `className?: string` - Additional CSS classes
- `googleAnalytics?: { measurementId: string }` - Google Analytics configuration

## NavigationItem

- `label: string` - The display text
- `href: string` - The URL to navigate to
- `external?: boolean` - Whether this is an external link (uses <a> instead of Next.js Link)

## Google Analytics Integration

The header component includes optional Google Analytics support for tracking user interactions. When enabled, it will:

- Initialize Google Analytics with your measurement ID
- Track page views on component mount
- Track clicks on navigation items and the logo/title
- Categorize events under 'website-header' for easy filtering

### Configuration Options

#### Option 1: Via Props
```tsx
<Header
  title="My App"
  googleAnalytics={{ measurementId: "G-XXXXXXXXXX" }}
  navigationItems={[...]}
/>
```

#### Option 2: Via Environment Variable
Set the following environment variable:
```bash
NEXT_PUBLIC_HEADER_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Option 3: Via JSON Configuration File
Add to your `header-config.json`:
```json
{
  "title": "My App",
  "googleAnalytics": {
    "measurementId": "G-XXXXXXXXXX"
  }
}
```

### Tracked Events

The component automatically tracks these events:

1. **Page Load** - Tracked when the header component mounts
2. **Navigation Clicks** - Tracked when users click on navigation items with details:
   - Event name: `navigation_click`
   - Event category: `navigation`
   - Event label: Navigation item label
   - Destination: Link href
   - Link type: `internal` or `external`

3. **Logo Clicks** - Tracked when users click on the title/logo

## Development

### Running Storybook

To view and test the header component in Storybook:

```bash
# Install dependencies
npm install

# Start Storybook development server
npm run storybook
```

This will start Storybook at `http://localhost:6006` where you can:
- View different header configurations
- Test responsive behavior
- Interact with component props
- Test scroll-based visibility

### Building the Package

```bash
# Build TypeScript to JavaScript
npm run build

# Watch for changes during development
npm run dev
```

### Publishing to NPM

To publish a new version to npm:

1. **Update the version** in `package.json`:
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. **Build the package**:
   ```bash
   npm run build
   ```

3. **Publish to npm**:
   ```bash
   npm publish
   ```

   Or if you need to publish with a specific access level:
   ```bash
   npm publish --access public
   ```

### Scripts

- `npm run build` - Build the TypeScript package
- `npm run dev` - Watch for changes and rebuild
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for deployment
