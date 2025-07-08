const fs = require('fs');
const path = require('path');

// SVG template for OG image
const svgTemplate = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F5F5DC;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#DDBEA9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#CB997E;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" rx="12"/>
  
  <!-- Decorative circles -->
  <circle cx="240" cy="504" r="100" fill="rgba(217, 152, 115, 0.3)" opacity="0.5"/>
  <circle cx="960" cy="126" r="80" fill="rgba(75, 56, 50, 0.1)" opacity="0.5"/>
  
  <!-- Main title: Shaba -->
  <text x="600" y="280" 
        font-family="serif" 
        font-size="96" 
        font-weight="bold" 
        fill="#4B3832" 
        text-anchor="middle" 
        transform="rotate(-2 600 280)"
        filter="url(#shadow)"
        style="font-style: italic;">
    Shaba
  </text>
  
  <!-- Subtitle: Web Developer & Solopreneur -->
  <text x="600" y="380" 
        font-family="serif" 
        font-size="48" 
        font-weight="500" 
        fill="#A67C52" 
        text-anchor="middle"
        style="font-style: italic;">
    Web Developer &amp; Solopreneur
  </text>
</svg>
`;

// Convert SVG to PNG using base64 (simple approach)
const outputPath = path.resolve(__dirname, '../public/og-images/default.svg');
fs.writeFileSync(outputPath, svgTemplate.trim());

console.log('✅ SVG OG画像が生成されました:', outputPath);
console.log('💡 SVGからPNGに変換するには、オンラインコンバーターを使用するか、');
console.log('   ブラウザでSVGを開いてスクリーンショットを撮ってください。');

// Also create HTML version for easy PNG conversion
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 0; }
        .og-container { 
            width: 1200px; 
            height: 630px; 
            display: inline-block; 
        }
    </style>
</head>
<body>
    <div class="og-container">
        ${svgTemplate}
    </div>
</body>
</html>
`;

const htmlOutputPath = path.resolve(__dirname, '../public/og-images/default-svg.html');
fs.writeFileSync(htmlOutputPath, htmlTemplate);

console.log('✅ HTML版も生成されました:', htmlOutputPath);
console.log('🌐 ブラウザでHTMLを開いてスクリーンショットを撮ることでPNG化できます');