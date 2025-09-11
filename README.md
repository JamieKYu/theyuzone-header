# @jamiekyu/theyuzone-header

A reusable header component for TheYuZone Next.js applications.

## Installation

```bash
npm install @jamiekyu/theyuzone-header
```

## Usage

```tsx
import Header from '@jamiekyu/theyuzone-header';

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