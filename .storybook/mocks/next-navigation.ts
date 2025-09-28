// Mock implementation of next/navigation for Storybook
export const usePathname = () => '/storybook';
export const useSearchParams = () => new URLSearchParams();
export const useRouter = () => ({
  push: (url: string) => console.log(`Mock navigation: push to ${url}`),
  replace: (url: string) => console.log(`Mock navigation: replace with ${url}`),
  back: () => console.log('Mock navigation: back'),
  forward: () => console.log('Mock navigation: forward'),
});