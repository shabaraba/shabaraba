#!/usr/bin/env node

/**
 * Notionデータベースから全記事を取得し、関連記事の設定状況を確認するスクリプト
 */

const { Client } = require('@notionhq/client');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_BLOG_DATABASE = process.env.NOTION_BLOG_DATABASE;
const NOTION_VERSION = process.env.NOTION_VERSION || '2022-06-28';

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

async function checkNotionRelations() {
  console.log('🔍 Notionデータベースから記事を取得中...\n');

  try {
    const response = await notion.databases.query({
      database_id: NOTION_BLOG_DATABASE,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Published_Time',
          direction: 'descending',
        },
      ],
    });

    console.log(`📊 取得した記事数: ${response.results.length}\n`);

    const articlesWithRelations = [];
    const articlesWithoutRelations = [];

    for (const page of response.results) {
      if (!('properties' in page)) continue;

      const properties = page.properties;

      // タイトル取得
      let title = 'Untitled';
      if (properties.Title && 'title' in properties.Title && properties.Title.title.length > 0) {
        title = properties.Title.title[0].plain_text;
      }

      // Slug取得
      let slug = '';
      if (properties.Slug && 'rich_text' in properties.Slug && properties.Slug.rich_text.length > 0) {
        slug = properties.Slug.rich_text[0].plain_text;
      }

      // Relations取得
      let relationsCount = 0;
      let relationIds = [];
      if (properties.Relations && 'relation' in properties.Relations) {
        relationsCount = properties.Relations.relation.length;
        relationIds = properties.Relations.relation.map((rel) => rel.id);
      }

      const articleInfo = {
        title,
        slug,
        relationsCount,
        relationIds,
        pageId: page.id,
      };

      if (relationsCount > 0) {
        articlesWithRelations.push(articleInfo);
      } else {
        articlesWithoutRelations.push(articleInfo);
      }
    }

    // 関連記事が設定されている記事を表示
    console.log('✅ 関連記事が設定されている記事:\n');
    if (articlesWithRelations.length === 0) {
      console.log('  なし\n');
    } else {
      for (const article of articlesWithRelations) {
        console.log(`  📝 ${article.title}`);
        console.log(`     Slug: ${article.slug}`);
        console.log(`     関連記事数: ${article.relationsCount}`);
        console.log(`     Page ID: ${article.pageId}`);

        // 関連記事の詳細を取得
        if (article.relationIds.length > 0) {
          console.log(`     関連記事:`);
          for (const relId of article.relationIds) {
            try {
              const relPage = await notion.pages.retrieve({ page_id: relId });
              if ('properties' in relPage) {
                let relTitle = 'Untitled';
                if (relPage.properties.Title && 'title' in relPage.properties.Title && relPage.properties.Title.title.length > 0) {
                  relTitle = relPage.properties.Title.title[0].plain_text;
                }
                let relSlug = '';
                if (relPage.properties.Slug && 'rich_text' in relPage.properties.Slug && relPage.properties.Slug.rich_text.length > 0) {
                  relSlug = relPage.properties.Slug.rich_text[0].plain_text;
                }
                console.log(`       - ${relTitle} (${relSlug})`);
              }
            } catch (error) {
              console.log(`       - [取得エラー: ${relId}]`);
            }
          }
        }
        console.log('');
      }
    }

    // 統計情報
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 統計情報:');
    console.log(`   全記事数: ${response.results.length}`);
    console.log(`   関連記事あり: ${articlesWithRelations.length}`);
    console.log(`   関連記事なし: ${articlesWithoutRelations.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.code === 'object_not_found') {
      console.error('   データベースが見つかりません。NOTION_BLOG_DATABASEを確認してください。');
    } else if (error.code === 'unauthorized') {
      console.error('   認証エラー。NOTION_TOKENが正しいか、データベースへのアクセス権限があるか確認してください。');
    }
    process.exit(1);
  }
}

checkNotionRelations();
