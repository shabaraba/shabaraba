const https = require('https');
const fs = require('fs');
const path = require('path');

// プロジェクトのURL一覧
const projects = [
  {
    id: 'in-grok-mind',
    url: 'https://in-grok-mind.shaba.dev',
    ogImagePath: '/images/og-images/in-grok-mind.png'
  },
  {
    id: 'braindump',
    url: 'https://braindump.shaba.dev',
    ogImagePath: '/images/og-images/braindump.png'
  },
  {
    id: 'honnyasan',
    url: 'https://honnyasan.shaba.dev',
    ogImagePath: '/images/og-images/honnyasan.png'
  },
  {
    id: 'realtime-qr',
    url: 'https://from-garage.github.io/realtime-qr-generator',
    ogImagePath: '/og-images/realtime-qr.png'
  },
  {
    id: 'devtools-mcp',
    url: 'https://github.com/shabaraba/devtools-mcp',
    ogImagePath: '/og-images/devtools-mcp.png'
  },
  {
    id: 'yozakura-nvim',
    url: 'https://github.com/shabaraba/yozakura.nvim',
    ogImagePath: '/og-images/yozakura-nvim.png'
  },
  {
    id: 'pile-nvim',
    url: 'https://github.com/shabaraba/pile.nvim',
    ogImagePath: '/og-images/pile-nvim.png'
  }
];

// OG画像をダウンロードする関数
async function downloadOGImage(project) {
  // GitHubプロジェクトの場合はデフォルト画像を使用
  if (project.url.includes('github.com')) {
    console.log(`Skipping GitHub project: ${project.id}`);
    return;
  }

  const outputPath = path.join(__dirname, '..', 'public', 'og-images', `${project.id}.png`);
  
  // 既に存在する場合はスキップ
  if (fs.existsSync(outputPath)) {
    console.log(`OG image already exists for: ${project.id}`);
    return;
  }

  console.log(`Note: OG image fetch would be implemented for: ${project.id}`);
  // 実際のOG画像取得は、各サイトのメタタグを解析する必要があるため、
  // ここではプレースホルダーとして記載
}

// ディレクトリが存在しない場合は作成
const ogImagesDir = path.join(__dirname, '..', 'public', 'og-images');
if (!fs.existsSync(ogImagesDir)) {
  fs.mkdirSync(ogImagesDir, { recursive: true });
}

// 各プロジェクトのOG画像をダウンロード
projects.forEach(project => {
  downloadOGImage(project);
});

console.log('OG image fetch process completed.');