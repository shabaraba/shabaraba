import React from 'react';
import Layout from '../components/layouts/Layout';
import ArticleList from '../components/blog/ArticleList';
import { ArticleServiceFactory } from '../../../core/factories/ArticleServiceFactory';
import styles from './HomePage.module.css';

// getStaticProps関数でデータを取得する場合の型定義
interface HomePageProps {
  articles: any[];
}

/**
 * ホームページコンポーネント
 */
export default function HomePage({ articles }: HomePageProps) {
  return (
    <Layout>
      <div className={styles.hero}>
        <h1 className={styles.title}>Coffee Break Point</h1>
        <p className={styles.subtitle}>
          プログラミングやデザイン、日々の気づきをお届けするブログです
        </p>
      </div>
      <ArticleList articles={articles} />
    </Layout>
  );
}

// データ取得関数
export async function getStaticProps() {
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const articles = await articleService.getArticleList();
    
    return {
      props: {
        articles,
      },
      // revalidateオプションを削除
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      props: {
        articles: [],
      },
      // revalidateオプションを削除
    };
  }
}