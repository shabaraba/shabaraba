'use client';

import dynamic from 'next/dynamic';
import { IPageHead } from '../core/types/NotionPageApiResponses';

const HomePageContent = dynamic(() => import('./HomePageClient'), {
  ssr: false,
});

interface PortfolioPageClientProps {
  latestArticles: IPageHead[];
}

export default function PortfolioPageClient({ latestArticles }: PortfolioPageClientProps) {
  return <HomePageContent latestArticles={latestArticles} />;
}
