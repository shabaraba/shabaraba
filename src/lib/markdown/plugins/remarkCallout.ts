import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';

/**
 * Calloutディレクティブを処理するremarkプラグイン
 *
 * 使用例:
 * :::callout{type="info" icon="💡"}
 * **重要なポイント**
 *
 * ここに内容を記載します。
 * :::
 */
export const remarkCallout: Plugin = () => {
  return (tree: Node) => {
    visit(tree, (node: any) => {
      // containerDirective または leafDirective をチェック
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'callout') return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};

        // カスタムノードタイプに変換
        node.type = 'callout';
        data.hName = 'div';
        data.hProperties = {
          className: ['callout', `callout-${attributes.type || 'info'}`],
          'data-type': attributes.type || 'info',
          'data-icon': attributes.icon || getDefaultIcon(attributes.type),
        };
      }
    });
  };
};

/**
 * タイプに応じたデフォルトアイコンを取得
 */
function getDefaultIcon(type?: string): string {
  switch (type) {
    case 'info':
      return '💡';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'success':
      return '✅';
    default:
      return '💡';
  }
}
