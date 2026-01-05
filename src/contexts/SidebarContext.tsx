'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { IPageHead, IPageTag } from 'core/types/NotionPageApiResponses';

// タグデータの型
export interface TagData {
  id: number;
  name: string;
  count: number;
  size: string;
  color: string;
}

// シリーズデータの型
export interface SeriesData {
  name: string;
  count: number;
}

// サイドバーコンテキストの型
interface SidebarContextType {
  trendingPosts: IPageHead[];
  tags: TagData[];
  series: SeriesData[];
  isLoading: boolean;
}

// デフォルト値
const defaultSidebarContext: SidebarContextType = {
  trendingPosts: [],
  tags: [],
  series: [],
  isLoading: true
};

// コンテキストの作成
const SidebarContext = createContext<SidebarContextType>(defaultSidebarContext);

// コンテキストのプロバイダーコンポーネント
interface SidebarProviderProps {
  children: ReactNode;
  trendingPosts: IPageHead[];
  tags: TagData[];
  series: SeriesData[];
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  trendingPosts,
  tags,
  series
}) => {
  const value = {
    trendingPosts,
    tags,
    series,
    isLoading: false
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// サイドバーデータを使用するためのカスタムフック
export const useSidebarData = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarData must be used within a SidebarProvider');
  }
  return context;
};
