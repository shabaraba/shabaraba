#!/usr/bin/env node

/**
 * Notionの関連記事設定をGitHub articlesリポジトリのMarkdownファイルに反映するスクリプト
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_BLOG_DATABASE = process.env.NOTION_BLOG_DATABASE;
const NOTION_VERSION = process.env.NOTION_VERSION || '2022-06-28';
const ARTICLES_DIR = '/Users/shaba/workspaces/articles/articles';

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

// Notionから関連記事設定を取得
async function getNotionRelations() {
  console.log('🔍 Notionデータベースから記事を取得中...\n');

  const response = await notion.databases.query({
    database_id: NOTION_BLOG_DATABASE,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
  });

  const relationsMap = new Map();

  for (const page of response.results) {
    if (!('properties' in page)) continue;

    const properties = page.properties;

    // Slug取得
    let slug = '';
    if (properties.Slug && 'rich_text' in properties.Slug && properties.Slug.rich_text.length > 0) {
      slug = properties.Slug.rich_text[0].plain_text;
    }

    if (!slug) continue;

    // Relations取得
    let relationSlugs = [];
    if (properties.Relations && 'relation' in properties.Relations && properties.Relations.relation.length > 0) {
      const relationIds = properties.Relations.relation.map((rel) => rel.id);

      // 関連記事のSlugを取得
      for (const relId of relationIds) {
        try {
          const relPage = await notion.pages.retrieve({ page_id: relId });
          if ('properties' in relPage) {
            let relSlug = '';
            if (relPage.properties.Slug && 'rich_text' in relPage.properties.Slug && relPage.properties.Slug.rich_text.length > 0) {
              relSlug = relPage.properties.Slug.rich_text[0].plain_text;
            }
            if (relSlug) {
              relationSlugs.push(relSlug);
            }
          }
        } catch (error) {
          console.warn(`     ⚠️  関連記事取得エラー (ID: ${relId}):`, error.message);
        }
      }
    }

    if (relationSlugs.length > 0) {
      relationsMap.set(slug, relationSlugs);
    }
  }

  return relationsMap;
}

// Markdownファイルのfrontmatterを更新
function updateMarkdownFile(filePath, relatedArticles) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // frontmatterを解析
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.warn(`   ⚠️  frontmatterが見つかりません: ${filePath}`);
    return false;
  }

  const frontmatterContent = frontmatterMatch[1];
  const bodyContent = content.substring(frontmatterMatch[0].length);

  // relatedArticles行を削除または更新
  let newFrontmatter = frontmatterContent.replace(/^relatedArticles:.*$/m, '');

  // 新しいrelatedArticlesを追加
  const relatedArticlesYaml = `relatedArticles:\n${relatedArticles.map(slug => `  - ${slug}`).join('\n')}`;
  newFrontmatter = newFrontmatter.trim() + '\n' + relatedArticlesYaml;

  const newContent = `---\n${newFrontmatter}\n---${bodyContent}`;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  return true;
}

async function syncRelations() {
  try {
    // Notionから関連記事設定を取得
    const relationsMap = await getNotionRelations();

    console.log(`\n✅ Notionから${relationsMap.size}件の関連記事設定を取得しました\n`);

    if (!fs.existsSync(ARTICLES_DIR)) {
      console.error(`❌ articlesディレクトリが見つかりません: ${ARTICLES_DIR}`);
      console.error('   先に git clone https://github.com/shabaraba/articles.git /tmp/articles を実行してください');
      process.exit(1);
    }

    let updatedCount = 0;
    let notFoundCount = 0;

    // 各記事ファイルを更新
    for (const [slug, relatedArticles] of relationsMap.entries()) {
      // Markdownファイルを検索
      const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
      const targetFile = files.find(f => f.includes(slug));

      if (!targetFile) {
        console.log(`⚠️  ${slug}: ファイルが見つかりません`);
        notFoundCount++;
        continue;
      }

      const filePath = path.join(ARTICLES_DIR, targetFile);
      const success = updateMarkdownFile(filePath, relatedArticles);

      if (success) {
        console.log(`✅ ${slug}: 関連記事を更新 (${relatedArticles.length}件)`);
        console.log(`   → ${relatedArticles.join(', ')}`);
        updatedCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 更新結果:');
    console.log(`   更新成功: ${updatedCount}件`);
    console.log(`   ファイル未検出: ${notFoundCount}件`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 次のステップ:');
    console.log('   1. cd /tmp/articles');
    console.log('   2. git diff で変更を確認');
    console.log('   3. git add . && git commit -m "feat: sync related articles from Notion"');
    console.log('   4. git push');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

syncRelations();
