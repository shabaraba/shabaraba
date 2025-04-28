import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Layout from '../components/layouts/Layout';
import ArticleDetail from '../components/blog/ArticleDetail';
import { ArticleServiceFactory } from '../../../core/factories/ArticleServiceFactory';
import { Article } from '../../../core/interfaces/article/ArticleRepository';

// URLパラメータの型定義
interface Params extends ParsedUrlQuery {
  slug: string;
}

// ページコンポーネントのpropsの型定義
interface ArticlePageProps {
  article: Article;
}

/**
 * 記事詳細ページコンポーネント
 */
export default function ArticlePage({ article }: ArticlePageProps) {
  if (!article) {
    return <div>記事が見つかりませんでした。</div>;
  }

  return (
    <Layout
      title={`${article.title} | Coffee Break Point`}
      description={article.excerpt || ''}
    >
      <ArticleDetail article={article} />
    </Layout>
  );
}

/**
 * 静的パスを生成するための関数
 */
export const getStaticPaths: GetStaticPaths<Params> = async () => {
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const slugs = await articleService.getArticleSlugs();
    
    const paths = slugs.map((slug) => ({
      params: { slug },
    }));
    
    return {
      paths,
      fallback: false, // blockingから変更。exportモードではfalseのみサポート
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false, // blockingから変更
    };
  }
};
