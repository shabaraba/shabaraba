#!/usr/bin/env node

/**
 * GitHubリポジトリから記事のOG画像をダウンロードするスクリプト
 * ビルド時に実行され、記事のOG画像をpublic/og-imagesに配置する
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

const OG_IMAGES_DIR = path.join(process.cwd(), 'public', 'og-images');

/**
 * GitHub API (REST)でファイル一覧を取得
 * Note: raw.githubusercontent.comはレート制限なし
 */
async function fetchOGImagesList() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/images/og-images?ref=${GITHUB_BRANCH}`;

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
      console.log('⚠️  images/og-images ディレクトリが見つかりません');
      return [];
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const files = await response.json();

  // 画像ファイルのみを抽出
  const ogFiles = files
    .filter(file => file.type === 'file')
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file.name))
    .map(file => ({
      name: file.name,
      download_url: file.download_url, // raw.githubusercontent.com のURL
    }));

  return ogFiles;
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
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

/**
 * メイン処理
 */
async function main() {
  console.log('🖼️  GitHubリポジトリから記事のOG画像を取得中...\n');

  try {
    // 出力ディレクトリを作成
    if (!fs.existsSync(OG_IMAGES_DIR)) {
      fs.mkdirSync(OG_IMAGES_DIR, { recursive: true });
      console.log(`✅ ディレクトリ作成: ${OG_IMAGES_DIR}\n`);
    }

    // OG画像一覧を取得
    const ogFiles = await fetchOGImagesList();
    console.log(`📊 記事のOG画像: ${ogFiles.length}件\n`);

    if (ogFiles.length === 0) {
      console.log('⚠️  OG画像が見つかりませんでした（まだ生成されていない可能性があります）');
      return;
    }

    // 各画像をダウンロード
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of ogFiles) {
      const outputPath = path.join(OG_IMAGES_DIR, file.name);

      // 既に存在する場合はスキップ
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  ${file.name}: スキップ（既存）`);
        skipCount++;
        continue;
      }

      try {
        await downloadImage(file.download_url, file.name, outputPath);
        console.log(`✅ ${file.name}: ダウンロード完了`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${file.name}: エラー - ${error.message}`);
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
