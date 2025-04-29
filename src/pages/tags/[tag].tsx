import React from 'react';
import { ACTIVE_THEME } from '../../lib/themeSelector';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { CommonDataService } from '../../services/CommonDataService';

// 動的にテーマのタグページコンポーネントをインポート
const HomePage = require(`../../themes/${ACTIVE_THEME}/pages/HomePage`).default;

interface TagPageProps {
  articles: IPageHead[];
  tag: string;
  sidebarData: {
    trendingPosts: IPageHead[];
    tags: any[];
    series: any[];
  };
}

/**
 * タグページコンポーネント
 * 特定のタグに関連する記事一覧を表示します
 */
export default function TagPage({ articles, tag, sidebarData }: TagPageProps) {
  // タイトルをタグ名に合わせて表示
  const title = `${tag} の記事一覧 | Coffee Break Point`;
  const description = `「${tag}」タグに関連する記事一覧ページです`;

  return (
    <HomePage 
      articles={articles} 
      sidebarData={sidebarData}
      customTitle={title}
      customDescription={description}
      tagName={tag}
    />
  );
}

// 静的パスを生成するための関数
export async function getStaticPaths() {
  try {
    const commonData = await CommonDataService.getAllData();
    
    // すべてのタグからパスを生成
    const tagSet = new Set<string>();
    commonData.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          tagSet.add(tag.name.toLowerCase());
        });
      }
    });
    
    const paths = Array.from(tagSet).map(tag => ({
      params: { tag }
    }));
    
    console.log(`Generated ${paths.length} tag paths for SSG`);
    
    return {
      paths,
      fallback: false, // 存在しないパスは404
    };
  } catch (error) {
    console.error('Error generating tag paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

// 静的ページ生成のためのデータ取得関数
export async function getStaticProps({ params }) {
  const tagName = params.tag;
  
  try {
    // タグに関連する記事を取得
    const articles = await CommonDataService.getArticlesByTag(tagName);
    
    // サイドバーデータを取得
    const sidebarData = await CommonDataService.getSidebarData();
    
    return {
      props: {
        articles,
        tag: tagName,
        sidebarData
      }
    };
  } catch (error) {
    console.error(`Error fetching articles for tag "${tagName}":`, error);
    return {
      notFound: true,
    };
  }
}