import { renderHook } from '@testing-library/react-hooks';
import { useConfig } from '../../../config/useConfig';
import * as configModule from '../../../config/config';

jest.mock('../../../config/config', () => ({
  getConfig: jest.fn(),
}));

describe('useConfig hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getSetting should call getConfig with correct arguments', () => {
    // Mock implementation
    const mockGetConfig = configModule.getConfig as jest.Mock;
    mockGetConfig.mockImplementation((path, defaultValue) => {
      if (path === 'test.path') return 'test value';
      return defaultValue;
    });

    // Render hook
    const { result } = renderHook(() => useConfig());
    
    // Call getSetting with test path
    const value = result.current.getSetting('test.path', 'default value');
    
    // Verify calls to getConfig
    expect(mockGetConfig).toHaveBeenCalledWith('test.path', 'default value');
    expect(value).toBe('test value');
  });

  test('getSetting should return default value when config value is not found', () => {
    // Mock implementation to return default value
    const mockGetConfig = configModule.getConfig as jest.Mock;
    mockGetConfig.mockImplementation((path, defaultValue) => defaultValue);

    // Render hook
    const { result } = renderHook(() => useConfig());
    
    // Call getSetting with path that doesn't exist
    const value = result.current.getSetting('non.existent.path', 'default value');
    
    // Verify default value is returned
    expect(mockGetConfig).toHaveBeenCalledWith('non.existent.path', 'default value');
    expect(value).toBe('default value');
  });

  test('getSetting should handle different types of default values', () => {
    // Mock implementation to return default value
    const mockGetConfig = configModule.getConfig as jest.Mock;
    mockGetConfig.mockImplementation((path, defaultValue) => defaultValue);

    // Render hook
    const { result } = renderHook(() => useConfig());
    
    // Test with string
    const stringValue = result.current.getSetting<string>('test.string', 'string value');
    expect(stringValue).toBe('string value');
    
    // Test with number
    const numberValue = result.current.getSetting<number>('test.number', 42);
    expect(numberValue).toBe(42);
    
    // Test with boolean
    const boolValue = result.current.getSetting<boolean>('test.bool', true);
    expect(boolValue).toBe(true);
    
    // Test with object
    const objValue = result.current.getSetting<{ key: string }>('test.obj', { key: 'value' });
    expect(objValue).toEqual({ key: 'value' });
  });
});
