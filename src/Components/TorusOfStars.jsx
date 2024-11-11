import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function TorusOfStars() {
  const torusRef = useRef();

  // Creating random star positions along the torus geometry
  const particles = useMemo(() => {
    const positions = [];
    const torus = new THREE.TorusGeometry(12, 3, 28, 150); // Define the torus geometry (radius, tube radius, radialSegments, tubularSegments)

    const positionAttribute = torus.getAttribute('position');

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      
      // Add some jitter to make the stars not too aligned
    //   positions.push(x + Math.random() * 0.5, y + Math.random() * 0.5, z + Math.random() * 0.5);

      positions.push(
        x + Math.random() * 0.7, 
        y + Math.random() * 0.7, 
        z + Math.random() * 0.7
      );
    }

    return new Float32Array(positions);
  }, []);

  // UseFrame hook to rotate the torus on every frame
  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.005;  // Rotate along the x-axis
      torusRef.current.rotation.y += 0.005;  // Rotate along the y-axis
    }
  });

  return (
    <points ref={torusRef}>
      {/* BufferGeometry to define the shape */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          itemSize={3}
          count={(particles.length ) / 3}
        />
      </bufferGeometry>
      {/* PointsMaterial to define how stars should appear */}
      <pointsMaterial size={0.08} color="#CF9FFF" sizeAttenuation />
    </points>
  );
}