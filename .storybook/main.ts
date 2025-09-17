import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';

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
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/link': require.resolve('./mocks/next-link.tsx'),
    };

    // Ensure TS/TSX are resolved
    config.resolve.extensions = Array.from(
      new Set([...(config.resolve.extensions || []), '.ts', '.tsx'])
    );

    // Add a rule to handle TypeScript files in stories and preview
    config.module = config.module || { rules: [] } as any;
    config.module.rules = [
      ...(config.module.rules || []),
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: { transpileOnly: true },
          },
        ],
      },
    ];

    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_HEADER_ALWAYS_VISIBLE': JSON.stringify('true'),
        'process.env.NEXT_PUBLIC_HEADER_TITLE': JSON.stringify('my website'),
        'process.env.NEXT_PUBLIC_HEADER_TITLE_HREF': JSON.stringify('/'),
        'process.env.NEXT_PUBLIC_HEADER_NAV_ITEMS': JSON.stringify(
          JSON.stringify([
            { label: 'home', href: '/' },
            { label: 'about us', href: '/about' },
          ])
        ),
      })
    );

    return config;
  },
};
export default config;
