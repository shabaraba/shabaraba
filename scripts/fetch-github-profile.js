const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub APIのURL
const GITHUB_API_URL = 'https://api.github.com/users/shabaraba';
const IMAGE_PATH = path.join(process.cwd(), 'public/images/github-profile.jpg');

// GitHub APIからデータを取得する関数
async function fetchGithubProfile() {
  return new Promise((resolve, reject) => {
    const req = https.get(
      GITHUB_API_URL,
      {
        headers: {
          'User-Agent': 'Notiography-Build-Script'
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// 画像を取得して保存する関数
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(resolve);
        console.log(`Image downloaded to ${filepath}`);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // エラー時にファイルを削除
      reject(err);
    });
  });
}

// メイン処理
async function main() {
  try {
    console.log('Fetching GitHub profile for shabaraba...');
    const profile = await fetchGithubProfile();
    
    if (profile && profile.avatar_url) {
      console.log('Avatar URL found: ' + profile.avatar_url);
      await downloadImage(profile.avatar_url, IMAGE_PATH);
      console.log('GitHub profile image has been successfully fetched and saved.');
    } else {
      console.error('Failed to get avatar URL from GitHub API.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    process.exit(1);
  }
}

// スクリプト実行
main();
