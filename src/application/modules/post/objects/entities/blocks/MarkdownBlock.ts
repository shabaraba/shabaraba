import { Block } from "./Block";

/**
 * Markdown形式のコンテンツを保持するBlock
 * Markdown/GitHubソースの記事用
 */
export class MarkdownBlock extends Block {
  public content: string;

  constructor(params: { id: string; content: string; nest?: number }) {
    super(params.id, params.nest);
    this.type = "Markdown";
    this.content = params.content;
  }
}
