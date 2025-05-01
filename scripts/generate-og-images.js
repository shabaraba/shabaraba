/**
 * OGP画像生成スクリプト
 * Next.jsのビルド時に実行され、各記事のOGP画像を生成します
 */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

// skia-canvasを使用
const { Canvas, loadImage, ImageData, FontLibrary } = require('skia-canvas');

// OGP画像の設定
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');
const THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'thumbnailImage');

// カフェ風のカラースキーム
const COLORS = {
  background: '#F8F4EC',   // やわらかいベージュ
  content: '#FFFFFF',      // 白
  accent: '#7B5E57',       // コーヒーのようなダークブラウン
  title: '#4B3832',        // 重厚感ある濃いチョコレート
  titleShadow: 'rgba(0,0,0,0.5)', // タイトル用の影
  shadow: 'rgba(0,0,0,0.1)', // 影
  titleBackground: 'rgba(255,255,255,0.7)' // タイトル背景
};

// フォント設定
try {
  // skia-canvasではSystemフォントが自動的に利用可能
  // 必要に応じて追加フォントを登録することも可能
  // FontLibrary.use('Hiragino', '/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc');
  // FontLibrary.use('Hiragino Bold', '/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc');
  console.log('Using system fonts for OG image generation');
} catch (err) {
  console.warn('Font configuration warning:', err);
  console.warn('Will use system default fonts instead.');
}

/**
 * サムネイル画像のパスを取得する
 * @param {string} id - 記事ID（スラッグ）
 * @returns {string|null} - サムネイル画像のパス（存在しない場合はnull）
 */
async function findThumbnailImage(id) {
  try {
    if (!fs.existsSync(THUMBNAIL_DIR)) {
      return null;
    }

    // サムネイルディレクトリ内のファイルリストを取得
    const files = await readdir(THUMBNAIL_DIR);
    
    // スラッグ化関数（シェルスクリプトと同様の処理）
    const slugify = (str) => {
      return str.toLowerCase()
        .replace(/\s+/g, '-')        // スペースをハイフンに置換
        .replace(/[^a-z0-9-]/g, '-') // 英数字とハイフン以外をハイフンに置換
        .replace(/-+/g, '-')         // 連続するハイフンを一つにまとめる
        .replace(/^-|-$/g, '');      // 先頭と末尾のハイフンを削除
    };
    
    // 各ファイルについて、ファイル名からスラッグを生成し、idと一致するか確認
    for (const file of files) {
      // 拡張子を除いたファイル名を取得
      const filename = path.basename(file, path.extname(file));
      // スラッグ化
      const slug = slugify(filename);
      
      // idと一致する場合はファイルパスを返す
      if (slug === id || filename === id) {
        return path.join(THUMBNAIL_DIR, file);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding thumbnail image:', error);
    return null;
  }
}

/**
 * 指定されたタイトルとIDを元にOGP画像を生成します
 * @param {string} title - 記事タイトル
 * @param {string} id - 記事ID（スラッグ）
 * @param {string|null} thumbnailPath - サムネイル画像のパス（オプション）
 */
async function generateOgImage(title, id, thumbnailPath = null) {
  try {
    // Canvas作成 (skia-canvas用)
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // 背景を描画
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // サムネイル画像が指定されていない場合は自動検索
    if (!thumbnailPath && id !== 'default') {
      thumbnailPath = await findThumbnailImage(id);
    }
    
    // ヘッダー画像の描画（サムネイル画像がある場合）
    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      try {
        const headerImage = await loadImage(thumbnailPath);
        
        // 画像のアスペクト比を維持しながらキャンバスに合わせる
        const ratio = Math.max(WIDTH / headerImage.width, HEIGHT / headerImage.height);
        const imgWidth = headerImage.width * ratio;
        const imgHeight = headerImage.height * ratio;
        const offsetX = (WIDTH - imgWidth) / 2;
        const offsetY = (HEIGHT - imgHeight) / 2;
        
        // 画像を描画
        ctx.drawImage(headerImage, offsetX, offsetY, imgWidth, imgHeight);
        
        // 半透明のオーバーレイを追加
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      } catch (err) {
        console.error('Header image loading error:', err);
        // 画像読み込みに失敗した場合はベーシックな背景を描画
        ctx.fillStyle = COLORS.content;
        ctx.fillRect(60, 60, WIDTH - 120, HEIGHT - 120);
      }
    } else {
      // サムネイル画像がない場合は、基本的な背景を描画
      ctx.shadowColor = COLORS.shadow;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = COLORS.content;
      ctx.fillRect(60, 60, WIDTH - 120, HEIGHT - 120);
    }
    
    // タイトル背景を描画（視認性向上のため）
    const titleBackgroundHeight = 180;
    const titleBackgroundY = (HEIGHT - titleBackgroundHeight) / 2;
    
    ctx.fillStyle = COLORS.titleBackground;
    ctx.fillRect(0, titleBackgroundY, WIDTH, titleBackgroundHeight);
    
    // タイトルテキストを描画
    ctx.shadowColor = COLORS.titleShadow;
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = COLORS.title;
    ctx.font = 'bold 48px "Hiragino Bold", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // タイトルが長い場合は折り返し
    const maxWidth = WIDTH - 200;
    const words = title.split(' ');
    let line = '';
    let lines = [];
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // 行数が多すぎる場合はフォントサイズを調整
    let fontSize = 48;
    if (lines.length > 3) {
      fontSize = Math.max(24, Math.floor(48 * (3 / lines.length)));
      ctx.font = `bold ${fontSize}px "Hiragino Bold", sans-serif`;
      
      // 行を再計算
      line = '';
      lines = [];
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
    }
    
    // 中央揃えで描画
    const lineHeight = fontSize * 1.2;
    let startY = (HEIGHT / 2) - ((lines.length - 1) * lineHeight / 2);
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], WIDTH / 2, startY + (i * lineHeight));
    }
    
    // コーヒーアイコンを描画
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'CoffeeBreakPoint.png');
      const logoImage = await loadImage(logoPath);
      ctx.drawImage(logoImage, WIDTH - 200, HEIGHT - 150, 140, 100);
    } catch (err) {
      console.error('Logo image loading error:', err);
    }
    
    // ブログタイトルを描画（下部）
    ctx.shadowColor = COLORS.titleShadow;
    ctx.shadowBlur = 3;
    ctx.font = 'bold 28px "Hiragino Bold", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Coffee Break Point', WIDTH / 2, HEIGHT - 90);
    
    // サイトURLを描画
    ctx.font = '24px "Hiragino", sans-serif';
    ctx.fillStyle = '#F1E7D6';
    ctx.shadowBlur = 1;
    ctx.fillText('blog.shaba.dev', WIDTH / 2, HEIGHT - 50);
    
    // 画像を保存
    // skia-canvasのバージョンによってtoBufferが同期か非同期かが変わる可能性があるため、
    // Promiseとして扱い、適切に解決する
    const bufferPromise = canvas.toBuffer('image/png');
    const buffer = bufferPromise instanceof Promise ? await bufferPromise : bufferPromise;
    
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, `${id}.png`), buffer);
    
    console.log(`Generated OG image for: ${title}`);
    return true;
  } catch (error) {
    console.error(`Failed to generate OG image for ${title}:`, error);
    return false;
  }
}

