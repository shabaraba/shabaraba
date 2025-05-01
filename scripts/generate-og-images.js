/**
 * OGP画像生成スクリプト
 * Next.jsのビルド時に実行され、各記事のOGP画像を生成します
 */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const dotenv = require('dotenv');

// 環境変数を読み込み
dotenv.config();

// ビルド時のタイムスタンプ（OGP画像のキャッシュバスティング用）
const BUILD_TIMESTAMP = Date.now();

// NotionのClient
const { Client } = require('@notionhq/client');

// skia-canvasを使用
const { Canvas, loadImage, ImageData, FontLibrary } = require('skia-canvas');

// OGP画像の設定
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');
const THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'thumbnailImage');

// Notion API設定
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_BLOG_DATABASE = process.env.NOTION_BLOG_DATABASE;
const notionClient = new Client({ auth: NOTION_TOKEN });

// カフェ風のカラースキーム
const COLORS = {
  background: '#F8F4EC',   // やわらかいベージュ
  content: '#FFFFFF',      // 白
  accent: '#7B5E57',       // コーヒーのようなダークブラウン
  title: '#4B3832',        // 重厚感ある濃いチョコレート
  titleShadow: 'rgba(0,0,0,0.5)', // タイトル用の影
  shadow: 'rgba(0,0,0,0.1)', // 影
  titleBackground: 'rgba(255,255,255,0.7)', // タイトル背景
  coffeeFilter: '#7B5E5780',
  logoColor: '#4B3832'    // ロゴテキスト色
};

