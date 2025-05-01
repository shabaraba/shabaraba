import { Client } from "@notionhq/client";
import { ArticleRepository, ArticleListItem, Article } from "../../interfaces/article/ArticleRepository";
import { setOGPToBookmarkBlocks } from "application/modules/post/services/ogp";

export class NotionArticleRepository implements ArticleRepository {
  private readonly notion: Client;
  private readonly databaseId: string;

  constructor() {
    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_BLOG_DATABASE;

    if (!token || !databaseId) {
      throw new Error("Notion token or database ID is not defined in environment variables");
    }

    this.notion = new Client({ auth: token });
    this.databaseId = databaseId;
  }

  async getArticleList(): Promise<ArticleListItem[]> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [{
            property: 'Published',
            checkbox: { equals: true }
          }],
        },
        sorts: [
          {
            property: "Published_Time",
            direction: "descending"
          }
        ]
      });

      return response.results.map((page: any) => this.convertToArticleListItem(page));
    } catch (error) {
      console.error("Error fetching articles from Notion:", error);
      throw error;
    }
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: 'Slug',
              rich_text: { equals: slug }
            },
            {
              property: 'Published',
              checkbox: { equals: true }
            }
          ]
        }
      });

      if (response.results.length === 0) {
        throw new Error(`Article with slug "${slug}" not found`);
      }

      const page = response.results[0];
      const articleListItem = this.convertToArticleListItem(page);
      
      // 記事の内容を取得
      const rawBlocks = await this.getPageBlocks(page.id);
      console.log(`Fetched ${rawBlocks ? rawBlocks.length : 0} blocks for page ${page.id}`);
      
      // OGP情報を追加
      let blocks;
      try {
        blocks = await setOGPToBookmarkBlocks(rawBlocks);
      } catch (ogpError) {
        console.error(`Error setting OGP for blocks in page ${page.id}:`, ogpError);
        // エラー時は元のブロックをそのまま使用
        blocks = rawBlocks;
      }
      
      // Relations（関連記事）を取得
      let relatedArticles: ArticleListItem[] = [];
      try {
        const properties = page.properties;
        // Relationsプロパティがあり、中身が存在する場合
        if (properties.Relations && properties.Relations.relation && properties.Relations.relation.length > 0) {
          // 関連記事IDを取得
          const relationIds = properties.Relations.relation.map((rel: any) => rel.id);
          // 関連記事情報を取得
          relatedArticles = await this.getRelatedArticles(relationIds);
          console.log(`Found ${relatedArticles.length} related articles for ${slug}`);
        }
      } catch (relationsError) {
        console.error(`Error fetching related articles for "${slug}":`, relationsError);
        // エラー時は空配列のまま
      }

      return {
        ...articleListItem,
        content: blocks,
        relatedArticles
      };
    } catch (error) {
      console.error(`Error fetching article with slug "${slug}" from Notion:`, error);
      throw error;
    }
  }

  async getArticleSlugs(): Promise<string[]> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [{
            property: 'Published',
            checkbox: { equals: true }
          }],
        }
      });

      return response.results.map((page: any) => {
        const properties = page.properties;
        return properties.Slug?.rich_text[0]?.plain_text || '';
      }).filter(Boolean);
    } catch (error) {
      console.error("Error fetching article slugs from Notion:", error);
      throw error;
    }
  }

  private async getPageBlocks(pageId: string): Promise<any[]> {
    try {
      let blocks: any[] = [];
      let cursor: string | undefined;
      
      do {
        const response: any = await this.notion.blocks.children.list({
          block_id: pageId,
          start_cursor: cursor,
        });
        
        blocks = [...blocks, ...response.results];
        cursor = response.next_cursor;
      } while (cursor);

      // ネストされたブロックを取得
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.has_children) {
          blocks[i].children = await this.getPageBlocks(block.id);
        }
      }

      return blocks;
    } catch (error) {
      console.error(`Error fetching blocks for page "${pageId}" from Notion:`, error);
      throw error;
    }
  }

  private convertToArticleListItem(page: any): ArticleListItem {
    const properties = page.properties;
    
    const title = properties.Name?.title[0]?.plain_text || "Untitled";
    const slug = properties.Slug?.rich_text[0]?.plain_text || "";
    const publishedAt = properties.Published_Time?.date?.start || new Date().toISOString();
    const updatedAt = page.last_edited_time;
    
    let coverImage = null;
    if (page.cover) {
      if (page.cover.type === 'external') {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === 'file') {
        coverImage = page.cover.file.url;
      }
    }

    // タグの取得
    let tags: string[] = [];
    if (properties.Tags && properties.Tags.multi_select) {
      tags = properties.Tags.multi_select.map((tag: any) => tag.name);
    }

    // 記事の抜粋を取得（実装は省略、必要に応じて実装）
    const excerpt = ""; // 本来はページの先頭テキストを取得するなど

    return {
      id: page.id,
      slug,
      title,
      excerpt,
      publishedAt: publishedAt, // すでにISOString形式の日付文字列
      updatedAt: updatedAt || undefined, // last_edited_timeも文字列
      coverImage: coverImage || undefined,
      tags
    };
  }
  
  /**
   * 関連記事IDリストから記事情報を取得する
   * @param relationIds 関連記事IDのリスト
   * @returns 関連記事情報の配列
   */
  private async getRelatedArticles(relationIds: string[]): Promise<ArticleListItem[]> {
    if (!relationIds || relationIds.length === 0) {
      return [];
    }
    
    try {
      // 関連記事IDごとにページ情報を取得
      const relatedArticles: ArticleListItem[] = [];
      
      for (const id of relationIds) {
        try {
          const response = await this.notion.pages.retrieve({ page_id: id });
          relatedArticles.push(this.convertToArticleListItem(response));
        } catch (error) {
          console.error(`Error fetching related article with ID "${id}":`, error);
          // エラーが発生しても処理を続行
        }
      }
      
      return relatedArticles;
    } catch (error) {
      console.error("Error fetching related articles from Notion:", error);
      return []; // エラー時は空配列を返す
    }
  }
}
