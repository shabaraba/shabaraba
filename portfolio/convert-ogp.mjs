import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { DOMParser } from 'xmldom';
import { JSDOM } from 'jsdom';

// Node.jsでSVGを変換する方法として簡易的なアプローチを示します
// 実際の変換には専用ツールを使用したほうが良いです

// ダミーのPNG画像を作成
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

// 背景色を設定
ctx.fillStyle = '#070A14';
ctx.fillRect(0, 0, 1200, 630);

// 青いグラデーション効果（単純化）
const gradient = ctx.createRadialGradient(600, 315, 0, 600, 315, 600);
gradient.addColorStop(0, 'rgba(0, 165, 255, 0.3)');
gradient.addColorStop(1, 'rgba(7, 10, 20, 0)');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1200, 630);

// テキストを描画
ctx.fillStyle = 'white';
ctx.font = 'bold 80px Inter, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('<SB/>', 600, 250);

ctx.font = 'bold 60px Inter, sans-serif';
ctx.fillText('Shabaraba', 600, 350);

ctx.font = '500 40px Inter, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
ctx.fillText('Developer Portfolio', 600, 425);

// いくつかの粒子効果を描画
ctx.fillStyle = 'rgba(0, 165, 255, 0.7)';
for (let i = 0; i < 20; i++) {
  const x = Math.random() * 1200;
  const y = Math.random() * 630;
  const radius = Math.random() * 3 + 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// PNGとして保存
const pngBuffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/ogp.png', pngBuffer);
console.log('OGP画像がPNG形式で保存されました: ./public/ogp.png');

// JPGとしても保存 (ファイルサイズが小さくなる場合が多い)
const jpgBuffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
fs.writeFileSync('./public/ogp.jpg', jpgBuffer);
console.log('OGP画像がJPG形式でも保存されました: ./public/ogp.jpg');