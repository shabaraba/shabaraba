/**
 * テーマ選択機能
 * 環境変数からアクティブテーマを取得し、適切なコンポーネントを提供する
 */

// アクティブテーマ（環境変数から取得、デフォルトはtheme2）
export const ACTIVE_THEME = process.env.NEXT_PUBLIC_ACTIVE_THEME || "theme2";

/**
 * テーマに応じたコンポーネントを取得する
 * @param componentPath コンポーネントのパス
 * @returns テーマに対応するコンポーネント
 */
export function getThemeComponent<T>(componentPath: string): T {
  try {
    // 動的インポートでテーマに応じたコンポーネントを取得
    // CSS ファイルは _app.tsx でのみインポート
    return require(`../themes/${ACTIVE_THEME}/${componentPath}`).default;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath} from theme: ${ACTIVE_THEME}`, error);
    throw error;
  }
}

/**
 * テーマに応じたページコンポーネントを取得する
 * @param pagePath ページのパス
 * @returns テーマに対応するページコンポーネント
 */
export function getThemePage<T>(pagePath: string): T {
  return getThemeComponent<T>(`pages/${pagePath}`);
}
