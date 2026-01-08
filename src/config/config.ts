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
  header: {
    homelink: string;
  };
}

// デフォルト値（site.tomlと一致させてSSR/CSR不整合を防ぐ）
const defaultConfig: SiteConfig = {
  site: {
    title: 'Coffee Break Point',
    description: '育児・仕事・開発——全部やるエンジニアの記録です。',
    url: 'https://shaba.dev',
  },
  home: {
    title: 'Coffee Break Point',
    subtitle: 'コーヒー休憩にちょうどよい技術よみものを目指して',
  },
  tag: {
    title_prefix: 'タグ: ',
    subtitle_template: '「%s」に関連する記事一覧',
  },
  author: {
    name: 'しゃば',
    bio: '2児の父でエンジニア。自分の開発環境を整えるのが好き。最近はClaudeに首ったけ。',
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
    default_description: '育児・仕事・開発——全部やるエンジニアの記録です。',
  },
  sidebar: {
    author_title: 'Author',
    popular_articles_title: '人気記事',
    series_title: 'シリーズ',
    tags_title: 'タグ',
  },
  header: {
    homelink: '記事一覧',
  },
};

// 設定保存用の変数（デフォルト値で初期化してSSR/CSR不一致を防ぐ）
let config: SiteConfig = defaultConfig;

// クライアントサイドの設定読み込みリクエストを追跡する変数
let configPromise: Promise<SiteConfig> | null = null;

/**
 * クライアントサイドで設定を非同期に読み込む関数
 * 一度だけ実行され、結果をキャッシュする
 */
const loadClientConfig = async (): Promise<SiteConfig> => {
  // すでにリクエストが進行中の場合はそれを返す
  if (configPromise) {
    return configPromise;
  }
  
  // 新しいリクエストを開始
  configPromise = new Promise<SiteConfig>(async (resolve) => {
    try {
      console.log('クライアントサイドで設定を読み込み中...');
      const response = await fetch('/config/site-config.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
      }
      
      const loadedConfig = await response.json();
      // グローバル設定を更新
      config = loadedConfig;
      console.log('設定ファイルを読み込みました (クライアントサイド)');
      resolve(loadedConfig);
    } catch (error) {
      console.warn('JSONファイルの読み込みに失敗しました。デフォルト値を使用します:', error);
      // エラー時はデフォルト設定を維持
      resolve(defaultConfig);
    }
  });
  
  return configPromise;
};

// サーバーサイドとクライアントサイドで異なる処理
if (typeof window === 'undefined') {
  // サーバーサイドの場合: 直接ファイルからTOMLを読み込む
  try {
    // 必要なモジュールを動的にインポート
    const fs = require('fs');
    const path = require('path');
    const TOML = require('@iarna/toml');
    
    // 設定ファイルのパス
    const CONFIG_FILE_PATH = path.join(process.cwd(), 'src/config/site.toml');
    
    // ファイルの読み込み
    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
    
    // TOMLのパース
    config = TOML.parse(fileContent) as SiteConfig;
    
    console.log('設定ファイルを読み込みました (サーバーサイド):', CONFIG_FILE_PATH);
  } catch (error) {
    console.warn('設定ファイルの読み込みに失敗しました。デフォルト値を使用します:', error);
    config = defaultConfig;
  }
} else {
  // クライアントサイドの場合: JSONを読み込むリクエストを開始
  // 非同期で設定を読み込む（コンポーネントマウント前に読み込み開始）
  loadClientConfig().catch(() => {
    // エラーハンドリングはloadClientConfig内で行われるが、
    // Promiseの未処理エラーを防ぐために空のcatchを追加
  });
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

/**
 * 設定全体を取得
 * クライアントサイドでは設定が完全に読み込まれていない可能性があるため注意
 */
export function getAllConfig(): SiteConfig {
  return config;
}

export default {
  getConfig,
  getAllConfig,
};
