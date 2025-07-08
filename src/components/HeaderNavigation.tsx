import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './HeaderNavigation.module.css';

interface NavItem {
  label: string;
  href: string;
}

const HeaderNavigation: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('');
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const navRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    { label: 'About', href: '/#about' },
    { label: 'Jobs', href: '/#jobs' },
    { label: 'Works', href: '/#works' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Blog', href: '/blog' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'jobs', 'works', 'contact'];
      const scrollPosition = window.scrollY + 100; // ヘッダー高さ分のオフセット

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }

      // 一番上にいる場合はアクティブセクションをクリア
      if (window.scrollY < 50) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期状態をチェック

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;

      const activeItem = navRef.current.querySelector(`.${styles.active}`) as HTMLElement;
      
      if (activeItem) {
        const navRect = navRef.current.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        
        setIndicatorStyle({
          width: itemRect.width,
          height: itemRect.height,
          left: itemRect.left - navRect.left,
          top: itemRect.top - navRect.top,
        });
      }
    };

    updateIndicator();
    
    // リサイズ時にも更新
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection, router.pathname]);

  const isActive = (href: string) => {
    if (href === '/blog') {
      return router.pathname.startsWith('/blog');
    }
    if (href.startsWith('/#')) {
      const section = href.substring(2);
      return activeSection === section;
    }
    return false;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const section = href.substring(2);
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Shaba</span>
        </Link>
        
        <nav className={styles.navigation} ref={navRef}>
          <div 
            className={`${styles.activeIndicator} ${activeSection || router.pathname.startsWith('/blog') ? styles.visible : ''}`}
            style={indicatorStyle}
          />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
              onClick={(e) => handleClick(e, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default HeaderNavigation;