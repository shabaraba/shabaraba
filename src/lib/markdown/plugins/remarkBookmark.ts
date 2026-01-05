import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';

/**
 * Bookmarkディレクティブを処理するremarkプラグイン
 *
 * 使用例:
 * :::bookmark
 * https://example.com
 * :::
 */
export const remarkBookmark: Plugin = () => {
  return (tree: Node) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective'
      ) {
        if (node.name !== 'bookmark') return;

        const data = node.data || (node.data = {});

        // 子ノードからURLを抽出
        let url = '';
        if (node.children && node.children.length > 0) {
          const firstChild = node.children[0];
          if (firstChild.type === 'paragraph' && firstChild.children) {
            const textNode = firstChild.children.find((child: any) => child.type === 'text');
            if (textNode) {
              url = textNode.value.trim();
            }
          }
        }

        // カスタムノードタイプに変換
        node.type = 'bookmark';
        data.hName = 'div';
        data.hProperties = {
          className: ['bookmark'],
          'data-url': url,
        };
      }
    });
  };
};
