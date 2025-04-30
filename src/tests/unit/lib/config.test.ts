import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';
import { getConfig, getAllConfig } from '../../../config/config';

jest.mock('fs');
jest.mock('path');
jest.mock('@iarna/toml');

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

    // Mock path.join to return a fixed path
    (path.join as jest.Mock).mockReturnValue('/mock/path/to/config.toml');
    
    // Mock fs.readFileSync to return mock content
    (fs.readFileSync as jest.Mock).mockReturnValue('mock toml content');
    
    // Mock TOML.parse to return mock config
    (TOML.parse as jest.Mock).mockReturnValue(mockConfig);
  });

  afterEach(() => {
    jest.resetModules();
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

  describe('Error handling', () => {
    test('should handle file read errors', () => {
      // Mock fs.readFileSync to throw an error
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });
      
      // Console.warn is expected to be called
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const configModule = reimportModule();
      
      // Should use default values when file read fails
      const siteTitle = configModule.getConfig('site.title');
      expect(siteTitle).toBe('Coffee Break Point'); // Default value
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should handle parsing errors', () => {
      // Mock TOML.parse to throw an error
      (TOML.parse as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid TOML');
      });
      
      // Console.warn is expected to be called
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const configModule = reimportModule();
      
      // Should use default values when parsing fails
      const siteTitle = configModule.getConfig('site.title');
      expect(siteTitle).toBe('Coffee Break Point'); // Default value
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
