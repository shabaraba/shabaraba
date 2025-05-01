import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Layout from '../components/layouts/Layout';
import ArticleDetail from '../components/blog/ArticleDetail';
import { ArticleServiceFactory } from '../../../core/factories/ArticleServiceFactory';
import { Article } from '../../../core/interfaces/article/ArticleRepository';
import { Seo } from '../../../components/units/common/Seo';

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
      slug={article.slug}
    >
      {/* Seoコンポーネントは互換性のために残しておきますが、
          主要なOGP情報はLayoutでHTMLに直接出力されます */}
      <Seo title={article.title} slug={article.slug} />
      <ArticleDetail article={article} />
    </Layout>
  );
}

