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
  // Layoutコンポーネントと競合しないように、OGP画像の設定は行わない
  // SEO関連の設定のみを担当する
  return (
    <NextSeo
      title={title}
      openGraph={{
        title: title,
        // OGP画像設定はLayoutコンポーネントで行うため除外
      }}
    />
  );
}