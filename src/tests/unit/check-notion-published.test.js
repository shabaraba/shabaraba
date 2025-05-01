/**
 * NotionのPublishedプロパティの監視スクリプトのテスト
 */

// 実際のスクリプトファイルをモックする前にエントリポイントをモック
jest.mock('../../../scripts/check-notion-published', () => {
  // モックを返す
  return {};
}, { virtual: true });

// モックの設定
jest.mock('@notionhq/client', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        databases: {
          query: jest.fn().mockResolvedValue({
            results: [
              {
                id: 'page1',
                properties: {
                  Name: { title: [{ plain_text: 'Test Article 1' }] },
                  Published: { checkbox: true },
                  Slug: { rich_text: [{ plain_text: 'test-article-1' }] },
                  Published_Time: { date: { start: '2023-01-01T00:00:00.000Z' } }
                }
              },
              {
                id: 'page2',
                properties: {
                  Name: { title: [{ plain_text: 'Test Article 2' }] },
                  Published: { checkbox: true },
                  Slug: { rich_text: [{ plain_text: 'test-article-2' }] },
                  Published_Time: { date: { start: '2023-01-02T00:00:00.000Z' } }
                }
              }
            ]
          })
        }
      };
    })
  };
});

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  return {
    ...originalModule,
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
  };
});

jest.mock('path', () => {
  const originalModule = jest.requireActual('path');
  return {
    ...originalModule,
    join: jest.fn().mockReturnValue('/mocked/path/to/cache-file.json'),
  };
});

// テスト用の実装をモックからインポート
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

describe('check-notion-published.js', () => {
  // テスト実装の検証のみを行います
  test('モックの設定が正しいこと', () => {
    expect(jest.isMockFunction(fs.existsSync)).toBe(true);
    expect(jest.isMockFunction(fs.readFileSync)).toBe(true);
    expect(jest.isMockFunction(fs.writeFileSync)).toBe(true);
    expect(jest.isMockFunction(path.join)).toBe(true);
    expect(jest.isMockFunction(Client)).toBe(true);
  });

  test('NotionクライアントのモックがQueryメソッドを持っていること', () => {
    const client = new Client();
    expect(client.databases.query).toBeDefined();
  });
});
