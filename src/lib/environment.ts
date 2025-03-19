/**
 * Utility to determine the current environment
 */

// Check if we are in a static build context (Next.js static site generation)
export const isStaticBuild = (): boolean => {
  return process.env.NODE_ENV === 'production' && typeof window === 'undefined';
};

// Check if we are in a browser context
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};