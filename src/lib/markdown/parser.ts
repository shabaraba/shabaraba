import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { MarkdownParserOptions } from './types';

/**
 * Markdownテキストをパースする
 * @param markdown Markdown文字列
 * @param options パーサーオプション
 * @returns パース済みのAST
 */
export async function parseMarkdown(markdown: string, options: MarkdownParserOptions) {
  const processor = unified()
    .use(remarkParse) // Markdownをパース
    .use(remarkGfm) // GitHub Flavored Markdown（テーブル、タスクリスト等）
    .use(remarkDirective); // カスタムディレクティブ（:::callout 等）

  const ast = processor.parse(markdown);
  const transformedAst = await processor.run(ast);

  return transformedAst;
}

/**
 * MarkdownをHTMLに変換（将来的に使用）
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const { unified } = await import('unified');
  const remarkParse = (await import('remark-parse')).default;
  const remarkGfm = (await import('remark-gfm')).default;
  const remarkHtml = (await import('remark-html')).default;

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return String(result);
}
