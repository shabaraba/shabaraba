/**
 * Notion API接続テストスクリプト
 *
 * 使い方:
 * npx ts-node scripts/test-notion-api.ts
 */

import dotenv from 'dotenv';
import NotionRepository from '../src/application/modules/post/repositories/NotionRepository.js';

// 環境変数の読み込み
dotenv.config();

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
    const repository = new NotionRepository(token, databaseId);

    // 記事一覧を取得
    console.log('📚 全記事を取得中...');
    const posts = await repository.getPostList();

    console.log(`\n✅ ${posts.length}件の記事を取得しました\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.published_time}`);
      if (post.tags && post.tags.length > 0) {
        console.log(`   Tags: ${post.tags.join(', ')}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // トレンド記事を取得
    console.log('🔥 トレンド記事を取得中...');
    const trendingPosts = await repository.getTrendingPosts();

    if (trendingPosts.length > 0) {
      console.log(`\n✅ ${trendingPosts.length}件のトレンド記事を取得しました\n`);
      trendingPosts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
      });
    } else {
      console.log('\nℹ️  トレンド記事は登録されていません');
    }

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    if (error instanceof Error) {
      console.error('メッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// スクリプトを実行
testNotionAPI();
