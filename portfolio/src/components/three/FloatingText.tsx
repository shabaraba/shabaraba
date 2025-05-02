import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingTextProps {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size?: number;
  color?: string;
}

const FloatingText = ({
  text,
  position,
  rotation,
  size = 1,
  color = '#00ffcc'
}: FloatingTextProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create materials for the text
  const materials = useMemo(() => {
    const frontMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.2,
    });
    
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.4,
    });
    
    return [frontMaterial, sideMaterial];
  }, [color]);

  // Animate the text
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Gentle floating animation
    const t = clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
    
    // Slight rotation
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group position={position}>
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/inter_regular.json"
          size={size}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
          material={materials}
        >
          {text}
        </Text3D>
      </Center>
    </group>
  );
};

export default FloatingText;
