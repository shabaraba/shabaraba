import React from 'react';
import styles from './MyLinkPage.module.css';
import { MyLinkEntity } from '../../../core/entities/MyLinkEntity';
import Layout from '../components/layouts/Layout';
import MyLinkList from '../components/mylink/MyLinkList';
import PaginatedLinkList from '../components/mylink/PaginatedLinkList';
import { useConfig } from '../../../lib/useConfig';

interface MyLinkPageProps {
  mylinks: MyLinkEntity[];
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

/**
 * MyLinkページコンポーネント（Theme2用）
 */
export default function MyLinkPage({ mylinks, pagination }: MyLinkPageProps) {
  // 設定から文字列を取得
  const { getSetting } = useConfig();
  const pageTitle = getSetting('mylink.page_title', 'Links');
  const pageDescription = getSetting('mylink.page_description', '筆者の興味関心のある外部ページはこちらに');

  return (
    <Layout>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <p className={styles.pageDescription}>{pageDescription}</p>
        {pagination ? (
          <PaginatedLinkList 
            mylinks={mylinks}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            baseUrl="/mylink"
          />
        ) : (
          <MyLinkList mylinks={mylinks} />
        )}
      </div>
    </Layout>
  );
}
