import { getOGP } from '../../application/modules/post/services/ogp';
import fs from 'fs';
import path from 'path';

interface OGPCache {
  [url: string]: {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    fetchedAt: number;
  };
}

const CACHE_FILE = path.join(process.cwd(), '.ogp-cache.json');
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7日間

/**
 * OGPキャッシュを読み込む
 */
function loadCache(): OGPCache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load OGP cache:', error);
  }
  return {};
}

/**
 * OGPキャッシュを保存する
 */
function saveCache(cache: OGPCache): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Failed to save OGP cache:', error);
  }
}

/**
 * URLのOGP情報を取得（キャッシュあり）
 */
export async function getOGPWithCache(url: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}> {
  const cache = loadCache();
  const now = Date.now();

  // キャッシュが存在し、有効期限内の場合
  if (cache[url] && now - cache[url].fetchedAt < CACHE_DURATION) {
    return {
      title: cache[url].title,
      description: cache[url].description,
      image: cache[url].image,
      siteName: cache[url].siteName,
    };
  }

  // OGP情報を取得
  try {
    const ogpData = await getOGP(url, `bookmark-${Date.now()}`);

    const result = {
      title: ogpData.pageTitle,
      description: ogpData.pageDescription,
      image: ogpData.thumbnailUrl,
      siteName: ogpData.siteTitle,
    };

    // キャッシュに保存
    cache[url] = {
      ...result,
      fetchedAt: now,
    };
    saveCache(cache);

    return result;
  } catch (error) {
    console.warn(`Failed to fetch OGP for ${url}:`, error);
    // エラー時はデフォルト値を返す
    return {
      title: url,
      description: undefined,
      image: undefined,
      siteName: new URL(url).hostname,
    };
  }
}

/**
 * 複数URLのOGP情報を並列取得
 */
export async function getOGPBatch(urls: string[]): Promise<Map<string, {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}>> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const ogp = await getOGPWithCache(url);
      return { url, ogp };
    })
  );

  const map = new Map();
  results.forEach(({ url, ogp }) => {
    map.set(url, ogp);
  });

  return map;
}
