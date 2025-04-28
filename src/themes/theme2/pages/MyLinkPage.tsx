import React from 'react';
import styles from './MyLinkPage.module.css';
import { MyLinkEntity } from '../../../core/entities/MyLinkEntity';
import Layout from '../components/layouts/Layout';
import MyLinkList from '../components/mylink/MyLinkList';
import Sidebar from '../components/sidebar/Sidebar';

interface MyLinkPageProps {
  mylinks: MyLinkEntity[];
}

/**
 * MyLinkページコンポーネント（Theme2用）
 */
export default function MyLinkPage({ mylinks }: MyLinkPageProps) {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Links</h1>
          <p className={styles.pageDescription}>筆者の興味関心のある外部ページはこちらに</p>
          <MyLinkList mylinks={mylinks} />
        </div>
        <Sidebar />
      </div>
    </Layout>
  );
}
