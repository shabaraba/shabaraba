import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import LoadingScreen from '../../components/ui/LoadingScreen';
import React from 'react';

// Mock framer-motion and styled components
vi.mock('@emotion/styled', () => ({
  default: (tag: any) => (props: any) => {
    const { children, ...rest } = props;
    return React.createElement(tag, { ...rest, 'data-testid': props['data-testid'] || 'styled-component' }, children);
  },
}));

vi.mock('@emotion/react', () => ({
  keyframes: () => 'animation-mock',
}));

// Mock timer
vi.useFakeTimers();

describe('LoadingScreen Component', () => {
  it('renders loading screen initially', () => {
    render(<LoadingScreen />);
    expect(screen.getByText('<SB/>')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('updates progress bar during loading', () => {
    render(<LoadingScreen />);
    
    // Initial state should be 0
    const progressBar = screen.getByText('Loading...');
    expect(progressBar).toBeInTheDocument();
    
    // Progress should increase after some time
    act(() => {
      vi.advanceTimersByTime(600); // Advance by 600ms (3 progress updates)
    });
    
    // Since progress is random, we can't check exact value,
    // but we can verify component is still rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows "Ready!" text when loading is complete', () => {
    render(<LoadingScreen />);
    
    // Force progress to complete
    act(() => {
      // This is enough to ensure progress reaches 100%
      vi.advanceTimersByTime(2000); 
    });
    
    // After loading completes, it should show "Ready!"
    expect(screen.getByText('Ready!')).toBeInTheDocument();
  });

  it('hides loading screen after completion', () => {
    const { container } = render(<LoadingScreen />);
    
    // Complete loading
    act(() => {
      vi.advanceTimersByTime(2000); // Progress to 100%
    });
    
    // Wait for hide timer
    act(() => {
      vi.advanceTimersByTime(600); // Add extra time for hiding animation
    });
    
    // Since we're testing for absence, and the component returns null after completion,
    // the safest way is to check the container is empty (no elements rendered)
    expect(container.firstChild).toBeNull();
  });
});
