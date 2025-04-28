import { NotionArticleRepository } from '../../../src/core/implementations/notion/NotionArticleRepository';
import { Client } from '@notionhq/client';

// Notionクライアントをモック
jest.mock('@notionhq/client', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        databases: {
          query: jest.fn().mockResolvedValue({
            results: []
          })
        },
        blocks: {
          children: {
            list: jest.fn().mockResolvedValue({
              results: [],
              next_cursor: null
            })
          }
        }
      };
    })
  };
});

// 環境変数をセットアップ
process.env.NOTION_TOKEN = 'test-token';
process.env.NOTION_BLOG_DATABASE = 'test-database-id';

describe('NotionArticleRepository', () => {
  let repository: NotionArticleRepository;
  let mockClient: Client;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new NotionArticleRepository();
    mockClient = (Client as jest.Mock).mock.instances[0];
  });

  describe('getArticleBySlug', () => {
    it('should use rich_text for Slug property filter instead of text', async () => {
      // テスト用のスラグ
      const testSlug = 'test-slug';
      
      // モックの設定
      (mockClient.databases.query as jest.Mock).mockResolvedValueOnce({
        results: [{
          id: 'page-id',
          properties: {
            Name: { title: [{ plain_text: 'Test Title' }] },
            Slug: { rich_text: [{ plain_text: testSlug }] },
            Published_Time: { date: { start: '2023-01-01T00:00:00Z' } },
            Published: { checkbox: true },
            Tags: { multi_select: [] }
          },
          last_edited_time: '2023-01-01T00:00:00Z'
        }]
      });
      
      (mockClient.blocks.children.list as jest.Mock).mockResolvedValueOnce({
        results: [],
        next_cursor: null
      });

      // 記事取得を実行
      await repository.getArticleBySlug(testSlug);

      // 正しいフィルターが使用されていることを確認
      expect(mockClient.databases.query).toHaveBeenCalledWith(
        expect.objectContaining({
          database_id: 'test-database-id',
          filter: {
            and: [
              {
                property: 'Slug',
                rich_text: { equals: testSlug }  // textではなくrich_textを使用していることを確認
              },
              {
                property: 'Published',
                checkbox: { equals: true }
              }
            ]
          }
        })
      );
    });
  });
});
