import type { StorybookConfig } from '@storybook/react-vite';
import { defineConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    return {
      ...config,
      define: {
        ...config.define,
        global: 'globalThis',
        'process.env': JSON.stringify({
          NEXT_PUBLIC_HEADER_ALWAYS_VISIBLE: 'true',
          NEXT_PUBLIC_HEADER_TITLE: 'my website',
          NEXT_PUBLIC_HEADER_TITLE_HREF: '/',
          NEXT_PUBLIC_HEADER_NAV_ITEMS: JSON.stringify([
            { label: "home", href: "/" },
            { label: "about us", href: "/about" }
          ])
        }),
        process: {
          env: {
            NEXT_PUBLIC_HEADER_ALWAYS_VISIBLE: 'true',
            NEXT_PUBLIC_HEADER_TITLE: 'my website',
            NEXT_PUBLIC_HEADER_TITLE_HREF: '/',
            NEXT_PUBLIC_HEADER_NAV_ITEMS: JSON.stringify([
              { label: "home", href: "/" },
              { label: "about us", href: "/about" }
            ])
          },
        },
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'next/link': require.resolve('./mocks/next-link.jsx'),
        },
      },
    };
  },
};
export default config;
