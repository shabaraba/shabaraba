import React from 'react';
import ArticleList from './ArticleList';
import Pagination from '../common/Pagination';
import { ArticleListItem } from '../../core/interfaces/article/ArticleRepository';
import styles from './PaginatedArticleList.module.css';

interface PaginatedArticleListProps {
  articles: ArticleListItem[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages?: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
}

/**
 * ページネーション付き記事一覧コンポーネント
 * 静的サイト生成（SSG）に対応
 */
export default function PaginatedArticleList({
  articles,
  totalItems,
  itemsPerPage,
  currentPage,
  totalPages = Math.ceil(totalItems / itemsPerPage),
  baseUrl,
  queryParams = {}
}: PaginatedArticleListProps) {
  return (
    <div className={styles.container}>
      <ArticleList articles={articles} />
      {totalPages > 1 && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          baseUrl={baseUrl}
          queryParams={queryParams}
        />
      )}
    </div>
  );
}
