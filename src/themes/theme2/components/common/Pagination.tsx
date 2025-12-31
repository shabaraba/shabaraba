import React from 'react';
import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  baseUrl: string;
}

/**
 * ページネーションコンポーネント
 * カフェ風デザインに合わせたスタイリング
 * 静的サイト生成（SSG）に対応
 */
export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  baseUrl
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 表示するページ番号の範囲を決定
  const getPageRange = (): number[] => {
    const maxButtonsToShow = 5; // 表示するボタンの最大数
    const pageRange: number[] = [];
    
    if (totalPages <= maxButtonsToShow) {
      // 総ページ数が表示可能なボタン数以下の場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pageRange.push(i);
      }
    } else {
      // ページネーションの表示範囲を調整
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxButtonsToShow - 1);
      
      // 開始位置を調整
      if (end === totalPages) {
        start = Math.max(1, totalPages - maxButtonsToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pageRange.push(i);
      }
    }
    
    return pageRange;
  };
  
  // ページリンクのURL生成（SSG対応：パスベースのページネーション）
  const getPageUrl = (page: number): string => {
    // ページに応じてパスを生成
    if (page === 1) {
      // 1ページ目はベースURLのみ
      return baseUrl;
    } else {
      // 2ページ目以降はパス形式: /blog/page/2
      return `${baseUrl}/page/${page}`;
    }
  };
  
  // ページ数が1以下の場合はページネーションを表示しない
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav className={styles.pagination}>
      {/* 前のページボタン */}
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)} className={styles.pageLink}>
          ←
        </Link>
      ) : (
        <span className={`${styles.pageLink} ${styles.disabled}`}>←</span>
      )}
      
      {/* ページ番号 */}
      {getPageRange().map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`${styles.pageLink} ${page === currentPage ? styles.active : ''}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}
      
      {/* 次のページボタン */}
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)} className={styles.pageLink}>
          →
        </Link>
      ) : (
        <span className={`${styles.pageLink} ${styles.disabled}`}>→</span>
      )}
    </nav>
  );
}
