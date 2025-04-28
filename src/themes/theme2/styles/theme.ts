/**
 * Theme2（カフェスタイル）のテーマ設定
 */
export const theme = {
  colors: {
    mainBackground: '#F8F4EC', // やわらかいベージュ
    contentBackground: '#FFFFFF', // コンテンツ背景
    sidebarBackground: '#F1E7D6', // カフェオレ風のやわらかいトーン
    accent: '#7B5E57', // コーヒーのようなダークブラウン
    link: '#A2674C', // 焙煎感ある赤みブラウン
    linkHover: '#D99873', // キャラメルブラウン
    heading: '#4B3832', // 重厚感ある濃いチョコレート
    text: '#333333', // 標準テキスト色
  },
  fonts: {
    body: "'Noto Serif JP', serif", // 本文フォント
    ui: "'Montserrat', sans-serif", // UI部分のフォント
  },
  layout: {
    maxWidth: '1200px', // コンテナ最大幅
    containerPadding: '0 16px', // コンテナ内側の余白
    gap: '32px', // グリッド間のギャップ
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  boxShadow: {
    small: '0 2px 8px rgba(0,0,0,0.05)',
    medium: '0 4px 12px rgba(0,0,0,0.1)',
  },
};
