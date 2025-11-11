'use client'
import React, { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Float, Text, useGLTF, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Model as HumanModel } from './HumanModel' 


/**
 * 🎨 Enhanced 3D Holographic Medical Avatar
 * - Advanced medical-themed animations
 * - Professional visual effects
 * - Interactive elements
 * - Medical data visualization
 */
function EnhancedMedicalAvatar() {
  const modelRef = useRef<THREE.Group>(null!)
  const { viewport, mouse, size } = useThree()
  const [hovered, setHovered] = useState(false)

  // Animation targets
  const targetEuler = new THREE.Euler()
  const targetQuaternion = new THREE.Quaternion()
  const targetPosition = new THREE.Vector3()

  // Medical data particles
  const particlesRef = useRef<THREE.Points>(null!)
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 200
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (!modelRef.current) return

    // 💫 Enhanced floating with medical rhythm (heartbeat-like)
    const heartbeat = Math.sin(time * 3) * 0.02
    const floatY = Math.sin(time * 1.2) * 0.2 + heartbeat
    const hoverX = (mouse.x * viewport.width) / 8
    const hoverY = (mouse.y * viewport.height) / 8

    // Smooth position with enhanced responsiveness
    targetPosition.set(
      hoverX * (hovered ? 1.3 : 1),
      hoverY * (hovered ? 1.3 : 1) + floatY - 0.3,
      0
    )
    modelRef.current.position.lerp(targetPosition, 0.05)

    // Enhanced rotation with hover effect
    targetEuler.set(
      hoverY * 0.1,
      hoverX * 0.2 + Math.sin(time * 0.5) * 0.05,
      hoverX * -0.05
    )
    targetQuaternion.setFromEuler(targetEuler)
    modelRef.current.quaternion.slerp(targetQuaternion, 0.1)

    // Animate particles (medical data flow)
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1
      particlesRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
      
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(time + i) * 0.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Interactive medical data particles */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          size={0.03}
          color="#00ffaa"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Enhanced floating container */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.5}
      >
        <group
          ref={modelRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {/* Medical scan effect */}
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial
              color="#00ffaa"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Main model with enhanced scaling */}
          <HumanModel scale={1.25} position={[0, -2.8, 0]} />

          {/* Anatomical highlight points */}
          <Sparkles
            count={30}
            scale={4}
            size={6}
            speed={0.4}
            color="#00ffaa"
            opacity={0.8}
          />
        </group>
      </Float>

      {/* Enhanced base platform */}
      <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.8, 2.2, 0.1, 32]} />
        <meshBasicMaterial
          color="#005440"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulsing energy field */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial
          color="#00ffaa"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive info panels */}
      {hovered && (
        <group>
          <Text
            position={[2, 1, 0]}
            fontSize={0.3}
            color="#00ffaa"
            anchorX="left"
            anchorY="middle"
          >
            SHCC Medical AI
          </Text>
          <Text
            position={[2, 0.6, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            Interactive Guide
          </Text>
        </group>
      )}
    </group>
  )
}

/**
 * 🏥 Enhanced Human Model with Medical Styling
 */
function EnhancedHumanModel(props) {
  const { nodes, materials } = useGLTF('/models/human.glb')
  
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2.2, 0, 0]} scale={2.2}>
        {/* Enhanced material with medical aesthetic */}
        <mesh geometry={nodes.Object_2.geometry}>
          <meshPhysicalMaterial
            color="#f0f8ff"
            transparent
            opacity={0.95}
            transmission={0.2}
            roughness={0.1}
            metalness={0.05}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh geometry={nodes.Object_3.geometry}>
          <meshPhysicalMaterial
            color="#f0f8ff"
            transparent
            opacity={0.95}
            transmission={0.2}
            roughness={0.1}
            metalness={0.05}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh geometry={nodes.Object_4.geometry}>
          <meshPhysicalMaterial
            color="#f0f8ff"
            transparent
            opacity={0.95}
            transmission={0.2}
            roughness={0.1}
            metalness={0.05}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 🎬 Enhanced Scene Environment
 */
function MedicalEnvironment() {
  return (
    <Environment preset="city">
      {/* Custom medical-themed lighting */}
      <Lightformer
        intensity={2}
        color="#00ffaa"
        position={[5, 5, 5]}
        scale={[10, 10, 1]}
      />
      <Lightformer
        intensity={1}
        color="#005440"
        position={[-5, -5, 5]}
        scale={[10, 10, 1]}
      />
    </Environment>
  )
}

/**
 * 🪩 Enhanced Canvas Scene with Professional Setup
 */
export default function SectionAvatar() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-48 h-96 lg:w-52 lg:h-[420px] flex items-center justify-center bg-gradient-to-br from-[#005440]/10 to-[#007a5e]/10 rounded-2xl">
        <div className="text-[#005440] text-sm">Loading Medical AI...</div>
      </div>
    )
  }

  return (
    <div className="w-48 h-96 lg:w-52 lg:h-[420px] cursor-grab active:cursor-grabbing relative group">
      {/* Enhanced container with gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#005440]/20 to-[#007a5e]/20 rounded-2xl border border-[#00ffaa]/30 backdrop-blur-sm" />
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        className="relative z-10"
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={1.4} color="#ffffff" />
        
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.8}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <directionalLight
          position={[-5, 3, -3]}
          intensity={1.8}
          color="#00ffaa"
        />

        <directionalLight
          position={[0, -4, 3]}
          intensity={1.2}
          color="#ffd9b3"
        />

        {/* Medical-themed point lights */}
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#00ffaa" />
        <pointLight position={[-2, -1, 1]} intensity={0.5} color="#005440" />

        <Suspense fallback={
          <Text position={[0, 0, 0]} fontSize={0.3} color="#005440">
            Loading...
          </Text>
        }>
          <EnhancedMedicalAvatar />
          <MedicalEnvironment />
        </Suspense>
      </Canvas>

      {/* Enhanced overlay UI */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-20">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
          <div className="w-2 h-2 bg-[#00ffaa] rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">SHCC Medical AI</span>
        </div>
      </div>

      {/* Interactive hover info */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
          <p className="text-xs text-white">Interactive 3D Guide</p>
        </div>
      </div>
    </div>
  )
}

// Preload assets
useGLTF.preload('/models/human.glb')