// Caveatフォントをダウンロード & 設定
async function setupCaveatFont() {
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  const caveatRegularPath = path.join(fontsDir, 'Caveat-Regular.ttf');
  const caveatBoldPath = path.join(fontsDir, 'Caveat-Bold.ttf');
  
  // フォントディレクトリがなければ作成
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }
  
  // フォントファイルが存在するか確認し、なければダウンロード
  const downloadFont = async (url, outputPath) => {
    if (fs.existsSync(outputPath)) {
      console.log(`Font already exists: ${outputPath}`);
      return true;
    }
    
    try {
      const https = require('https');
      const file = fs.createWriteStream(outputPath);
      
      await new Promise((resolve, reject) => {
        https.get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download font: ${response.statusCode}`));
            return;
          }
          
          response.pipe(file);
          
          file.on('finish', () => {
            file.close();
            resolve();
          });
          
          file.on('error', (err) => {
            fs.unlink(outputPath, () => {});
            reject(err);
          });
        }).on('error', reject);
      });
      
      console.log(`Downloaded font to: ${outputPath}`);
      return true;
    } catch (error) {
      console.error(`Error downloading font: ${error.message}`);
      return false;
    }
  };
  
  // Caveatフォントをダウンロード (Google Fontsから)
  try {
    const regularDownloaded = await downloadFont(
      'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpZA.ttf',
      caveatRegularPath
    );
    
    const boldDownloaded = await downloadFont(
      'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjRV6eIWpZA.ttf',
      caveatBoldPath
    );
    
    // ダウンロードしたフォントをライブラリに登録
    if (regularDownloaded) {
      FontLibrary.use('Caveat', caveatRegularPath);
      console.log('Registered Caveat Regular font');
    }
    
    if (boldDownloaded) {
      FontLibrary.use('Caveat Bold', caveatBoldPath);
      console.log('Registered Caveat Bold font');
    }
    
    return regularDownloaded || boldDownloaded;
  } catch (error) {
    console.error('Error setting up Caveat font:', error);
    return false;
  }
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
    
    // アクセントカラーで外周を縁取り
    // 外側の縁取り（太さを強調）
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, WIDTH - 12, HEIGHT - 12);
    
    // 内側の縁取り（より細い線で、デザイン性を高める）
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(22, 22, WIDTH - 44, HEIGHT - 44);

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

    // コーヒー色フィルターを画像全体に適用
    ctx.fillStyle = COLORS.background + '80';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    ctx.fillStyle = COLORS.titleBackground;
    ctx.fillRect(0, titleBackgroundY, WIDTH, titleBackgroundHeight);
    
    // タイトルテキストを描画
    ctx.shadowColor = COLORS.titleShadow;
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = COLORS.title;
    ctx.font = 'bold 48px "Hiragino Sans", "Noto Sans JP", "Meiryo", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // タイトルが長い場合は折り返し
    const maxWidth = WIDTH - 200;
    let line = '';
    let lines = [];
    
    // 日本語と英語が混在するテキストのために単語分割を改善
    // 日本語はスペースで区切られていないので、文字単位で処理
    if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(title)) {
      // 日本語を含む場合は、文字ごとに追加するか改行するかを判断
      const chars = title.split('');
      for (let i = 0; i < chars.length; i++) {
        const testLine = line + chars[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(line);
          line = chars[i];
        } else {
          line = testLine;
        }
      }
    } else {
      // 英語などスペースで区切られた言語の場合は単語単位で処理
      const words = title.split(' ');
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
    }

    lines.push(line);
    
    // フォントサイズの自動調整
    let fontSize = 48; // 初期フォントサイズ
    const minFontSize = 22; // 最小許容フォントサイズ
    
    // タイトルの総文字数を取得
    const totalCharCount = title.length;
    
    // 文字数に基づく初期調整
    if (totalCharCount > 100) {
      fontSize = Math.max(minFontSize, Math.floor(48 * (100 / totalCharCount) * 1.2));
    } else if (totalCharCount > 60) {
      fontSize = Math.max(minFontSize, Math.floor(48 * (60 / totalCharCount) * 1.5));
    }
    
    // 行数に基づいてフォントサイズを調整
    if (lines.length > 2) {
      fontSize = Math.max(minFontSize, Math.floor(fontSize * (2.5 / lines.length)));
    }
    
    // 1行あたりの最大文字数を確認
    let maxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const metrics = ctx.measureText(lines[i]);
      maxLineWidth = Math.max(maxLineWidth, metrics.width);
    }
    
    // 最大行幅が利用可能幅を超える場合、フォントサイズをさらに調整
    if (maxLineWidth > maxWidth) {
      const scaleFactor = maxWidth / maxLineWidth;
      fontSize = Math.max(minFontSize, Math.floor(fontSize * scaleFactor));
    }
    
    // タイトルのはみ出しを検知してログ出力
    const isOverflowing = maxLineWidth > maxWidth || lines.length > 4;
    if (isOverflowing) {
      console.log(`Warning: Title may overflow in OGP image for: "${title}" - Adjusting font size to ${fontSize}px.`);
    }
    
    // 調整後のフォントサイズを設定
    ctx.font = `bold ${fontSize}px "Hiragino Sans", "Noto Sans JP", "Meiryo", sans-serif`;
    
    // 行を再計算（フォントサイズ調整後）
    line = '';
    lines = [];
    
    // 日本語と英語が混在するテキストの場合の処理方法を再適用
    if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(title)) {
      // 日本語を含む場合は、文字ごとに追加するか改行するかを判断
      const chars = title.split('');
      for (let i = 0; i < chars.length; i++) {
        const testLine = line + chars[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(line);
          line = chars[i];
        } else {
          line = testLine;
        }
      }
    } else {
      // 英語などスペースで区切られた言語の場合は単語単位で処理
      const words = title.split(' ');
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
    }
    
    lines.push(line);
    
    // 最終的なチェック
    let finalMaxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const metrics = ctx.measureText(lines[i]);
      finalMaxLineWidth = Math.max(finalMaxLineWidth, metrics.width);
    }
    
    // それでもはみ出す場合は最終調整
    if (finalMaxLineWidth > maxWidth && fontSize > minFontSize) {
      const finalScaleFactor = maxWidth / finalMaxLineWidth;
      fontSize = Math.max(minFontSize, Math.floor(fontSize * finalScaleFactor));
      ctx.font = `bold ${fontSize}px "Hiragino Sans", "Noto Sans JP", "Meiryo", sans-serif`;
    }
    
    // 中央揃えで描画
    const lineHeight = fontSize * 1.2;
    let startY = (HEIGHT / 2) - ((lines.length - 1) * lineHeight / 2);
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], WIDTH / 2, startY + (i * lineHeight));
    }
    
    // サイン風のロゴテキストを右下に配置（CSSの.logoTextクラスに準拠）
    ctx.save(); // 現在の描画状態を保存
    
    // 右下にロゴを配置
    const logoX = WIDTH - 280;
    const logoY = HEIGHT - 80;
    
    // テキストの回転設定（-5度）
    ctx.translate(logoX, logoY);
    ctx.rotate(-5 * Math.PI / 180);
    
    // ロゴテキストのスタイル設定
    ctx.font = 'bold 72px "Caveat", cursive'; // フォント名をクォートなしで指定
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = COLORS.title; // --heading-color相当
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'; // text-shadow
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // ロゴテキスト描画
    ctx.fillText('Coffee Break Point', 0, 0);
    
    ctx.restore(); // 描画状態を元に戻す
    
    // // サイトURLを描画
    // ctx.font = '24px "Hiragino", sans-serif';
    // ctx.fillStyle = '#F1E7D6';
    // ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    // ctx.shadowBlur = 2;
    // ctx.shadowOffsetX = 1;
    // ctx.shadowOffsetY = 1;
    // ctx.fillText('blog.shaba.dev', WIDTH / 2, HEIGHT - 40);

    // 画像を保存
    // skia-canvasのバージョンによってtoBufferが同期か非同期かが変わる可能性があるため、
    // Promiseとして扱い、適切に解決する
    const bufferPromise = canvas.toBuffer('image/png');
    const buffer = bufferPromise instanceof Promise ? await bufferPromise : bufferPromise;
    
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // タイムスタンプを含むファイル名
    const fileName = id === 'default' ? 'default.png' : `${id}-${BUILD_TIMESTAMP}.png`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
    
    // 以前のバージョンのファイルを削除（デフォルト画像以外）
    if (id !== 'default') {
      try {
        const files = await readdir(OUTPUT_DIR);
        const fileRegex = new RegExp(`^${id}-\\d+\\.png$`);
        
        for (const file of files) {
          if (file.startsWith(`${id}-`) && file !== fileName && fileRegex.test(file)) {
            fs.unlinkSync(path.join(OUTPUT_DIR, file));
            console.log(`Removed old OGP image: ${file}`);
          }
        }
      } catch (err) {
        console.error(`Error cleaning up old OGP images for ${id}:`, err);
      }
    }
    
    console.log(`Generated OG image for: ${title} (${fileName})`);
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
 * スラッグ化関数（文字列をURL用のスラッグに変換）
 * @param {string} str - スラッグ化する文字列
 * @returns {string} - スラッグ化された文字列
 */
function slugify(str) {
  if (!str) return '';
  return String(str).toLowerCase()
    .replace(/\s+/g, '-')        // スペースをハイフンに置換
    .replace(/[^a-z0-9-]/g, '-') // 英数字とハイフン以外をハイフンに置換
    .replace(/-+/g, '-')         // 連続するハイフンを一つにまとめる
    .replace(/^-|-$/g, '');      // 先頭と末尾のハイフンを削除
}

/**
 * Notionからブログのページリストを取得する
 * @returns {Promise<Array<Object>>} - ブログページオブジェクトの配列
 */
async function getNotionBlogPages() {
  try {
    if (!NOTION_TOKEN || !NOTION_BLOG_DATABASE) {
      console.error('Notion API credentials not found in environment variables.');
      return [];
    }

    // 公開済みの記事のみを取得
    const response = await notionClient.databases.query({
      database_id: NOTION_BLOG_DATABASE,
      filter: {
        and: [{
          property: 'Published',
          checkbox: { equals: true }
        }],
      },
      sorts: [
        {
          property: 'Published_Time',
          direction: 'descending'
        }
      ]
    });

    // 記事情報を変換
    return response.results.map(page => {
      // タイトル取得
      const title = page.properties.Name?.title?.[0]?.plain_text || 'Untitled';
      
      // スラッグ取得
      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || slugify(title);
      
      // カバー画像取得
      let coverImageUrl = null;
      if (page.cover) {
        if (page.cover.type === 'external') {
          coverImageUrl = page.cover.external.url;
        } else if (page.cover.type === 'file') {
          coverImageUrl = page.cover.file.url;
        }
      }
      
      return {
        id: page.id,
        title,
        slug,
        coverImageUrl
      };
    });
  } catch (error) {
    console.error('Error fetching Notion blog pages:', error);
    return [];
  }
}

/**
 * 外部画像URLからローカルに画像を保存する
 * @param {string} imageUrl - 画像URL
 * @param {string} slug - 記事スラッグ
 * @returns {Promise<string|null>} - 保存したローカルパス、または失敗時はnull
 */
async function downloadImage(imageUrl, slug) {
  try {
    if (!imageUrl) return null;
    
    // 画像保存用のディレクトリを作成
    const headerImagesDir = path.join(process.cwd(), 'public', 'header-images');
    if (!fs.existsSync(headerImagesDir)) {
      fs.mkdirSync(headerImagesDir, { recursive: true });
    }
    
    // 画像の拡張子を取得 (URLのパス部分の最後の.以降)
    const fileExtension = path.extname(new URL(imageUrl).pathname) || '.jpg';
    
    // 保存先のパス
    const imagePath = path.join(headerImagesDir, `${slug}${fileExtension}`);
    
    // 既に存在する場合は再利用
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
    
    // HTTPSモジュールをrequire
    const https = require('https');
    
    // 画像をダウンロードして保存
    await new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }
        
        const file = fs.createWriteStream(imagePath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(imagePath, () => {}); // 失敗した場合、部分的なファイルを削除
          reject(err);
        });
      }).on('error', reject);
    });
    
    return imagePath;
  } catch (error) {
    console.error(`Error downloading image for ${slug}:`, error);
    return null;
  }
}

/**
 * NotionのブログページからOGP画像生成用のマッピング情報を取得
 * @returns {Promise<Array<Object>>} - OGP画像生成用のマッピング配列
 */
async function getNotionPageMappings() {
  try {
    // Notionからブログページを取得
    const notionPages = await getNotionBlogPages();
    
    if (!notionPages || notionPages.length === 0) {
      console.warn('No published pages found in Notion database.');
      return [];
    }
    
    console.log(`Found ${notionPages.length} published pages in Notion.`);
    
    // 各ページについて、カバー画像をダウンロードし、マッピング情報を作成
    const mappings = [];
    
    for (const page of notionPages) {
      // カバー画像がある場合はダウンロード
      let headerImagePath = null;
      if (page.coverImageUrl) {
        headerImagePath = await downloadImage(page.coverImageUrl, page.slug);
      }
      
      mappings.push({
        id: page.id,
        title: page.title,
        slug: page.slug,
        headerImagePath
      });
    }
    
    return mappings;
  } catch (error) {
    console.error('Error creating Notion page mappings:', error);
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
    
    // Caveatフォントのセットアップ
    console.log('Setting up Caveat font...');
    await setupCaveatFont();
    
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
        
        // Notionから記事情報を取得
        console.log('Fetching posts from Notion...');
        const notionMappings = await getNotionPageMappings();
        
        if (notionMappings.length > 0) {
          console.log(`Found ${notionMappings.length} published posts in Notion.`);
          
          // 各記事のOGP画像を生成
          for (const mapping of notionMappings) {
            const { id, title, slug, headerImagePath } = mapping;
            console.log(`Generating OG image for: ${title} (${slug})`);
            await generateOgImage(title, slug, headerImagePath);
          }
        } else {
          console.log('No published posts found in Notion.');
          
          // Notionから取得できない場合は、従来のサムネイル方式を試す
          console.log('Trying to find existing thumbnail images as fallback...');
          const findThumbnailImage = async (slug) => {
            if (!fs.existsSync(THUMBNAIL_DIR)) return null;
            const files = await readdir(THUMBNAIL_DIR);
            for (const file of files) {
              const filename = path.basename(file, path.extname(file));
              const fileSlug = slugify(filename);
              if (fileSlug === slug || filename === slug) {
                return path.join(THUMBNAIL_DIR, file);
              }
            }
            return null;
          };
          
          // 既存のOGP画像ディレクトリから記事IDを推測
          if (fs.existsSync(OUTPUT_DIR)) {
            const ogFiles = await readdir(OUTPUT_DIR);
            for (const file of ogFiles) {
              if (file === 'default.png') continue;
              
              const slug = path.basename(file, path.extname(file));
              const thumbnailPath = await findThumbnailImage(slug);
              
              if (thumbnailPath) {
                console.log(`Found thumbnail for ${slug}, regenerating OG image...`);
                await generateOgImage(slug, slug, thumbnailPath);
              }
            }
          }
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
