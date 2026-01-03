import { Metadata } from 'next';
import { ArticleServiceFactory } from '../../../../core/factories/ArticleServiceFactory';
import { CommonDataService } from '../../../../services/CommonDataService';
import ArticlePageClient from '../../../../components/ArticlePageClient';

// 静的パスを生成（App Routerでは generateStaticParams）
export async function generateStaticParams() {
  try {
    console.log('[generateStaticParams] ARTICLE_SOURCE:', process.env.ARTICLE_SOURCE);
    const postHeadService = ArticleServiceFactory.createArticleHeadService();
    const pathParams = await postHeadService.getPathParams();
    console.log('[generateStaticParams] Generated paths:', JSON.stringify(pathParams, null, 2));

    // App Routerの形式に変換: [{params: {id: "slug"}}] -> [{id: "slug"}]
    return pathParams.map((item: any) => ({
      id: item.params.id,
    }));
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}

// メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const article = await articleService.getArticleBySlug(id);

    // OG画像のパスを生成（/og-images/{slug}.pngの規則）
    const ogImageUrl = `/og-images/${id}.png`;

    return {
      title: article.title || 'Article',
      description: article.summary || 'Blog article',
      openGraph: {
        title: article.title,
        description: article.summary,
        type: 'article',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const article = await articleService.getArticleBySlug(id);

    // サイドバーデータを取得
    const sidebarData = await CommonDataService.getSidebarData();

    return <ArticlePageClient article={article} sidebarData={sidebarData} />;
  } catch (error) {
    console.error(`Error fetching article with slug "${id}":`, error);
    // notFound()を呼び出してNext.jsの404ページを表示
    throw new Error('Article not found');
  }
}
