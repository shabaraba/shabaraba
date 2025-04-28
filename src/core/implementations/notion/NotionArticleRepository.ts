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
      const blocks = await setOGPToBookmarkBlocks(await this.getPageBlocks(page.id));

      return {
        ...articleListItem,
        content: blocks
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
}
