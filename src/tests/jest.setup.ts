import '@testing-library/jest-dom';

// グローバルなモックの設定
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Next.js のナビゲーションをモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// 警告を抑制
const originalWarn = console.warn;
console.warn = (...args) => {
  // React 18 の Strict Mode 警告を抑制
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('ReactDOM.render') || 
       args[0].includes('unstable_flushDiscreteUpdates'))) {
    return;
  }
  originalWarn(...args);
};
