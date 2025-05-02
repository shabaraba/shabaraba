import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageContainer = styled.div`
  position: relative;
  z-index: 110;
  margin-left: 1rem;
`;

const LanguageButton = styled.button`
  background: transparent;
  border: 1px solid rgba(var(--color-accent-rgb), 0.3);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--color-accent-rgb), 0.1);
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.4);
  }
`;

const LanguageDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--color-primary);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  min-width: 120px;
`;

const LanguageOption = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(var(--color-accent-rgb), 0.1);
  }
  
  &.active {
    color: var(--color-accent);
    background-color: rgba(var(--color-accent-rgb), 0.05);
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    background-color: rgba(var(--color-accent-rgb), 0.1);
  }
`;

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };
  
  // Get current language label
  const getCurrentLanguageLabel = () => {
    switch (i18n.language) {
      case 'ja':
        return '日本語';
      case 'en':
      default:
        return 'English';
    }
  };
  
  return (
    <LanguageContainer ref={dropdownRef}>
      <LanguageButton onClick={() => setIsOpen(!isOpen)}>
        {getCurrentLanguageLabel()}
        <span style={{ marginLeft: '0.5rem' }}>▾</span>
      </LanguageButton>
      
      <AnimatePresence>
        {isOpen && (
          <LanguageDropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LanguageOption
              className={i18n.language === 'en' ? 'active' : ''}
              onClick={() => changeLanguage('en')}
            >
              {t('language_selector.en')}
            </LanguageOption>
            <LanguageOption
              className={i18n.language === 'ja' ? 'active' : ''}
              onClick={() => changeLanguage('ja')}
            >
              {t('language_selector.ja')}
            </LanguageOption>
          </LanguageDropdown>
        )}
      </AnimatePresence>
    </LanguageContainer>
  );
};

export default LanguageSwitcher;