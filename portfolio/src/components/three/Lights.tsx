import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Lights = () => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Animate lights
  useFrame(({ clock }) => {
    if (!spotLightRef.current || !pointLightRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate spotlight position in a circular motion
    spotLightRef.current.position.x = Math.sin(t * 0.2) * 10;
    spotLightRef.current.position.z = Math.cos(t * 0.2) * 10;
    
    // Animate point light intensity with a pulsing effect
    pointLightRef.current.intensity = 1 + Math.sin(t * 0.5) * 0.5;
  });

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />
      
      {/* Directional light for general illumination */}
      <directionalLight 
        position={[0, 10, 5]} 
        intensity={0.5} 
        color="#ffffff" 
      />
      
      {/* Spotlight for dramatic effect */}
      <spotLight
        ref={spotLightRef}
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        color="#00ffcc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Point light for additional lighting */}
      <pointLight
        ref={pointLightRef}
        position={[-5, -5, -5]}
        intensity={1}
        color="#ff00cc"
        distance={20}
      />
    </>
  );
};

export default Lights;
