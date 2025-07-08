const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateOGImage() {
  let browser;
  
  try {
    console.log('Puppeteerを起動中...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for OG image size
    await page.setViewport({ width: 1200, height: 630 });
    
    // Navigate to the HTML file
    const htmlPath = 'file://' + path.resolve(__dirname, 'create-og-image.html');
    console.log('HTMLファイルを読み込み中:', htmlPath);
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    
    // Wait for fonts to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of the OG image element
    console.log('OG画像要素のスクリーンショットを撮影中...');
    const element = await page.$('#og-image');
    
    if (!element) {
      throw new Error('OG画像要素が見つかりません');
    }
    
    const screenshot = await element.screenshot({
      type: 'png',
      omitBackground: false
    });
    
    // Save to public/og-images/default.png
    const outputPath = path.resolve(__dirname, '../public/og-images/default.png');
    fs.writeFileSync(outputPath, screenshot);
    
    console.log('✅ OG画像が正常に生成されました:', outputPath);
    
  } catch (error) {
    console.error('❌ OG画像生成エラー:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
try {
  generateOGImage();
} catch (error) {
  console.error('Puppeteerが利用できません:', error);
  console.log('手動でブラウザから画像をダウンロードしてください');
}