#!/usr/bin/env node

/**
 * GitHubリポジトリから記事本文用の画像をダウンロードするスクリプト
 * ビルド時に実行され、記事本文の画像をpublic/images/articles/<slug>/に配置する
 *
 * GitHub Raw Content経由でダウンロード（レート制限なし）
 */

const fs = require('fs');
const path = require('path');

// INCOMING_HOOK_BODYからarticlesブランチを取得
let articlesBranch = 'main';
if (process.env.INCOMING_HOOK_BODY) {
  try {
    const hookBody = JSON.parse(process.env.INCOMING_HOOK_BODY);
    articlesBranch = hookBody.articles_branch || 'main';
    console.log(`📌 Using articles branch: ${articlesBranch}`);
  } catch (e) {
    console.log('⚠️  Failed to parse INCOMING_HOOK_BODY, using main branch');
  }
}

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'shabaraba';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Articles';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || articlesBranch;

const SOURCE_PATH = 'images/articles';
const ARTICLE_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'articles');
const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp|gif|svg)$/i;

/**
 * GitHub API (REST)でディレクトリ配下のファイル一覧を再帰的に取得
 * Note: raw.githubusercontent.comはレート制限なし
 */
async function fetchArticleImagesList(dirPath = SOURCE_PATH) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dirPath}?ref=${GITHUB_BRANCH}`;

  const headers = {
    'User-Agent': 'Notiography-Build-Script',
    'Accept': 'application/vnd.github.v3+json',
  };

  // プライベートリポジトリの場合は認証トークンが必要
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      console.log(`⚠️  ${dirPath} ディレクトリが見つかりません`);
      return [];
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const entries = await response.json();

  const imageFiles = entries
    .filter(entry => entry.type === 'file')
    .filter(entry => IMAGE_PATTERN.test(entry.name))
    .map(entry => ({
      // SOURCE_PATHからの相対パス（例: my-article/screenshot.png）
      relativePath: entry.path.slice(SOURCE_PATH.length + 1),
      download_url: entry.download_url, // raw.githubusercontent.com のURL
    }));

  // 記事slugごとのサブディレクトリを再帰的に辿る
  const subDirs = entries.filter(entry => entry.type === 'dir');
  for (const dir of subDirs) {
    imageFiles.push(...await fetchArticleImagesList(dir.path));
  }

  return imageFiles;
}

/**
 * 画像ファイルをダウンロード（fetch使用）
 */
async function downloadImage(downloadUrl, filename, outputPath) {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`Failed to download ${filename}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

/**
 * メイン処理
 */
async function main() {
  console.log('🖼️  GitHubリポジトリから記事本文用画像を取得中...\n');

  try {
    // 出力ディレクトリを作成
    if (!fs.existsSync(ARTICLE_IMAGES_DIR)) {
      fs.mkdirSync(ARTICLE_IMAGES_DIR, { recursive: true });
      console.log(`✅ ディレクトリ作成: ${ARTICLE_IMAGES_DIR}\n`);
    }

    // 記事本文用画像の一覧を取得
    const imageFiles = await fetchArticleImagesList();
    console.log(`📊 記事本文用画像: ${imageFiles.length}件\n`);

    if (imageFiles.length === 0) {
      console.log('⚠️  記事本文用画像が見つかりませんでした');
      return;
    }

    // 各画像をダウンロード
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of imageFiles) {
      const outputPath = path.join(ARTICLE_IMAGES_DIR, file.relativePath);

      // 既に存在する場合はスキップ
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  ${file.relativePath}: スキップ（既存）`);
        skipCount++;
        continue;
      }

      try {
        await downloadImage(file.download_url, file.relativePath, outputPath);
        console.log(`✅ ${file.relativePath}: ダウンロード完了`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${file.relativePath}: エラー - ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ダウンロード結果:');
    console.log(`   成功: ${successCount}件`);
    console.log(`   スキップ: ${skipCount}件`);
    console.log(`   エラー: ${errorCount}件`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
