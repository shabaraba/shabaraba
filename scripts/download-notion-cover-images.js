#!/usr/bin/env node

/**
 * Notionからアイキャッチ画像をダウンロードするスクリプト
 * 各記事のページカバー画像を public/images/covers/ にダウンロード
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_BLOG_DATABASE = process.env.NOTION_BLOG_DATABASE;
const NOTION_VERSION = process.env.NOTION_VERSION || '2022-06-28';
const COVERS_DIR = path.join(process.cwd(), 'public', 'images', 'covers');

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN is not set');
  process.exit(1);
}

if (!NOTION_BLOG_DATABASE) {
  console.error('❌ NOTION_BLOG_DATABASE is not set');
  process.exit(1);
}

const notion = new Client({
  auth: NOTION_TOKEN,
  notionVersion: NOTION_VERSION,
});

/**
 * 画像をダウンロード
 */
async function downloadImage(url, outputPath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

/**
 * メイン処理
 */
async function main() {
  console.log('🖼️  Notionからアイキャッチ画像をダウンロード中...\n');

  try {
    // 出力ディレクトリを作成
    if (!fs.existsSync(COVERS_DIR)) {
      fs.mkdirSync(COVERS_DIR, { recursive: true });
    }

    // 公開記事を取得
    const response = await notion.databases.query({
      database_id: NOTION_BLOG_DATABASE,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    });

    console.log(`📊 公開記事: ${response.results.length}件\n`);

    let successCount = 0;
    let skipCount = 0;
    let noCoverCount = 0;
    let errorCount = 0;

    for (const page of response.results) {
      if (!('properties' in page)) continue;

      const properties = page.properties;

      // Slug取得
      let slug = '';
      if (properties.Slug && 'rich_text' in properties.Slug && properties.Slug.rich_text.length > 0) {
        slug = properties.Slug.rich_text[0].plain_text;
      }

      if (!slug) {
        console.log(`⚠️  Slugなし: スキップ`);
        skipCount++;
        continue;
      }

      // カバー画像URL取得
      let coverUrl = null;
      if (page.cover) {
        if (page.cover.type === 'external') {
          coverUrl = page.cover.external.url;
        } else if (page.cover.type === 'file') {
          coverUrl = page.cover.file.url;
        }
      }

      if (!coverUrl) {
        console.log(`⏭️  ${slug}: カバー画像なし`);
        noCoverCount++;
        continue;
      }

      // 拡張子を判定（URLから推測）
      let ext = 'jpg';
      if (coverUrl.includes('.png')) {
        ext = 'png';
      } else if (coverUrl.includes('.webp')) {
        ext = 'webp';
      }

      const outputPath = path.join(COVERS_DIR, `${slug}.${ext}`);

      // 既存ファイルがある場合はスキップ
      const existingFiles = [
        path.join(COVERS_DIR, `${slug}.jpg`),
        path.join(COVERS_DIR, `${slug}.png`),
        path.join(COVERS_DIR, `${slug}.webp`),
      ];

      if (existingFiles.some(f => fs.existsSync(f))) {
        console.log(`⏭️  ${slug}: スキップ（既存）`);
        skipCount++;
        continue;
      }

      try {
        await downloadImage(coverUrl, outputPath);
        console.log(`✅ ${slug}.${ext}: ダウンロード完了`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${slug}: エラー - ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ダウンロード結果:');
    console.log(`   成功: ${successCount}件`);
    console.log(`   スキップ: ${skipCount}件`);
    console.log(`   カバー画像なし: ${noCoverCount}件`);
    console.log(`   エラー: ${errorCount}件`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
