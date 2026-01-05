/**
 * 記事インデックスを生成するスクリプト
 *
 * Markdownファイルから記事のメタデータを抽出し、
 * 高速なアクセスのためにJSONファイルとして保存します。
 *
 * 差分ビルドのために、各記事のハッシュ値も記録します。
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');
const OUTPUT_FILE = path.join(process.cwd(), 'content', 'posts', 'index.json');
const CACHE_FILE = path.join(process.cwd(), '.next', 'cache', 'markdown-build-cache.json');

/**
 * ファイルのハッシュ値を計算
 */
function calculateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * 全てのMarkdownファイルを再帰的に取得
 */
async function getAllMarkdownFiles(dir, files = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && entry.name !== '_templates') {
        await getAllMarkdownFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * 前回のビルドキャッシュを読み込み
 */
async function loadBuildCache() {
  try {
    const content = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return { files: {} };
  }
}

/**
 * ビルドキャッシュを保存
 */
async function saveBuildCache(cache) {
  const cacheDir = path.dirname(CACHE_FILE);
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔍 Building article index...');

  // Markdownファイル一覧を取得
  const files = await getAllMarkdownFiles(CONTENT_DIR);
  console.log(`📄 Found ${files.length} markdown files`);

  // 前回のビルドキャッシュを読み込み
  const buildCache = await loadBuildCache();
  const newBuildCache = { files: {}, timestamp: new Date().toISOString() };

  const articles = [];
  let changedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const fileHash = calculateHash(content);
      const relativePath = path.relative(process.cwd(), file);

      // キャッシュと比較
      const cached = buildCache.files[relativePath];
      const hasChanged = !cached || cached.hash !== fileHash;

      if (hasChanged) {
        changedCount++;
      } else {
        skippedCount++;
      }

      // メタデータを抽出
      const { data: frontmatter } = matter(content);

      // 下書きは除外
      if (frontmatter.draft) {
        continue;
      }

      // 記事情報を追加
      articles.push({
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt || '',
        publishedAt: frontmatter.publishedAt,
        updatedAt: frontmatter.updatedAt,
        tags: frontmatter.tags || [],
        coverImage: frontmatter.coverImage,
        icon: frontmatter.icon,
        trend: frontmatter.trend || false,
        series: frontmatter.series,
      });

      // 新しいキャッシュに追加
      newBuildCache.files[relativePath] = {
        hash: fileHash,
        slug: frontmatter.slug,
        lastModified: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  // 公開日降順でソート
  articles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // インデックスファイルを保存
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(articles, null, 2));
  console.log(`✅ Article index saved to ${OUTPUT_FILE}`);
  console.log(`📊 Total articles: ${articles.length}`);
  console.log(`🔄 Changed: ${changedCount}, Skipped: ${skippedCount}`);

  // ビルドキャッシュを保存
  await saveBuildCache(newBuildCache);
  console.log(`💾 Build cache saved`);
}

main().catch(console.error);
