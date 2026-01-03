'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './HeaderNavigation.module.css';

interface NavItem {
  label: string;
  href: string;
}

const HeaderNavigation: React.FC = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const navRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    { label: 'About', href: '/#about' },
    { label: 'Jobs', href: '/#jobs' },
    { label: 'Works', href: '/#works' },
    { label: 'Articles', href: '/#articles' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Blog', href: '/blog' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'jobs', 'works', 'articles', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }

      if (window.scrollY < 50) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

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
    window.addEventListener('resize', updateIndicator);

    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection, pathname]);

  const isActive = (href: string) => {
    if (href === '/blog') {
      return pathname?.startsWith('/blog') ?? false;
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
            className={`${styles.activeIndicator} ${activeSection || pathname?.startsWith('/blog') ? styles.visible : ''}`}
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