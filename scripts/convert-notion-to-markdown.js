/**
 * Notion記事をMarkdownファイルに一括変換するスクリプト
 *
 * 使い方:
 * node scripts/convert-notion-to-markdown.js
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const OUTPUT_DIR = path.join(__dirname, '../content/posts');
const IMAGES_DIR = path.join(__dirname, '../public/images/covers');

// Notion APIクライアント
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_BLOG_DATABASE;

/**
 * 画像をダウンロードしてローカルに保存
 * @param {string} imageUrl - ダウンロードする画像のURL
 * @param {string} slug - 記事のスラッグ（ファイル名として使用）
 * @returns {Promise<string>} ローカルの画像パス（/images/covers/slug.jpg）
 */
async function downloadImage(imageUrl, slug) {
  if (!imageUrl) return '';

  try {
    // 画像ディレクトリが存在しない場合は作成
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    // まずURLから拡張子を判定
    let extension = '.jpg';
    try {
      const urlPath = new URL(imageUrl).pathname;
      const match = urlPath.match(/\.(jpg|jpeg|png|webp|gif)$/i);
      if (match) {
        extension = match[0].toLowerCase();
      }
    } catch (error) {
      // URL解析失敗時は後でContent-Typeから判定
    }

    // 既存ファイルを拡張子違いも含めてチェック
    const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    for (const ext of possibleExtensions) {
      const existingPath = path.join(IMAGES_DIR, `${slug}${ext}`);
      if (fs.existsSync(existingPath)) {
        console.log(`   ⏭️  画像スキップ（既存）: ${slug}${ext}`);
        return `/images/covers/${slug}${ext}`;
      }
    }

    // 画像をダウンロード
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer'
    });

    // URLから拡張子が取れなかった場合、Content-Typeから判定
    if (extension === '.jpg') {
      const contentType = response.headers['content-type'];
      if (contentType === 'image/png') extension = '.png';
      else if (contentType === 'image/webp') extension = '.webp';
      else if (contentType === 'image/gif') extension = '.gif';
      // jpeg系はデフォルトの.jpgのまま
    }

    // 最終的なファイル名とパス
    const fileName = `${slug}${extension}`;
    const filePath = path.join(IMAGES_DIR, fileName);

    // ファイルに保存
    fs.writeFileSync(filePath, response.data);
    console.log(`   📥 画像ダウンロード: ${fileName}`);

    return `/images/covers/${fileName}`;

  } catch (error) {
    console.warn(`   ⚠️  画像ダウンロード失敗: ${error.message}`);
    return imageUrl; // ダウンロード失敗時は元のURLを返す
  }
}

/**
 * フロントマターを生成
 */
async function generateFrontMatter(page, slug) {
  const props = page.properties;

  const title = props.Name?.title?.[0]?.plain_text || 'Untitled';
  const publishedAt = props.Published_Time?.date?.start || new Date().toISOString();
  const tags = props.Tags?.multi_select?.map(tag => tag.name) || [];

  // iconとcoverImageはページオブジェクトの直接のプロパティ
  const icon = page.icon?.emoji || page.icon?.external?.url || '📝';
  const trend = props.Trend?.checkbox || false;
  const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || '';

  // カバー画像をダウンロード
  const coverImageUrl = page.cover?.external?.url || page.cover?.file?.url || '';
  const coverImage = await downloadImage(coverImageUrl, slug);

  const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
publishedAt: "${publishedAt}"
updatedAt: "${page.last_edited_time}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
icon: "${icon}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
coverImage: "${coverImage}"
series: ""
trend: ${trend}
relatedArticles: []
draft: false
author: "shabaraba"
---

`;

  return frontMatter;
}

/**
 * RichTextを Markdown形式に変換
 */
function richTextToMarkdown(richTexts) {
  if (!richTexts || !Array.isArray(richTexts)) return '';

  return richTexts.map(text => {
    let content = text.plain_text;

    // アノテーションを適用
    if (text.annotations) {
      if (text.annotations.bold) content = `**${content}**`;
      if (text.annotations.italic) content = `*${content}*`;
      if (text.annotations.code) content = `\`${content}\``;
      if (text.annotations.strikethrough) content = `~~${content}~~`;
    }

    // リンクの場合
    if (text.href) {
      content = `[${content}](${text.href})`;
    }

    return content;
  }).join('');
}

/**
 * Notionブロックを Markdown形式に変換
 */
