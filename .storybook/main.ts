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
        'process.env': '{}',
        process: {
          env: {},
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