import React from 'react';
import { render, renderHook } from '@testing-library/react';
import useConfig from '../../lib/useConfig';
import * as configModule from '../../lib/config';

// configモジュールのモック
jest.mock('../../lib/config', () => ({
  getConfig: jest.fn(),
  getAllConfig: jest.fn(),
}));

// customHookをテストするためのラッパー関数
function renderCustomHook<T>(hook: () => T): { result: { current: T }, rerender: () => void } {
  let value: T;
  
  // hookの戻り値を保持するコンポーネント
  function TestComponent() {
    value = hook();
    return null;
  }
  
  // コンポーネントをレンダリング
  const { rerender } = render(<TestComponent />);
  
  // 再レンダリング関数
  const rerenderHook = () => {
    rerender(<TestComponent />);
  };
  
  return {
    result: { current: value! },
    rerender: rerenderHook
  };
}

describe('useConfig Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSetting メソッドが getConfig を呼び出すこと', () => {
    // モックの戻り値を設定
    (configModule.getConfig as jest.Mock).mockReturnValue('Test Value');
    
    // フックをレンダリング
    const { result } = renderCustomHook(() => useConfig());
    
    // getSetting メソッドを呼び出し
    const value = result.current.getSetting('test.path');
    
    // getConfig が適切に呼び出されたことを確認
    expect(configModule.getConfig).toHaveBeenCalledWith('test.path', undefined);
    expect(value).toBe('Test Value');
  });

  test('getSetting メソッドがデフォルト値付きで getConfig を呼び出すこと', () => {
    // モックの戻り値を設定
    (configModule.getConfig as jest.Mock).mockReturnValue('Default Value');
    
    // フックをレンダリング
    const { result } = renderCustomHook(() => useConfig());
    
    // getSetting メソッドをデフォルト値付きで呼び出し
    const value = result.current.getSetting('nonexistent.path', 'Default Value');
    
    // getConfig が適切に呼び出されたことを確認
    expect(configModule.getConfig).toHaveBeenCalledWith('nonexistent.path', 'Default Value');
    expect(value).toBe('Default Value');
  });

  test('getSetting メソッドが複数回呼び出しても一貫した結果を返すこと', () => {
    // モックの戻り値を順番に設定
    (configModule.getConfig as jest.Mock)
      .mockReturnValueOnce('Value 1')
      .mockReturnValueOnce('Value 2');
    
    // フックをレンダリング
    const { result, rerender } = renderCustomHook(() => useConfig());
    
    // 1回目の呼び出し
    const value1 = result.current.getSetting('path.one');
    expect(value1).toBe('Value 1');
    
    // フックの再レンダリング
    rerender();
    
    // 2回目の呼び出し
    const value2 = result.current.getSetting('path.two');
    expect(value2).toBe('Value 2');
    
    // getConfig の呼び出し回数と引数を検証
    expect(configModule.getConfig).toHaveBeenCalledTimes(2);
    expect(configModule.getConfig).toHaveBeenNthCalledWith(1, 'path.one', undefined);
    expect(configModule.getConfig).toHaveBeenNthCalledWith(2, 'path.two', undefined);
  });
});
