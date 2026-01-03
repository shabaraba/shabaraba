import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JSDOM, VirtualConsole } from 'jsdom';
import { OgpData, OgpFetchStatus, getFaviconUrl } from './ogp-utils';

// Re-export for backward compatibility
export { OgpData, OgpFetchStatus, getFaviconUrl };

// OGPデータをキャッシュする単純なMap
const ogpCache = new Map<string, OgpData>();

// OGPデータを取得するAPI関数
export const fetchOgpData = async (url: string): Promise<OgpData> => {
  // すでにキャッシュにある場合はそれを使用
  if (ogpCache.has(url)) {
    return ogpCache.get(url) as OgpData;
  }

  try {
    // サーバーサイド（ビルド時）でURLにアクセスしてOGPデータを取得
    const response = await axios.get(url, {
      // タイムアウト設定
      timeout: 10000,
      // ユーザーエージェント設定（一部サイトでのブロック回避）
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Notiography/1.0; +https://github.com/shabaraba/Notiography)'
      }
    });

    const data = response.data;
    
    // JSDOMでHTMLをパース
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => { /* エラーを無視 */ });
    
    const dom = new JSDOM(data, {
      virtualConsole,
      contentType: "text/html",
      runScripts: "outside-only",
      includeNodeLocations: false,
      storageQuota: 10000000,
      pretendToBeVisual: true,
      resources: "usable"
    });

    const metaList = dom.window.document.getElementsByTagName("meta");
    
    // URLからホスト名を取得
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // デフォルトのデータを設定
    let ogpData: OgpData = {
      title: dom.window.document.title || hostname,
      description: '',
      url: url,
      imageUrl: '',
      faviconUrl: getFaviconUrl(url)
    };

    // metaタグからOGP情報を抽出
    Array.from(metaList).forEach((meta: HTMLMetaElement) => {
      let name = meta.getAttribute("name");
      if (typeof name == "string") {
        if (name.match("site_name")) ogpData.title = meta.getAttribute("content") || ogpData.title;
        if (name.match("title")) ogpData.title = meta.getAttribute("content") || ogpData.title;
        if (name.match("description")) ogpData.description = meta.getAttribute("content") || '';
        if (name.match("image")) ogpData.imageUrl = meta.getAttribute("content") || '';
      }
      
      // OGPはproperty属性に設定されることが多いのでそちらも確認
      let property = meta.getAttribute("property");
      if (property === "og:site_name") ogpData.title = meta.getAttribute("content") || ogpData.title;
      if (property === "og:title") ogpData.title = meta.getAttribute("content") || ogpData.title;
      if (property === "og:description") ogpData.description = meta.getAttribute("content") || ogpData.description;
      if (property === "og:image") ogpData.imageUrl = meta.getAttribute("content") || ogpData.imageUrl;
    });

    // キャッシュに保存
    ogpCache.set(url, ogpData);
    
    return ogpData;
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    
    // エラー時は最低限の情報だけ返す
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      const fallbackData: OgpData = {
        title: hostname,
        description: '',
        url: url,
        imageUrl: '',
        faviconUrl: getFaviconUrl(url)
      };
      
      return fallbackData;
    } catch (parseError) {
      // URLのパースにも失敗した場合
      const fallbackData: OgpData = {
        title: url,
        description: '',
        url: url,
        imageUrl: '',
        faviconUrl: ''
      };
      
      return fallbackData;
    }
  }
};

// OGPデータを利用するためのReactフック（従来のクライアント用）
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
