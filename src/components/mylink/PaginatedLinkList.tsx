import React from 'react';
import Pagination from '../common/Pagination';
import { MyLinkEntity } from '../../core/entities/MyLinkEntity';
import MyLinkList from './MyLinkList';
import styles from './PaginatedLinkList.module.css';

interface PaginatedLinkListProps {
  mylinks: MyLinkEntity[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
}

/**
 * ページネーション付きリンク一覧コンポーネント
 * 静的サイト生成（SSG）に対応
 */
export default function PaginatedLinkList({
  mylinks,
  totalItems,
  itemsPerPage,
  currentPage,
  totalPages = Math.ceil(totalItems / itemsPerPage),
  baseUrl,
  queryParams = {}
}: PaginatedLinkListProps) {
  return (
    <div className={styles.container}>
      <MyLinkList mylinks={mylinks} />
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
