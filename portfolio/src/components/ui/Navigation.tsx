import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

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
  transition: background-color 0.3s ease;

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

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
          <NavLink to="/" $isActive={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/about" $isActive={location.pathname === '/about'}>About</NavLink>
          <NavLink to="/projects" $isActive={location.pathname === '/projects'}>Projects</NavLink>
          <NavLink to="/contact" $isActive={location.pathname === '/contact'}>Contact</NavLink>
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
            <MobileNavLink to="/" $isActive={location.pathname === '/'}>Home</MobileNavLink>
            <MobileNavLink to="/about" $isActive={location.pathname === '/about'}>About</MobileNavLink>
            <MobileNavLink to="/projects" $isActive={location.pathname === '/projects'}>Projects</MobileNavLink>
            <MobileNavLink to="/contact" $isActive={location.pathname === '/contact'}>Contact</MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
