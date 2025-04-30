import React from 'react';
import styles from './MyLinkPage.module.css';
import { MyLinkEntity } from '../../../core/entities/MyLinkEntity';
import Layout from '../components/layouts/Layout';
import MyLinkList from '../components/mylink/MyLinkList';
import PaginatedLinkList from '../components/mylink/PaginatedLinkList';

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
  return (
    <Layout>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Links</h1>
        <p className={styles.pageDescription}>筆者の興味関心のある外部ページはこちらに</p>
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
