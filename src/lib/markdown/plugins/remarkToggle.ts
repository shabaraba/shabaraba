import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';

/**
 * Toggleディレクティブを処理するremarkプラグイン
 *
 * 使用例:
 * :::toggle{summary="詳細を表示"}
 * ここに折りたたまれた内容を記載します。
 * :::
 */
export const remarkToggle: Plugin = () => {
  return (tree: Node) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective'
      ) {
        if (node.name !== 'toggle') return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};

        // カスタムノードタイプに変換
        node.type = 'toggle';
        data.hName = 'details';
        data.hProperties = {
          className: ['toggle'],
          'data-summary': attributes.summary || '詳細を表示',
        };
      }
    });
  };
};
