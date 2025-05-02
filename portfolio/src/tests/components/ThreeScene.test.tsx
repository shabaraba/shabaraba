import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThreeScene from '../../components/three/ThreeScene';

// Mock Three.js components to avoid WebGL context issues in tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas-mock">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls-mock" />,
  PerspectiveCamera: () => <div data-testid="camera-mock" />,
  useTexture: vi.fn(() => 'mocked-texture'),
  Text3D: ({ children }: { children: React.ReactNode }) => <div data-testid="text3d-mock">{children}</div>,
  Center: ({ children }: { children: React.ReactNode }) => <div data-testid="center-mock">{children}</div>,
}));

vi.mock('../../components/three/ParticleField', () => ({
  default: () => <div data-testid="particle-field-mock" />,
}));

vi.mock('../../components/three/FloatingText', () => ({
  default: () => <div data-testid="floating-text-mock" />,
}));

vi.mock('../../components/three/Lights', () => ({
  default: () => <div data-testid="lights-mock" />,
}));

describe('ThreeScene Component', () => {
  it('renders without crashing', () => {
    render(<ThreeScene />);
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });

  it('contains all required Three.js components', () => {
    render(<ThreeScene />);
    expect(screen.getByTestId('particle-field-mock')).toBeInTheDocument();
    expect(screen.getByTestId('floating-text-mock')).toBeInTheDocument();
    expect(screen.getByTestId('lights-mock')).toBeInTheDocument();
    expect(screen.getByTestId('camera-mock')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls-mock')).toBeInTheDocument();
  });

  it('accepts and passes mousePosition prop', () => {
    const mockedMousePosition = { x: 0.5, y: 0.5 };
    render(<ThreeScene mousePosition={mockedMousePosition} />);
    // This is a bit limited since we're mocking the components,
    // but we're at least verifying the component renders with the prop
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });
});