/**
 * デフォルトのOGP画像をコピーする
 * canvas依存が問題になる場合の代替手段
 */
function copyDefaultOgImage() {
  try {
    const sourceImage = path.join(process.cwd(), 'public', 'images', 'CoffeeBreakPoint.png');
    const targetPath = path.join(OUTPUT_DIR, 'default.png');
    
    if (fs.existsSync(sourceImage)) {
      fs.copyFileSync(sourceImage, targetPath);
      console.log('Copied default OG image successfully');
      return true;
    } else {
      console.error('Default image not found at:', sourceImage);
      return false;
    }
  } catch (error) {
    console.error('Failed to copy default OG image:', error);
    return false;
  }
}

/**
 * サムネイル画像とスラッグのマッピング情報を取得
 * @returns {Array<Object>} - サムネイル画像とスラッグのマッピング配列
 */
async function getThumbnailImageMappings() {
  try {
    if (!fs.existsSync(THUMBNAIL_DIR)) {
      console.warn('Thumbnail directory not found at:', THUMBNAIL_DIR);
      return [];
    }
    
    const files = await readdir(THUMBNAIL_DIR);
    
    // スラッグ化関数（シェルスクリプトと同様の処理）
    const slugify = (str) => {
      return str.toLowerCase()
        .replace(/\s+/g, '-')        // スペースをハイフンに置換
        .replace(/[^a-z0-9-]/g, '-') // 英数字とハイフン以外をハイフンに置換
        .replace(/-+/g, '-')         // 連続するハイフンを一つにまとめる
        .replace(/^-|-$/g, '');      // 先頭と末尾のハイフンを削除
    };
    
    // 各ファイルについて、ファイル名からスラッグを生成
    const mappings = files.map(file => {
      const filename = path.basename(file, path.extname(file));
      const slug = slugify(filename);
      return {
        slug,
        title: filename, // タイトルはファイル名から取得
        thumbnailPath: path.join(THUMBNAIL_DIR, file)
      };
    });
    
    return mappings;
  } catch (error) {
    console.error('Error getting thumbnail mappings:', error);
    return [];
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    console.log('Starting OG image generation...');
    
    // 出力ディレクトリの作成
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // skia-canvasモジュールが利用可能かチェック
    let canvasAvailable = true;
    try {
      new Canvas(100, 100);
    } catch (err) {
      console.warn('skia-canvas module not available, falling back to image copying:', err);
      canvasAvailable = false;
    }
    
    if (canvasAvailable) {
      try {
        // デフォルトOGP画像を生成
        console.log('Generating default OG image...');
        copyDefaultOgImage();
        await generateOgImage('Coffee Break Point', 'default');
        
        // サムネイル画像のマッピング情報を取得
        console.log('Fetching thumbnail images...');
        const thumbnailMappings = await getThumbnailImageMappings();
        
        if (thumbnailMappings.length > 0) {
          console.log(`Found ${thumbnailMappings.length} thumbnail images to process.`);
          
          // 各サムネイル画像をOGP画像に変換
          for (const mapping of thumbnailMappings) {
            const { slug, title, thumbnailPath } = mapping;
            console.log(`Generating OG image for: ${title} (${slug})`);
            await generateOgImage(title, slug, thumbnailPath);
          }
        } else {
          console.log('No thumbnail images found to process.');
        }
      } catch (error) {
        console.error('Error in OG image generation:', error);
        console.log('Falling back to copying default OG image...');
        copyDefaultOgImage();
      }
    } else {
      // Canvas利用不可の場合はデフォルト画像をコピー
      copyDefaultOgImage();
      console.log('Using default OG image only. Canvas dependency issues prevented generating article-specific images.');
    }
    
    console.log('OG image generation completed!');
  } catch (error) {
    console.error('Error in OG image generation:', error);
    process.exit(1);
  }
}

// スクリプト実行
main().catch(err => {
  console.error('Unhandled error in OG image generation:', err);
  process.exit(1);
});
