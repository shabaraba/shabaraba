import { getConfig, getAllConfig, SiteConfig } from '../../lib/config';
import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';

// モックの設定
jest.mock('fs');
jest.mock('path');

// readFileSyncを型付きでモック化
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('Config Module', () => {
  // テスト前の準備
  beforeEach(() => {
    // __setMockFiles関数を呼び出すためにMockReset
    jest.resetModules();
    
    // パスのモック
    mockedPath.join.mockReturnValue('/mock/path/site.toml');
    
    // 有効なTOMLファイルのモックコンテンツ
    const mockToml = `
      [site]
      title = "Test Site"
      description = "Test Description"
      url = "https://test.com"
      
      [home]
      title = "Test Home"
      subtitle = "Test Home Subtitle"
      
      [tag]
      title_prefix = "Tag: "
      subtitle_template = "Articles related to '%s'"
      
      [author]
      name = "Test Author"
      bio = "Test Bio"
      
      [author.detail]
      info = "Test Info"
      
      [footer]
      copyright = "Test Copyright"
      powered_by_text = "Test Powered By"
      
      [layout]
      default_title = "Test Title"
      default_description = "Test Description"
      
      [sidebar]
      author_title = "Test Author Title"
      popular_articles_title = "Test Popular Articles"
      series_title = "Test Series"
      tags_title = "Test Tags"
    `;
    
    // ファイル読み込みのモック
    mockedFs.readFileSync.mockReturnValue(mockToml);
  });
  
  // テスト後のクリーンアップ
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  // テストケース
  describe('getConfig', () => {
    // モジュールを再度読み込み、テスト用の設定を適用
    let configModule: typeof import('../../lib/config');
    
    beforeEach(() => {
      jest.isolateModules(() => {
        configModule = require('../../lib/config');
      });
    });
    
    test('正しいパスから値を取得できること', () => {
      expect(configModule.getConfig('site.title')).toBe('Test Site');
      expect(configModule.getConfig('home.subtitle')).toBe('Test Home Subtitle');
      expect(configModule.getConfig('author.name')).toBe('Test Author');
    });
    
    test('存在しないパスにはデフォルト値を返すこと', () => {
      expect(configModule.getConfig('nonexistent.path', 'Default')).toBe('Default');
      expect(configModule.getConfig('site.nonexistent', 123)).toBe(123);
    });
    
    test('ネストされたパスから値を取得できること', () => {
      expect(configModule.getConfig('author.detail.info')).toBe('Test Info');
    });
  });
  
  describe('getAllConfig', () => {
    let configModule: typeof import('../../lib/config');
    
    beforeEach(() => {
      jest.isolateModules(() => {
        configModule = require('../../lib/config');
      });
    });
    
    test('すべての設定を取得できること', () => {
      const allConfig = configModule.getAllConfig();
      expect(allConfig).toBeDefined();
      expect(allConfig.site.title).toBe('Test Site');
      expect(allConfig.home.subtitle).toBe('Test Home Subtitle');
      expect(allConfig.author.name).toBe('Test Author');
    });
  });
  
  describe('エラー処理', () => {
    // 無効なTOMLをモック
    beforeEach(() => {
      // 無効なTOML構文
      const invalidToml = `
        [site
        title = "Test Site"
        description = Test Description
      `;
      mockedFs.readFileSync.mockReturnValue(invalidToml);
    });
    
    test('無効なTOMLファイルの場合はデフォルト値を使用すること', () => {
      jest.isolateModules(() => {
        const configModule = require('../../lib/config');
        expect(configModule.getConfig('site.title')).toBe('Coffee Break Point');
      });
    });
  });
});
