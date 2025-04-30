/**
 * TOML設定ファイルをJSONに変換してpublicディレクトリに配置するスクリプト
 * 
 * - 開発サーバー起動前（npm run dev）
 * - ビルド前（npm run build）
 * 
 * に実行され、クライアントサイドからも設定を読み込めるようにします
 */

const fs = require('fs');
const path = require('path');
const TOML = require('@iarna/toml');

// 設定ファイルのパス
const CONFIG_FILE_PATH = path.join(process.cwd(), 'src/config/site.toml');
// 出力先のパス
const OUTPUT_DIR = path.join(process.cwd(), 'public/config');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'site-config.json');

// 出力先ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

try {
  // TOMLファイルを読み込む
  const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
  
  // TOMLをパース
  const config = TOML.parse(fileContent);
  
  // JSONとして出力
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(config, null, 2));
  
  console.log(`✅ Config converted and saved to ${OUTPUT_PATH}`);
} catch (error) {
  console.error(`❌ Error converting config:`, error);
  process.exit(1);
}
