#!/bin/bash
# OGP画像生成用バックアップスクリプト
# Node.jsスクリプトが失敗した場合に、既存画像をコピーして使用します

# ディレクトリパス設定
ROOT_DIR="$(pwd)"
PUBLIC_DIR="${ROOT_DIR}/public"
IMAGES_DIR="${PUBLIC_DIR}/images"
OG_IMAGES_DIR="${PUBLIC_DIR}/og-images"
THUMBNAIL_DIR="${PUBLIC_DIR}/thumbnailImage"

# 出力ディレクトリの作成
mkdir -p "${OG_IMAGES_DIR}"

echo "Starting OG image generation (shell script backup)..."

# デフォルトOGP画像のコピー
if [ -f "${IMAGES_DIR}/CoffeeBreakPoint.png" ]; then
  cp "${IMAGES_DIR}/CoffeeBreakPoint.png" "${OG_IMAGES_DIR}/default.png"
  echo "Copied default OG image successfully"
else
  echo "Default image not found at: ${IMAGES_DIR}/CoffeeBreakPoint.png"
fi

# サムネイル画像をOGP画像にコピー
if [ -d "${THUMBNAIL_DIR}" ]; then
  echo "Copying thumbnail images as OG images..."
  # サムネイル画像のファイル名からID（スラッグ）を抽出
  for thumbnail in "${THUMBNAIL_DIR}"/*; do
    if [ -f "$thumbnail" ]; then
      # ファイル名から拡張子を除いた部分をIDとして使用
      filename=$(basename -- "$thumbnail")
      id="${filename%.*}"
      
      # URLエンコードされたファイル名をデコード（簡易的な実装）
      id=$(echo "$id" | sed 's/%20/ /g')
      
      # 特殊文字を置換してスラッグ化
      slug=$(echo "$id" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
      
      # OGP画像としてコピー
      cp "$thumbnail" "${OG_IMAGES_DIR}/${slug}.png"
      echo "Copied OG image for: $slug"
    fi
  done
else
  echo "Thumbnail directory not found at: ${THUMBNAIL_DIR}"
fi

echo "OG image generation (shell script) completed!"
