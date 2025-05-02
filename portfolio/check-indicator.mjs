import { chromium } from 'playwright';

(async () => {
  console.log('Playwrightを開始します...');
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--window-size=1280,800']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // サイトに接続
  console.log('ページに接続します...');
  await page.goto('http://localhost:5175/');
  console.log('ページに接続しました');

  // 少し待ってスクロールインジケータが表示されるのを待つ
  await page.waitForTimeout(2000);

  // スクロールインジケータを見つける - emotion.jsスタイルされたコンポーネント用のセレクタを試す
  // より汎用的なセレクタを使用
  console.log('スクロールインジケータを探しています...');
  
  // いくつかの異なるセレクタを試す
  const selectors = [
    'div[class*="ScrollIndicator"]',
    'div[class*="scroll"]',
    'div[class*="Scroll"]',
    'div[class^="css-"]', // emotionのクラス名のパターン
    'i.fas.fa-chevron-down',
    'div:has(i.fas.fa-chevron-down)'
  ];
  
  let indicator = null;
  
  for (const selector of selectors) {
    console.log(`セレクタを試しています: ${selector}`);
    indicator = await page.$(selector);
    if (indicator) {
      console.log(`セレクタで見つかりました: ${selector}`);
      break;
    }
  }
  
  // それでも見つからない場合は、ページ内のすべての要素のスクリーンショットを取得
  if (!indicator) {
    console.log('標準的なセレクタでは見つかりませんでした。ページのスクリーンショットを取得します...');
    await page.screenshot({ path: './full-page.png' });
    console.log('スクリーンショットを保存しました: ./full-page.png');
  }

  if (indicator) {
    console.log('スクロールインジケータを見つけました');
    
    // インジケータの位置とサイズを取得
    const boundingBox = await indicator.boundingBox();
    console.log('位置情報:', boundingBox);
    
    // ビューポートのサイズを取得
    const viewportSize = page.viewportSize();
    console.log('ビューポートサイズ:', viewportSize);
    
    // 中央位置を計算して確認
    if (boundingBox && viewportSize) {
      const indicatorCenter = boundingBox.x + boundingBox.width / 2;
      const viewportCenter = viewportSize.width / 2;
      const offset = indicatorCenter - viewportCenter;
      
      console.log('インジケータの中心:', indicatorCenter);
      console.log('ビューポートの中心:', viewportCenter);
      console.log('オフセット (差異):', offset);
      
      if (Math.abs(offset) < 5) {
        console.log('結果: インジケータは中央に配置されています');
      } else {
        console.log(`結果: インジケータは ${offset > 0 ? '右' : '左'} に ${Math.abs(offset)}px ずれています`);
      }
    }
    
    // スクリーンショットを撮影
    await page.screenshot({ path: './indicator-check.png' });
    console.log('スクリーンショットを保存しました: ./indicator-check.png');
  } else {
    console.log('スクロールインジケータが見つかりませんでした');
  }

  // ブラウザを閉じる前に確認できるよう少し待つ
  await page.waitForTimeout(5000);
  await browser.close();
})();