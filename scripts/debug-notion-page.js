/**
 * Notionページの詳細情報を確認するデバッグスクリプト
 */

const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_BLOG_DATABASE;

async function debugPage() {
  try {
    // 最新の記事を1件取得
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true }
      },
      sorts: [{
        property: 'Published_Time',
        direction: 'descending'
      }],
      page_size: 1
    });

    if (response.results.length === 0) {
      console.log('記事が見つかりませんでした');
      return;
    }

    const page = response.results[0];

    console.log('=== ページの完全な構造 ===\n');
    console.log(JSON.stringify(page, null, 2));

    console.log('\n=== プロパティ一覧 ===\n');
    for (const [key, value] of Object.entries(page.properties)) {
      console.log(`${key}: ${value.type}`);
    }

    console.log('\n=== カバー画像情報 ===\n');
    console.log('page.cover:', page.cover);

    console.log('\n=== アイコン情報 ===\n');
    console.log('page.icon:', page.icon);

  } catch (error) {
    console.error('エラー:', error.message);
  }
}

debugPage();
