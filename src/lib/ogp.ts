import React, { useState, useEffect } from 'react';

// OGPデータの型定義
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

// OGPデータをキャッシュする単純なMap
const ogpCache = new Map<string, OgpData>();

// 指定URLのfaviconを取得するためのURL生成関数
export const getFaviconUrl = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return '';
  }
};

// OGPデータを取得するAPI関数
export const fetchOgpData = async (url: string): Promise<OgpData> => {
  // すでにキャッシュにある場合はそれを使用
  if (ogpCache.has(url)) {
    return ogpCache.get(url) as OgpData;
  }

  try {
    // 実際のプロジェクトでは、サーバーサイドAPIを使ってOGPデータを取得するべき
    // ここではクライアントサイドでCORSエラーを回避するためにダミーデータを生成

    // URLからドメイン名を取得
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const domain = hostname.replace(/^www\./, '');
    
    // OGPデータを表現した仮データを作成
    const ogpData: OgpData = {
      title: domain.charAt(0).toUpperCase() + domain.slice(1),
      description: `${domain}からのコンテンツです。`,
      url: url,
      imageUrl: '', // 実際のOGP画像URL
      faviconUrl: getFaviconUrl(url)
    };

    // キャッシュに保存
    ogpCache.set(url, ogpData);
    
    return ogpData;
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    
    // エラー時は最低限の情報だけ返す
    const fallbackData: OgpData = {
      title: url,
      description: '',
      url: url,
      imageUrl: '',
      faviconUrl: ''
    };
    
    return fallbackData;
  }
};

// OGPデータを利用するためのReactフック
export const useOgpData = (url: string): {
  data: OgpData | null;
  status: OgpFetchStatus;
  error: Error | null;
} => {
  const [data, setData] = useState<OgpData | null>(null);
  const [status, setStatus] = useState<OgpFetchStatus>(OgpFetchStatus.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }

    const fetchData = async () => {
      setStatus(OgpFetchStatus.LOADING);
      
      try {
        const ogpData = await fetchOgpData(url);
        setData(ogpData);
        setStatus(OgpFetchStatus.SUCCESS);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus(OgpFetchStatus.ERROR);
      }
    };

    fetchData();
  }, [url]);

  return { data, status, error };
};
