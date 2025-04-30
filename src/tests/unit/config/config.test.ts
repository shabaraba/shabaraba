import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';
import { getConfig, getAllConfig } from '../../../config/config';

jest.mock('fs');
jest.mock('path');
jest.mock('@iarna/toml');

// Mock window object for tests
const originalWindow = global.window;
delete global.window;

describe('config', () => {
  const mockConfig = {
    site: {
      title: 'Test Site Title',
      description: 'Test site description',
      url: 'https://test.example.com',
    },
    home: {
      title: 'Test Home Title',
      subtitle: 'Test home subtitle',
    },
    nested: {
      key1: {
        key2: 'nested value',
      },
    },
  };

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllModules();
    jest.clearAllMocks();

    // Mock require to return mock config
    jest.mock('fs', () => ({
      readFileSync: jest.fn().mockReturnValue('mock toml content'),
    }));
    
    jest.mock('path', () => ({
      join: jest.fn().mockReturnValue('/mock/path/to/config.toml'),
    }));
    
    jest.mock('@iarna/toml', () => ({
      parse: jest.fn().mockReturnValue(mockConfig),
    }));
  });

  afterEach(() => {
    jest.resetModules();
    if (originalWindow) global.window = originalWindow;
  });

  // Re-import to utilize mocks
  function reimportModule() {
    jest.resetModules();
    return require('../../../config/config');
  }

  describe('getConfig', () => {
    test('should get value from the correct path', () => {
      const configModule = reimportModule();
      
      // Get site title
      const siteTitle = configModule.getConfig('site.title');
      expect(siteTitle).toBe('Test Site Title');
      
      // Get home subtitle
      const homeSubtitle = configModule.getConfig('home.subtitle');
      expect(homeSubtitle).toBe('Test home subtitle');
    });

    test('should return default value when path not found', () => {
      const configModule = reimportModule();
      
      // Non-existent path with default value
      const value = configModule.getConfig('non.existent.path', 'default value');
      expect(value).toBe('default value');
    });

    test('should get nested values', () => {
      const configModule = reimportModule();
      
      // Get deeply nested value
      const nestedValue = configModule.getConfig('nested.key1.key2');
      expect(nestedValue).toBe('nested value');
    });

    test('should return undefined when no default and path not found', () => {
      const configModule = reimportModule();
      
      // Non-existent path without default value
      const value = configModule.getConfig('non.existent.path');
      expect(value).toBeUndefined();
    });
  });

  describe('getAllConfig', () => {
    test('should return the entire config object', () => {
      const configModule = reimportModule();
      
      // Get entire config
      const config = configModule.getAllConfig();
      expect(config).toEqual(mockConfig);
    });
  });

  describe('client-side behavior', () => {
    test('should use default config in browser environment', () => {
      // Simulate browser environment
      global.window = {} as any;
      
      const configModule = reimportModule();
      
      // Should use default value in browser
      const siteTitle = configModule.getConfig('site.title');
      expect(siteTitle).toBe('Coffee Break Point'); // Default value
    });
  });
});
