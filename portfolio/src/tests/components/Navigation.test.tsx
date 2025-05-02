import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../../components/ui/Navigation';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
}));

// Mock useLocation hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/'
    }),
  };
});

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>{component}</BrowserRouter>
  );
};

describe('Navigation Component', () => {
  it('renders logo and navigation links', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByText('<SB/>')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights the active link based on current location', () => {
    renderWithRouter(<Navigation />);
    // Since we mocked useLocation to return '/', the Home link should be active
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveStyle('color: var(--color-accent)');
  });

  it('displays mobile menu when menu button is clicked', () => {
    renderWithRouter(<Navigation />);
    
    // Find the menu button (☰) and click it
    const menuButton = screen.getByText('☰');
    fireEvent.click(menuButton);
    
    // After clicking, the mobile menu should be visible
    expect(screen.getByTestId('animate-presence')).toBeInTheDocument();
    
    // The close button (✕) should now be visible
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('closes mobile menu when clicking the close button', () => {
    renderWithRouter(<Navigation />);
    
    // First open the menu
    const menuButton = screen.getByText('☰');
    fireEvent.click(menuButton);
    
    // Then click the close button
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    // The menu button (☰) should be visible again
    expect(screen.getByText('☰')).toBeInTheDocument();
  });
});
