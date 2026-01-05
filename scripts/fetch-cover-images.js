#!/usr/bin/env node

/**
 * GitHubリポジトリからカバー画像をダウンロードするスクリプト
 * ビルド時に実行され、記事のカバー画像をpublic/images/coversに配置する
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'shabaraba';
const GITHUB_REPO = process.env.GITHUB_REPO || 'articles';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const COVERS_DIR = path.join(process.cwd(), 'public', 'images', 'covers');

// GraphQL クエリ: covers ディレクトリ内のファイル一覧を取得
const GRAPHQL_QUERY = `
query($owner: String!, $repo: String!, $branch: String!) {
  repository(owner: $owner, name: $repo) {
    object(expression: $branch) {
      ... on Commit {
        tree {
          entries {
            name
            type
            object {
              ... on Tree {
                entries {
                  name
                  type
                  oid
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

/**
 * GraphQL APIでファイル一覧を取得
 */
async function fetchCoverImagesList() {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Notiography-Build-Script',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: GRAPHQL_QUERY,
      variables: {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        branch: GITHUB_BRANCH,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  // リポジトリルートのエントリから covers ディレクトリを探す
  const rootEntries = data.data?.repository?.object?.tree?.entries || [];
  const coversEntry = rootEntries.find(entry => entry.name === 'covers' && entry.type === 'tree');

  if (!coversEntry || !coversEntry.object) {
    console.log('⚠️  covers ディレクトリが見つかりません');
    return [];
  }

  // covers ディレクトリ内の画像ファイルを抽出
  const coverFiles = coversEntry.object.entries
    .filter(entry => entry.type === 'blob')
    .filter(entry => /\.(jpg|jpeg|png|webp)$/i.test(entry.name));

  return coverFiles;
}

/**
 * 画像ファイルをダウンロード
 */
async function downloadImage(filename, outputPath) {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/covers/${filename}`;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // エラー時はファイル削除
      reject(err);
    });
  });
}

/**
 * メイン処理
 */
async function main() {
  console.log('🖼️  GitHubリポジトリからカバー画像を取得中...\n');

  try {
    // 出力ディレクトリを作成
    if (!fs.existsSync(COVERS_DIR)) {
      fs.mkdirSync(COVERS_DIR, { recursive: true });
      console.log(`✅ ディレクトリ作成: ${COVERS_DIR}\n`);
    }

    // カバー画像一覧を取得
    const coverFiles = await fetchCoverImagesList();
    console.log(`📊 カバー画像: ${coverFiles.length}件\n`);

    if (coverFiles.length === 0) {
      console.log('⚠️  カバー画像が見つかりませんでした');
      return;
    }

    // 各画像をダウンロード
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of coverFiles) {
      const outputPath = path.join(COVERS_DIR, file.name);

      // 既に存在する場合はスキップ
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  ${file.name}: スキップ（既存）`);
        skipCount++;
        continue;
      }

      try {
        await downloadImage(file.name, outputPath);
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
