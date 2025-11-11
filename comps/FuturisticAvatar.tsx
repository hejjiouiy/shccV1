'use client'
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

/**
 * Le modèle 3D lui-même, avec ses animations.
 */
const FuturisticModel = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Hook d'animation qui s'exécute à chaque frame
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotation lente et constante
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.x = time * 0.2;

      // Effet de pulsation lumineuse
      const pulse = Math.sin(time * 2) * 0.5 + 0.5; // Varie entre 0 et 1
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        // L'intensité de la lueur (emissive) change avec le temps
        meshRef.current.material.emissiveIntensity = pulse * 1.5 + 0.5;
      }
    }
  });

  // --- PLACEHOLDER FUTURISTE ---
  // Un icosaèdre (cristal) avec un matériau métallique et lumineux.
//   return (
//     <Icosahedron ref={meshRef} args={[1.2, 0]}>
//       <meshStandardMaterial 
//         color="#005440"         // Couleur de base
//         emissive="#00FFC2"       // Couleur de la lueur (vert émeraude vif)
//         emissiveIntensity={1}    // Intensité de la lueur (contrôlée par useFrame)
//         roughness={0.1}          // Très lisse, presque brillant
//         metalness={0.8}          // Très métallique
//       />
//     </Icosahedron>
//   );

  
  // --- POUR UTILISER VOTRE PROPRE MODÈLE 3D (.gltf) ---
  // 1. Placez votre fichier (ex: doctor_bot.gltf) dans le dossier /public
  // 2. Importez { useGLTF } from '@react-three/drei'
  // 3. Commentez <Icosahedron> ci-dessus et décommentez ceci :

  const { scene } = useGLTF('/models/scene.gltf');
  
  // 'scene' est votre modèle 3D. Vous devrez peut-être ajuster l'échelle.
  return <primitive ref={meshRef} object={scene} scale={1.5} />;
  
};

/**
 * Le composant principal que vous importerez.
 * Il contient le Canvas 3D et le modèle.
 */
export default function FuturisticAvatar() {
  return (
    // Nous réutilisons le conteneur de votre code original
    <div className="relative w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-sm border-2 border-white/30 overflow-hidden">
      
      {/* La scène 3D. Elle vivra à l'intérieur du cercle */}
      <Canvas camera={{ position: [0, 0, 2.5], fov: 35 }}>
        
        {/* Lumières pour éclairer le modèle */}
        <ambientLight intensity={1} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#00FFC2" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />

        {/* Suspense est nécessaire pour charger les modèles 3D (même les placeholders) */}
        <Suspense fallback={null}>
          <FuturisticModel />
        </Suspense>
      </Canvas>
    </div>
  );
}