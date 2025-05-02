import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { ActiveSection } from '../../pages/LandingPage';

// Using a more flexible type definition for refs
type SectionRef = React.RefObject<HTMLDivElement | null>;

interface NavigationProps {
  scrollToSection?: (ref: SectionRef) => void;
  refs?: {
    homeRef: SectionRef;
    aboutRef: SectionRef;
    projectsRef: SectionRef;
    contactRef: SectionRef;
  };
  activeSection?: ActiveSection;
}

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background-color: rgba(7, 10, 20, 0.75);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-accent);
  text-decoration: none;
  letter-spacing: 1px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? 'var(--color-accent)' : 'var(--color-text)'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  position: relative;
  padding: 0.5rem 0;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.$isActive ? '100%' : '0'};
    height: 2px;
    background-color: var(--color-accent);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const NavButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$isActive ? 'var(--color-accent)' : 'var(--color-text)'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  position: relative;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.$isActive ? '100%' : '0'};
    height: 2px;
    background-color: var(--color-accent);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const ExternalNavLink = styled.a`
  color: var(--color-text);
  text-decoration: none;
  font-weight: 400;
  position: relative;
  padding: 0.5rem 0;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-accent);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  z-index: 110;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 105;
`;

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? 'var(--color-accent)' : 'var(--color-text)'};
  text-decoration: none;
  font-size: 2rem;
  margin: 1rem 0;
  font-weight: ${props => props.$isActive ? '600' : '400'};
`;

const MobileNavButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$isActive ? 'var(--color-accent)' : 'var(--color-text)'};
  text-decoration: none;
  font-size: 2rem;
  margin: 1rem 0;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  cursor: pointer;
`;

const MobileExternalNavLink = styled.a`
  color: var(--color-text);
  text-decoration: none;
  font-size: 2rem;
  margin: 1rem 0;
  font-weight: 400;
`;

const Navigation = ({ scrollToSection, refs, activeSection }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  
  const handleNavClick = (ref?: SectionRef) => {
    if (scrollToSection && ref) {
      scrollToSection(ref);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <NavContainer>
        <Logo to="/">{'<SB/>'}</Logo>
        <NavLinks>
          {scrollToSection && refs ? (
            <>
              <NavButton onClick={() => handleNavClick(refs.homeRef)} $isActive={activeSection === 'home'}>{t('navigation.home')}</NavButton>
              <NavButton onClick={() => handleNavClick(refs.aboutRef)} $isActive={activeSection === 'about'}>{t('navigation.about')}</NavButton>
              <NavButton onClick={() => handleNavClick(refs.projectsRef)} $isActive={activeSection === 'projects'}>{t('navigation.projects')}</NavButton>
              <NavButton onClick={() => handleNavClick(refs.contactRef)} $isActive={activeSection === 'contact'}>{t('navigation.contact')}</NavButton>
            </>
          ) : (
            <>
              <NavLink to="/" $isActive={location.pathname === '/'}>{t('navigation.home')}</NavLink>
              <NavLink to="/about" $isActive={location.pathname === '/about'}>{t('navigation.about')}</NavLink>
              <NavLink to="/projects" $isActive={location.pathname === '/projects'}>{t('navigation.projects')}</NavLink>
              <NavLink to="/contact" $isActive={location.pathname === '/contact'}>{t('navigation.contact')}</NavLink>
            </>
          )}
          <ExternalNavLink href="https://blog.shaba.dev" target="_blank" rel="noopener noreferrer">{t('navigation.blog')}</ExternalNavLink>
          <LanguageSwitcher />
        </NavLinks>
        <MenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
      </NavContainer>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {scrollToSection && refs ? (
              <>
                <MobileNavButton onClick={() => { handleNavClick(refs.homeRef); toggleMenu(); }} $isActive={activeSection === 'home'}>{t('navigation.home')}</MobileNavButton>
                <MobileNavButton onClick={() => { handleNavClick(refs.aboutRef); toggleMenu(); }} $isActive={activeSection === 'about'}>{t('navigation.about')}</MobileNavButton>
                <MobileNavButton onClick={() => { handleNavClick(refs.projectsRef); toggleMenu(); }} $isActive={activeSection === 'projects'}>{t('navigation.projects')}</MobileNavButton>
                <MobileNavButton onClick={() => { handleNavClick(refs.contactRef); toggleMenu(); }} $isActive={activeSection === 'contact'}>{t('navigation.contact')}</MobileNavButton>
              </>
            ) : (
              <>
                <MobileNavLink to="/" $isActive={location.pathname === '/'}>{t('navigation.home')}</MobileNavLink>
                <MobileNavLink to="/about" $isActive={location.pathname === '/about'}>{t('navigation.about')}</MobileNavLink>
                <MobileNavLink to="/projects" $isActive={location.pathname === '/projects'}>{t('navigation.projects')}</MobileNavLink>
                <MobileNavLink to="/contact" $isActive={location.pathname === '/contact'}>{t('navigation.contact')}</MobileNavLink>
              </>
            )}
            <MobileExternalNavLink href="https://blog.shaba.dev" target="_blank" rel="noopener noreferrer">{t('navigation.blog')}</MobileExternalNavLink>
            <div style={{ marginTop: '2rem' }}>
              <LanguageSwitcher />
            </div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
