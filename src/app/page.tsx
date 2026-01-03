import { Metadata } from 'next';
import { CommonDataService } from '../services/CommonDataService';
import PortfolioPageClient from '../components/PortfolioPageClient';

export const metadata: Metadata = {
  title: 'Coffee Break Point',
  description: 'Web Developer & Solopreneur - コーヒー休憩にちょうどよい技術よみものを目指して',
};

export default async function HomePage() {
  const latestArticles = await CommonDataService.getLatestArticles(5);

  return <PortfolioPageClient latestArticles={latestArticles} />;
}
