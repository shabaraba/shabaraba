/**
 * NotionのPublishedプロパティの変更を監視するスクリプト
 * 
 * GitHubアクションから呼び出され、Notionの投稿のPublishedプロパティの変更を検出します。
 * 変更があった場合は終了コード1を返し、GitHubアクションのワークフローをトリガーします。
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

// Notionクライアントの初期化
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// データベースID
const DATABASE_ID = process.env.NOTION_BLOG_DATABASE;

// 最新の公開状態を取得する関数
async function getPublishedArticles() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [{
          property: 'Published',
          checkbox: { equals: true }
        }],
      },
    });

    return response.results.map((page) => ({
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || 'Untitled',
      published: page.properties.Published.checkbox,
      slug: page.properties.Slug.rich_text[0]?.plain_text || null,
      publishedTime: page.properties.Published_Time.date?.start || null,
    }));
  } catch (error) {
    console.error('Error querying Notion database:', error);
    process.exit(1);
  }
}

// キャッシュファイルのパス
const fs = require('fs');
const path = require('path');
const CACHE_FILE = path.join(__dirname, '../.notion-published-cache.json');

// 前回の公開状態を読み込む
function loadPreviousState() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading previous state:', error);
  }
  return { articles: [], lastChecked: null };
}

// 現在の状態を保存
function saveCurrentState(articles) {
  try {
    const data = {
      articles: articles,
      lastChecked: new Date().toISOString()
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving current state:', error);
  }
}

// 変更を検出する
function detectChanges(previousArticles, currentArticles) {
  // 前回のデータがない場合は変更なしとする（初回実行時）
  if (!previousArticles || previousArticles.length === 0) {
    console.log('No previous data available. Initializing cache...');
    return false;
  }

  // 公開状態が変わった記事を検出
  const prevIds = new Set(previousArticles.map(article => article.id));
  const currentIds = new Set(currentArticles.map(article => article.id));

  // 新しく公開された記事
  const newlyPublished = currentArticles.filter(article => !prevIds.has(article.id));
  
  // 公開が取り消された記事
  const unpublished = previousArticles.filter(article => !currentIds.has(article.id));

  // 変更があったかどうか
  const hasChanges = newlyPublished.length > 0 || unpublished.length > 0;

  // 結果をログに出力
  if (hasChanges) {
    console.log('Changes detected:');
    
    if (newlyPublished.length > 0) {
      console.log('Newly published articles:');
      newlyPublished.forEach(article => {
        console.log(`- ${article.title} (${article.id})`);
      });
    }
    
    if (unpublished.length > 0) {
      console.log('Unpublished articles:');
      unpublished.forEach(article => {
        console.log(`- ${article.title} (${article.id})`);
      });
    }
  } else {
    console.log('No changes detected');
  }

  return hasChanges;
}

// メイン関数
async function main() {
  console.log('Checking for changes in Notion published articles...');
  
  // 前回の状態を読み込む
  const previousState = loadPreviousState();
  const previousArticles = previousState.articles || [];
  
  // 現在の公開記事を取得
  const currentArticles = await getPublishedArticles();
  
  // 変更を検出
  const hasChanges = detectChanges(previousArticles, currentArticles);
  
  // 現在の状態を保存
  saveCurrentState(currentArticles);
  
  // 変更があった場合は終了コード1を返す
  if (hasChanges) {
    console.log('Changes detected. Triggering deploy...');
    process.exit(0);  // GitHubアクションでは成功を示す
  } else {
    console.log('No changes detected. Exiting...');
    process.exit(0);  // 変更なしの場合も成功扱い
  }
}

// スクリプト実行
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
