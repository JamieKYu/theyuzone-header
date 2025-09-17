/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'wh-',
  important: false, // Keep false to avoid !important on everything
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disable base styles that could conflict
    preflight: false,
  }
}