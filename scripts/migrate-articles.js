#!/usr/bin/env node
/**
 * 記事マイグレーションスクリプト
 * content/posts/*.md → ~/workspaces/articles/articles/*.md
 *
 * 変換内容：
 * 1. タグ文字列をtaxonomy.tomlのIDに変換
 * 2. published フィールドを追加（draft=falseなら published=true）
 * 3. ファイルをarticlesリポジトリにコピー
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// タグマッピング: 文字列 → taxonomy.toml ID
const TAG_MAPPING = {
  '開発環境とツール活用': 'dev-tools',
  '個人開発・自動化プロジェクト': 'side-project',
  '思考・ライフログ・ポエム': 'poem',
  'キャリアと子育ての両立': 'career',
};

// カラー出力
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function migrateArticle(filePath, destDir) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdown } = matter(content);

  // published フィールド追加
  frontmatter.published = !frontmatter.draft;

  // タグを配列形式のIDに変換
  if (Array.isArray(frontmatter.tags)) {
    frontmatter.tags = frontmatter.tags.map(tag => {
      const tagId = TAG_MAPPING[tag];
      if (!tagId) {
        console.warn(`${colors.yellow}⚠️  Unknown tag: "${tag}" in ${path.basename(filePath)}${colors.reset}`);
        return tag; // マッピングがない場合はそのまま
      }
      return tagId;
    });
  } else {
    frontmatter.tags = [];
  }

  // series は空文字列なら削除
  if (frontmatter.series === '') {
    delete frontmatter.series;
  }

  // 不要なフィールド削除
  delete frontmatter.draft;
  delete frontmatter.author; // ブログ側で共通管理するため削除

  // 新しいMarkdownを生成
  const newContent = matter.stringify(markdown, frontmatter);

  // ファイルをコピー
  const fileName = path.basename(filePath);
  const destPath = path.join(destDir, fileName);
  fs.writeFileSync(destPath, newContent, 'utf-8');

  console.log(`${colors.green}✓${colors.reset} ${fileName}`);
}

function main() {
  const sourceDir = path.join(__dirname, '../content/posts');
  const destDir = path.join(process.env.HOME, 'workspaces/articles/articles');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

  console.log(`${colors.blue}📝 Migrating ${files.length} articles...${colors.reset}\n`);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    migrateArticle(filePath, destDir);
  }

  console.log(`\n${colors.green}✨ Migration completed!${colors.reset}`);
  console.log(`${colors.blue}📁 Destination: ${destDir}${colors.reset}\n`);
}

main();
