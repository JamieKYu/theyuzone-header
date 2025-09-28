// Mock implementation of next/router for Storybook
export const useRouter = () => ({
  events: {
    on: (event: string, callback: () => void) => {
      // Mock router events - in Storybook, we'll manually trigger page views
      console.log(`Mock router: listening for ${event}`);
    },
    off: (event: string, callback: () => void) => {
      console.log(`Mock router: stopped listening for ${event}`);
    },
  },
  pathname: '/storybook',
  query: {},
  push: (url: string) => console.log(`Mock router: push to ${url}`),
  replace: (url: string) => console.log(`Mock router: replace with ${url}`),
});