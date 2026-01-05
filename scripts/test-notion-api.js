/**
 * Notion API接続テストスクリプト
 *
 * 使い方:
 * node scripts/test-notion-api.js
 */

const { Client } = require('@notionhq/client');
require('dotenv').config();

async function testNotionAPI() {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_BLOG_DATABASE;

  if (!token || !databaseId) {
    console.error('❌ 環境変数が設定されていません');
    console.error('NOTION_TOKEN:', token ? '設定済み' : '未設定');
    console.error('NOTION_BLOG_DATABASE:', databaseId ? '設定済み' : '未設定');
    process.exit(1);
  }

  console.log('🔄 Notion APIに接続中...\n');

  try {
    const notion = new Client({ auth: token });

    // 記事一覧を取得
    console.log('📚 全記事を取得中...');
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [{
          property: 'Published',
          checkbox: { equals: true }
        }],
      },
      sorts: [
        {
          property: "Published_Time",
          direction: "descending"
        }
      ]
    });

    console.log(`\n✅ ${response.results.length}件の記事を取得しました\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    response.results.forEach((page, index) => {
      const title = page.properties.Name?.title?.[0]?.plain_text || '(タイトルなし)';
      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';
      const publishedTime = page.properties.Published_Time?.date?.start || '';
      const tags = page.properties.Tags?.multi_select?.map(tag => tag.name) || [];

      console.log(`\n${index + 1}. ${title}`);
      console.log(`   ID: ${page.id}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   Published: ${publishedTime}`);
      if (tags.length > 0) {
        console.log(`   Tags: ${tags.join(', ')}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // トレンド記事を取得
    console.log('🔥 トレンド記事を取得中...');
    const trendingResponse = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Published',
            checkbox: { equals: true }
          },
          {
            property: 'Trend',
            checkbox: { equals: true }
          }
        ],
      },
      sorts: [
        {
          property: "Published_Time",
          direction: "descending"
        }
      ]
    });

    if (trendingResponse.results.length > 0) {
      console.log(`\n✅ ${trendingResponse.results.length}件のトレンド記事を取得しました\n`);
      trendingResponse.results.forEach((page, index) => {
        const title = page.properties.Name?.title?.[0]?.plain_text || '(タイトルなし)';
        console.log(`${index + 1}. ${title}`);
      });
    } else {
      console.log('\nℹ️  トレンド記事は登録されていません');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ テスト完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error('メッセージ:', error.message);
    if (error.code) {
      console.error('エラーコード:', error.code);
    }
    if (error.body) {
      console.error('詳細:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

// スクリプトを実行
testNotionAPI();
