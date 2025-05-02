import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count: number;
  mousePosition: { x: number; y: number };
}

const ParticleField = ({ count, mousePosition }: ParticleFieldProps) => {
  const mesh = useRef<THREE.Points>(null);
  const particlesGeometry = useRef<THREE.BufferGeometry>(null);
  
  // Create a basic circle texture for particles instead of loading from file
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'white';
      context.beginPath();
      context.arc(32, 32, 32, 0, Math.PI * 2);
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Generate random particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      
      // Random velocity
      const vx = (Math.random() - 0.5) * 0.01;
      const vy = (Math.random() - 0.5) * 0.01;
      const vz = (Math.random() - 0.5) * 0.01;
      
      temp.push({ position: [x, y, z], velocity: [vx, vy, vz] });
    }
    return temp;
  }, [count]);

  // Create particles positions buffer
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = particles[i].position[0];
      positions[i3 + 1] = particles[i].position[1];
      positions[i3 + 2] = particles[i].position[2];
      
      // Color (cyan to purple gradient)
      const mixFactor = Math.random();
      colors[i3] = 0;
      colors[i3 + 1] = mixFactor;
      colors[i3 + 2] = 1 - mixFactor;
      
      // Size (random between 0.1 and 0.5)
      sizes[i] = Math.random() * 0.4 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, [count, particles]);

  // Update particles on each frame
  useFrame((state, delta) => {
    if (!mesh.current || !particlesGeometry.current) return;
    
    const positionsArray = particlesGeometry.current.attributes.position.array as Float32Array;
    
    // Update particle positions based on velocity and mouse influence
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update position with velocity
      positionsArray[i3] += particles[i].velocity[0];
      positionsArray[i3 + 1] += particles[i].velocity[1];
      positionsArray[i3 + 2] += particles[i].velocity[2];
      
      // Boundary check - wrap around if out of bounds
      if (positionsArray[i3] > 10) positionsArray[i3] = -10;
      if (positionsArray[i3] < -10) positionsArray[i3] = 10;
      if (positionsArray[i3 + 1] > 10) positionsArray[i3 + 1] = -10;
      if (positionsArray[i3 + 1] < -10) positionsArray[i3 + 1] = 10;
      if (positionsArray[i3 + 2] > 10) positionsArray[i3 + 2] = -10;
      if (positionsArray[i3 + 2] < -10) positionsArray[i3 + 2] = 10;
      
      // Add slight mouse attraction
      const mouseInfluence = 0.0005;
      const mouseX = (mousePosition.x * 20) - 10;
      const mouseY = (mousePosition.y * -20) + 10;
      
      const dx = mouseX - positionsArray[i3];
      const dy = mouseY - positionsArray[i3 + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        positionsArray[i3] += dx * mouseInfluence;
        positionsArray[i3 + 1] += dy * mouseInfluence;
      }
    }
    
    // Update the geometry
    particlesGeometry.current.attributes.position.needsUpdate = true;
    
    // Slowly rotate the entire particle system
    mesh.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry ref={particlesGeometry}>
        <bufferAttribute
          attach="attributes-position"
          array={positions.positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={positions.colors}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={positions.sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        sizeAttenuation={true}
        vertexColors
        transparent
        alphaMap={particleTexture}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