async function blockToMarkdown(block, depth = 0) {
  const indent = '  '.repeat(depth);
  let markdown = '';

  switch (block.type) {
    case 'paragraph':
      const paragraphText = richTextToMarkdown(block.paragraph.rich_text || block.paragraph.text);
      markdown = paragraphText ? `${paragraphText}\n\n` : '\n';
      break;

    case 'heading_1':
      markdown = `# ${richTextToMarkdown(block.heading_1.rich_text || block.heading_1.text)}\n\n`;
      break;

    case 'heading_2':
      markdown = `## ${richTextToMarkdown(block.heading_2.rich_text || block.heading_2.text)}\n\n`;
      break;

    case 'heading_3':
      markdown = `### ${richTextToMarkdown(block.heading_3.rich_text || block.heading_3.text)}\n\n`;
      break;

    case 'bulleted_list_item':
      const bulletText = richTextToMarkdown(block.bulleted_list_item.rich_text || block.bulleted_list_item.text);
      markdown = `${indent}- ${bulletText}\n`;

      // 子要素を処理
      if (block.has_children && block.bulleted_list_item.children) {
        for (const child of block.bulleted_list_item.children.results) {
          markdown += await blockToMarkdown(child, depth + 1);
        }
      }
      break;

    case 'numbered_list_item':
      const numberedText = richTextToMarkdown(block.numbered_list_item.rich_text || block.numbered_list_item.text);
      markdown = `${indent}1. ${numberedText}\n`;

      // 子要素を処理
      if (block.has_children && block.numbered_list_item.children) {
        for (const child of block.numbered_list_item.children.results) {
          markdown += await blockToMarkdown(child, depth + 1);
        }
      }
      break;

    case 'quote':
      const quoteText = richTextToMarkdown(block.quote.rich_text || block.quote.text);
      markdown = `> ${quoteText}\n\n`;
      break;

    case 'code':
      const codeText = richTextToMarkdown(block.code.rich_text || block.code.text);
      const language = block.code.language || '';
      markdown = `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
      break;

    case 'image':
      const imageUrl = block.image.file?.url || block.image.external?.url || '';
      const caption = block.image.caption?.[0]?.plain_text || '';
      markdown = `![${caption}](${imageUrl})\n\n`;
      break;

    case 'bookmark':
      markdown = `${block.bookmark.url}\n\n`;
      break;

    case 'callout':
      const calloutIcon = block.callout.icon?.emoji || '💡';
      const calloutText = richTextToMarkdown(block.callout.rich_text || block.callout.text);
      markdown = `:::callout{type="info" icon="${calloutIcon}"}\n${calloutText}\n:::\n\n`;
      break;

    case 'embed':
      markdown = `${block.embed.url}\n\n`;
      break;

    case 'divider':
      markdown = `---\n\n`;
      break;

    case 'link_preview':
      // link_previewはbookmarkと同様に扱う
      markdown = `${block.link_preview?.url || ''}\n\n`;
      break;

    case 'toggle':
      const toggleTitle = richTextToMarkdown(block.toggle.rich_text || block.toggle.text);
      markdown = `:::toggle{summary="${toggleTitle.replace(/"/g, '\\"')}"}\n`;

      // 子要素を処理
      if (block.has_children && block.toggle.children) {
        for (const child of block.toggle.children.results) {
          markdown += await blockToMarkdown(child, 0);
        }
      }

      markdown += `:::\n\n`;
      break;

    default:
      console.warn(`Unsupported block type: ${block.type}`);
  }

  return markdown;
}

/**
 * 記事の本文を取得してMarkdownに変換
 */
async function getArticleContent(pageId) {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100
  });

  let markdown = '';

  for (const block of blocks.results) {
    // 子要素を持つ場合は取得
    if (block.has_children && !['bulleted_list_item', 'numbered_list_item'].includes(block.type)) {
      const children = await notion.blocks.children.list({
        block_id: block.id
      });
      block[block.type].children = children;
    }

    markdown += await blockToMarkdown(block);
  }

  return markdown;
}

/**
 * ファイル名を生成（日付-スラッグ.md）
 */
function generateFileName(page) {
  const publishedAt = page.properties.Published_Time?.date?.start || new Date().toISOString();
  const date = publishedAt.split('T')[0]; // YYYY-MM-DD
  const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || 'untitled';

  return `${date}-${slug}.md`;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔄 Notion記事を取得中...\n');

  try {
    // 公開済み記事を取得
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true }
      },
      sorts: [{
        property: 'Published_Time',
        direction: 'descending'
      }]
    });

    console.log(`✅ ${response.results.length}件の記事を取得しました\n`);

    // 出力ディレクトリを作成
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 各記事を変換
    for (let i = 0; i < response.results.length; i++) {
      const page = response.results[i];
      const title = page.properties.Name?.title?.[0]?.plain_text || 'Untitled';
      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';

      console.log(`[${i + 1}/${response.results.length}] 変換中: ${title}`);

      try {
        // フロントマター生成（カバー画像のダウンロードを含む）
        const frontMatter = await generateFrontMatter(page, slug);

        // 本文取得・変換
        const content = await getArticleContent(page.id);

        // Markdownファイル生成
        const markdown = frontMatter + content;

        // ファイル保存
        const fileName = generateFileName(page);
        const filePath = path.join(OUTPUT_DIR, fileName);

        fs.writeFileSync(filePath, markdown, 'utf8');
        console.log(`   ✅ 保存: ${fileName}`);

        // API制限を避けるため少し待機
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`   ❌ エラー: ${error.message}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 変換完了！');
    console.log(`📁 出力先: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error('メッセージ:', error.message);
    if (error.body) {
      console.error('詳細:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

// 実行
main();
