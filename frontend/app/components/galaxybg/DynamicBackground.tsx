import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Preload } from '@react-three/drei';
import * as THREE from 'three';

// Galaxy Spiral Arm component
function GalaxySpiralArm({
  position,
  color,
  armIndex = 0,
  radius = 10,
  scrollOffset = 0,
}: {
  position: [number, number, number];
  color: string;
  armIndex?: number;
  radius?: number;
  scrollOffset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create custom shader for galaxy spiral arms
  const galaxyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollOffset: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uArmIndex: { value: armIndex },
        uRadius: { value: radius },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScrollOffset;
        uniform float uArmIndex;
        uniform float uRadius;
        
        varying vec2 vUv;
        varying float vIntensity;
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          
          // Create spiral galaxy shape
          float angle = uArmIndex * 2.0 + uTime * 0.1 + uScrollOffset * 0.001;
          float spiral = pos.x * 0.1 + angle;
          
          // Galaxy arm curvature
          pos.x += sin(spiral) * uRadius * 0.3;
          pos.z += cos(spiral) * uRadius * 0.2;
          
          // Add some vertical wave for 3D effect
          pos.y += sin(pos.x * 0.05 + uTime * 0.5) * 2.0;
          
          // Calculate intensity based on distance from center
          float distanceFromCenter = length(pos.xz) / uRadius;
          vIntensity = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        
        varying vec2 vUv;
        varying float vIntensity;
        
        void main() {
          // Create spiral pattern
          float spiral = sin(vUv.x * 20.0) * cos(vUv.y * 10.0);
          float fade = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
          
          // Galaxy core brightness
          float brightness = vIntensity * fade * (0.5 + spiral * 0.3);
          
          vec3 finalColor = uColor * brightness;
          float alpha = brightness * 0.8;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [color, armIndex, radius]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScrollOffset.value = scrollOffset;
    }

    if (meshRef.current) {
      // Slow galaxy rotation
      meshRef.current.rotation.y =
        state.clock.elapsedTime * 0.02 + scrollOffset * 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[radius * 4, radius * 1.5, 64, 32]} />
      <shaderMaterial ref={materialRef} attach="material" {...galaxyMaterial} />
    </mesh>
  );
}

// Star Field Component
function StarField({ scrollOffset = 0 }) {
  const starsRef = useRef<THREE.Points>(null);
  const starCount = 2000;

  const stars = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      // Distribute stars in a large sphere
      const radius = Math.random() * 100 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Star colors (white, blue-white, yellow-white)
      const temp = Math.random();
      if (temp > 0.8) {
        // Blue-white hot stars
        colors[i3] = 0.8; // R
        colors[i3 + 1] = 0.9; // G
        colors[i3 + 2] = 1.0; // B
      } else if (temp > 0.5) {
        // Yellow-white stars
        colors[i3] = 1.0; // R
        colors[i3 + 1] = 0.9; // G
        colors[i3 + 2] = 0.7; // B
      } else {
        // White stars
        colors[i3] = 1.0; // R
        colors[i3 + 1] = 1.0; // G
        colors[i3 + 2] = 1.0; // B
      }

      // Random star sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y =
        state.clock.elapsedTime * 0.005 + scrollOffset * 0.0001;
      starsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={stars.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starCount}
          array={stars.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starCount}
          array={stars.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Cosmic Dust/Nebula Component
function CosmicDust({ scrollOffset = 0 }) {
  const dustRef = useRef<THREE.Points>(null);
  const dustCount = 800;

  const dust = useMemo(() => {
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;

      // Concentrate dust in galaxy plane
      const radius = Math.random() * 40 + 5;
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 8; // Flatter distribution
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Nebula colors (orange, green, purple, blue)
      const colorChoice = Math.random();
      if (colorChoice > 0.7) {
        // Orange nebula
        colors[i3] = 1.0; // R
        colors[i3 + 1] = 0.4; // G
        colors[i3 + 2] = 0.1; // B
      } else if (colorChoice > 0.4) {
        // Green nebula
        colors[i3] = 0.2; // R
        colors[i3 + 1] = 0.8; // G
        colors[i3 + 2] = 0.3; // B
      } else if (colorChoice > 0.2) {
        // Purple nebula
        colors[i3] = 0.6; // R
        colors[i3 + 1] = 0.2; // G
        colors[i3 + 2] = 0.8; // B
      } else {
        // Blue nebula
        colors[i3] = 0.2; // R
        colors[i3 + 1] = 0.4; // G
        colors[i3 + 2] = 1.0; // B
      }
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y =
        state.clock.elapsedTime * 0.01 + scrollOffset * 0.0002;
    }
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={dustCount}
          array={dust.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={dustCount}
          array={dust.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Galaxy Scene
function GalaxyScene({ scrollOffset }: { scrollOffset: number }) {
  const { viewport } = useThree();

  return (
    <>
      {/* Ambient lighting for depth */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} intensity={0.2} />

      {/* Star field background */}
      <StarField scrollOffset={scrollOffset} />

      {/* Galaxy spiral arms */}
      <GalaxySpiralArm
        position={[0, 0, -10]}
        color="#8b5cf6"
        armIndex={0}
        radius={15}
        scrollOffset={scrollOffset}
      />
      <GalaxySpiralArm
        position={[0, 0, -8]}
        color="#06b6d4"
        armIndex={2.0}
        radius={18}
        scrollOffset={scrollOffset * 1.1}
      />
      <GalaxySpiralArm
        position={[0, 0, -12]}
        color="#f59e0b"
        armIndex={4.0}
        radius={20}
        scrollOffset={scrollOffset * 0.9}
      />
      <GalaxySpiralArm
        position={[0, 0, -6]}
        color="#10b981"
        armIndex={1.5}
        radius={12}
        scrollOffset={scrollOffset * 1.2}
      />

      {/* Cosmic dust and nebula */}
      <CosmicDust scrollOffset={scrollOffset} />

      <Preload all />
    </>
  );
}

// Main Galaxy Background Component
export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollOffsetRef = useRef(0);

  const handleScroll = useCallback(() => {
    scrollOffsetRef.current = window.scrollY;
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black" />

      {/* 3D Galaxy Canvas */}
      <Canvas
        ref={canvasRef}
        camera={{
          position: [0, 5, 15],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <GalaxyScene scrollOffset={scrollOffsetRef.current} />
      </Canvas>

      {/* Cosmic overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}
