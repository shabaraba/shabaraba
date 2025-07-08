import React, { ReactNode } from 'react';
import Head from 'next/head';
import HeaderNavigation from './HeaderNavigation';
import styles from './PortfolioLayout.module.css';

interface PortfolioLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({
  children,
  title = 'Shaba - Portfolio',
  description = 'Shaba\'s Portfolio - Works, About, and Contact',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.layoutContainer}>
        <HeaderNavigation />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </>
  );
};

export default PortfolioLayout;