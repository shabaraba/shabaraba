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

