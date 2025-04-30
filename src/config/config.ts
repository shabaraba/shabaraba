import fs from 'fs';
import path from 'path';
import * as TOML from '@iarna/toml';

// 設定ファイルのパス
const CONFIG_FILE_PATH = path.join(process.cwd(), 'src/config/site.toml');

// 設定ファイルの型定義
export interface SiteConfig {
  site: {
    title: string;
    description: string;
    url: string;
  };
  home: {
    title: string;
    subtitle: string;
  };
  tag: {
    title_prefix: string;
    subtitle_template: string;
  };
  author: {
    name: string;
    bio: string;
    detail: {
      info: string;
    };
  };
  footer: {
    copyright: string;
    powered_by_text: string;
  };
  layout: {
    default_title: string;
    default_description: string;
  };
  sidebar: {
    author_title: string;
    popular_articles_title: string;
    series_title: string;
    tags_title: string;
  };
  mylink: {
    page_title: string;
    page_description: string;
  };
}

// デフォルト値（設定ファイルが読み込めない場合のフォールバック）
const defaultConfig: SiteConfig = {
  site: {
    title: 'Coffee Break Point',
    description: 'コーヒー休憩にちょうどよい技術よみものを目指して',
    url: 'https://blog.shaba.dev',
  },
  home: {
    title: 'Coffee Break Point',
    subtitle: 'プログラミングやデザイン、日々の気づきをお届けするブログです',
  },
  tag: {
    title_prefix: 'タグ: ',
    subtitle_template: '「%s」に関連する記事一覧',
  },
  author: {
    name: 'しゃば',
    bio: 'プログラミングとデザインが好きなエンジニア。日々の発見や気づきをこのブログで共有しています。',
    detail: {
      info: 'ロボット好きのPHPエンジニア\n自分でイジれるおもちゃを欲しがち\n時間がなく3年ほど中断している工作機械自作の完成が夢\n\n休憩の傍らななめ読みできそうな技術ブログを目指す',
    },
  },
  footer: {
    copyright: '©from-garage 2022 All Rights Reserved.',
    powered_by_text: 'powered by',
  },
  layout: {
    default_title: 'Coffee Break Point',
    default_description: '日々の気付きやメモを書いていくブログです',
  },
  sidebar: {
    author_title: 'Author',
    popular_articles_title: '人気記事',
    series_title: 'シリーズ',
    tags_title: 'タグ',
  },
  mylink: {
    page_title: 'Links',
    page_description: '筆者の興味関心のある外部ページはこちらに',
  },
};

// 設定の読み込み
let config: SiteConfig;

try {
  // ファイルの読み込み
  const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
  
  // TOMLのパース
  config = TOML.parse(fileContent) as SiteConfig;
  
  console.log('設定ファイルを読み込みました:', CONFIG_FILE_PATH);
} catch (error) {
  console.warn('設定ファイルの読み込みに失敗しました。デフォルト値を使用します:', error);
  config = defaultConfig;
}

/**
 * 指定したパスから設定値を取得する
 * @param path ドット区切りのパス（例: 'site.title'）
 * @param defaultValue 値が見つからなかった場合のデフォルト値
 * @returns 設定値
 */
export function getConfig<T>(path: string, defaultValue?: T): T {
  try {
    // パスをセグメントに分割
    const segments = path.split('.');
    
    // configから値を順に取得
    let value: any = config;
    for (const segment of segments) {
      if (value === undefined || value === null) {
        return defaultValue as T;
      }
      value = value[segment];
    }
    
    // 値が見つからない場合はデフォルト値を返す
    return (value !== undefined && value !== null) ? value : (defaultValue as T);
  } catch (error) {
    console.error(`設定値 ${path} の取得に失敗しました:`, error);
    return defaultValue as T;
  }
}

// 設定全体を取得
export function getAllConfig(): SiteConfig {
  return config;
}

export default {
  getConfig,
  getAllConfig,
};
