'use client';

import NextLink from 'next/link';
import { ComponentProps } from 'react';

/**
 * プリフェッチを無効化したLinkコンポーネント
 * 静的エクスポートでは全ページが既に生成されているため、プリフェッチは不要
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={false} />;
}
