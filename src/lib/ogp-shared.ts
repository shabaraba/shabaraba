// OGPデータの型定義（ブラウザ・サーバー共通）
export interface OgpData {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  faviconUrl: string;
}

// OGPフェッチ中の状態
export enum OgpFetchStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// 指定URLのfaviconを取得するためのURL生成関数
export const getFaviconUrl = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return '';
  }
};
