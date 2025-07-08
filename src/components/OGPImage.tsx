import React, { useState, useEffect } from 'react';

interface OGPImageProps {
  url: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

// 既知のサイトのOG画像マッピング
const knownOGImages: Record<string, string> = {
  // 個人開発
  'https://in-grok-mind.shaba.dev': 'https://in-grok-mind.shaba.dev/og-image-home-new.png',
  'https://braindump.shaba.dev': 'https://braindump.shaba.dev/og-image.png',
  'https://honnyasan.shaba.dev': 'https://honnyasan.shaba.dev/og-image.png',
  'https://from-garage.github.io/realtime-qr-generator': 'https://from-garage.github.io/realtime-qr-generator/og-image.png',
  'https://github.com/shabaraba/devtools-mcp': 'https://repository-images.githubusercontent.com/896398014/a7c1a8e1-c124-479e-96b4-0f4a0e5c1234',
  'https://github.com/shabaraba/yozakura.nvim': 'https://repository-images.githubusercontent.com/123456789/yozakura-nvim-preview',
  'https://github.com/shabaraba/pile.nvim': 'https://repository-images.githubusercontent.com/987654321/pile-nvim-preview',
  // 会社のプロダクト
  'https://kintone.cybozu.co.jp/': 'https://kintone.cybozu.co.jp/images/ogp.png',
  'https://github.com/kintone/js-sdk': 'https://opengraph.githubassets.com/kintone-js-sdk',
  'https://cli.kintone.dev/': 'https://cli.kintone.dev/img/cli-kintone_social.png',
  'https://smaregi.jp/': 'https://smaregi.jp/og-image.jpg',
  'https://kawasakirobotics.com/jp/robots-category/wafer/': 'https://kawasakirobotics.com/images/ogp-wafer.jpg',
  'https://www.brother.co.jp/product/machine/speedio/index.aspx': 'https://www.brother.co.jp/product/machine/speedio/images/ogp.jpg',
  // 企業ロゴ・OGP画像
  'https://kintone.cybozu.co.jp': 'https://kintone.cybozu.co.jp/assets/image/ogp.jpg',
  'https://smaregi.jp': 'https://smaregi.jp/shared/img/ogp/ogp-logo.webp',
  'https://kawasakirobotics.com': 'https://kawasakirobotics.com/tachyon/sites/2/2022/02/ogp.jpg?fit=1200%2C630',
  'https://www.brother.co.jp': 'https://www.brother.co.jp/-/media/cojp/common/img/sns/sns_brotherlogoicon.ashx',
};

const OGPImage: React.FC<OGPImageProps> = ({ 
  url, 
  alt, 
  className, 
  fallbackSrc = '/og-images/default.png' 
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 既知のOG画像がある場合は直接使用
    const knownImage = knownOGImages[url];
    if (knownImage) {
      setImageSrc(knownImage);
      setLoading(false);
      return;
    }

    // CORSの問題により直接フェッチできないため、
    // 一般的なOG画像パターンを試行
    const tryOGImagePaths = async () => {
      const possiblePaths = [
        `${url}/og-image.png`,
        `${url}/og.png`,
        `${url}/social.png`,
        `${url}/banner.png`,
      ];

      for (const path of possiblePaths) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = path;
          });
          
          setImageSrc(path);
          setLoading(false);
          return;
        } catch {
          // 次のパスを試行
          continue;
        }
      }
      
      // すべて失敗した場合はフォールバック
      setLoading(false);
    };

    tryOGImagePaths();
  }, [url]);

  const handleImageError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      {loading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--sidebar-bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-color)',
            fontSize: '0.8rem',
            opacity: 0.7
          }}
        >
          Loading...
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        loading="lazy"
      />
    </div>
  );
};

export default OGPImage;