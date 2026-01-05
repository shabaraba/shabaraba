/**
 * Markdownコンテンツから独立したURLリンクを抽出
 * （段落内にリンクのみが存在する場合）
 */
export function extractBookmarkUrls(markdown: string): string[] {
  const urls: string[] = [];

  // 段落内のリンクのみを抽出する正規表現
  // パターン: 行頭 -> URLのみのリンク -> 行末
  const linkOnlyPattern = /^(https?:\/\/[^\s]+)$/gm;

  let match;
  while ((match = linkOnlyPattern.exec(markdown)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}
