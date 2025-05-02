import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import styled from '@emotion/styled';

// Three.js components
import ParticleField from './ParticleField';
// Temporarily disable FloatingText import until font is available
// import FloatingText from './FloatingText';
import Lights from './Lights';

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
`;

interface ThreeSceneProps {
  mousePosition?: { x: number; y: number };
}

const ThreeScene = ({ mousePosition = { x: 0, y: 0 } }: ThreeSceneProps) => {
  return (
    <CanvasContainer>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
          <Lights />
          <ParticleField count={2000} mousePosition={mousePosition} />
          {/* Temporarily disable FloatingText until font is available */}
          {/* <FloatingText 
            text="SHABARABA"
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            size={1.5}
          /> */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeScene;
