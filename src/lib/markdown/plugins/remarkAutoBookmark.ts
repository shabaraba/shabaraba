import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';

/**
 * 段落内のリンクのみをBookmarkカードに自動変換するremarkプラグイン
 *
 * Notionの動作を模倣：
 * - 段落に含まれる要素がリンク1つのみの場合、Bookmarkカードとして表示
 * - 複数要素やテキストが含まれる場合は通常のリンクとして扱う
 */
export const remarkAutoBookmark: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'paragraph', (node: any, index, parent) => {
      // 段落の子要素が1つだけで、それがリンクの場合
      if (node.children?.length === 1 && node.children[0].type === 'link') {
        const linkNode = node.children[0];
        const url = linkNode.url;

        // リンク内にテキストしか含まれず、そのテキストがURLと同じ場合
        // （つまり、独立したURLリンク）
        if (
          linkNode.children?.length === 1 &&
          linkNode.children[0].type === 'text' &&
          linkNode.children[0].value === url
        ) {
          // Bookmarkノードに変換
          const bookmarkNode = {
            type: 'bookmark',
            data: {
              hName: 'div',
              hProperties: {
                className: ['bookmark-auto'],
                'data-url': url,
              },
            },
            children: [],
          };

          // 親ノードの子要素を置き換え
          if (parent && typeof index === 'number') {
            parent.children[index] = bookmarkNode;
          }
        }
      }
    });
  };
};
