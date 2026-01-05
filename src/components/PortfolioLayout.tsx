'use client';

import React, { ReactNode } from 'react';
import HeaderNavigation from './HeaderNavigation';
import styles from './PortfolioLayout.module.css';

interface PortfolioLayoutProps {
  children: ReactNode;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <HeaderNavigation />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default PortfolioLayout;