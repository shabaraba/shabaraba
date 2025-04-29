import { useCallback } from 'react';
import { getConfig, SiteConfig } from './config';

/**
 * 設定値を取得するためのフック
 * Reactコンポーネント内で設定値を取得する際に使用
 */
export function useConfig() {
  /**
   * 指定したパスから設定値を取得
   * @param path ドット区切りのパス
   * @param defaultValue デフォルト値
   * @returns 設定値
   */
  const getSetting = useCallback(<T>(path: string, defaultValue?: T): T => {
    return getConfig<T>(path, defaultValue);
  }, []);

  return {
    getSetting,
  };
}

export default useConfig;
