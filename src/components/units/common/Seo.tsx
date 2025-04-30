import { isNull } from 'lodash';
import { NextSeo } from 'next-seo';
import { FC } from 'react';

type Props = {
  title: string;
  slug?: string;
  coverImageUrl?: string;
}

/**
 * SEOコンポーネント
 * OGP画像はビルド時に生成されたものを使用
 */
export const Seo: FC<Props> = ({ title, slug, coverImageUrl }) => {
  // サイトのベースURL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.shaba.dev';
  
  // スラッグをIDに変換（スラッグが指定されていない場合はデフォルト画像を使用）
  const ogImageId = slug ? slug : 'default';
  
  // OGP画像URL
  const imageUrl = `${baseUrl}/og-images/${ogImageId}.png`;
  
  // 画像のサイズ設定（OGPのメタデータに必要）
  const imageWidth = 1200;
  const imageHeight = 630;
  
  return (
    <NextSeo
      openGraph={{
        title: title,
        images: [
          {
            url: imageUrl,
            width: imageWidth,
            height: imageHeight,
            alt: title,
          },
        ],
      }}
    />
  );
}