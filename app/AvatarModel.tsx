'use client'
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * C'est le composant qui contient le modèle 3D et ses animations.
 */
const Model = ({ isTalking }: { isTalking: boolean }) => {
  // Référence au maillage 3D
  const meshRef = useRef<THREE.Mesh>(null!);

  // useFrame est un hook qui s'exécute à chaque frame (60fps)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Animation de "flottement" (idle)
      meshRef.current.position.y = Math.sin(time) * 0.1; // Flotte de haut en bas

      if (isTalking) {
        // Si le chat est ouvert ("parle"), on accélère la rotation
        meshRef.current.rotation.y = time * 1.5;
        meshRef.current.rotation.x = Math.sin(time) * 0.2;
      } else {
        // Rotation "idle" lente
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.x = 0;
      }
    }
  });

  // --- PLACEHOLDER ---
  // Un simple cube en attendant votre vrai modèle 3D.
  // Supprimez ce <Box> lorsque vous chargerez votre modèle.
  return (
    <Box ref={meshRef} args={[0.8, 0.8, 0.8]}>
      <meshStandardMaterial 
        color={isTalking ? '#007a5e' : '#005440'} 
        emissive={isTalking ? '#007a5e' : '#005440'} // Brille un peu
        roughness={0.3}
        metalness={0.8}
      />
    </Box>
  );

  /*
  // --- COMMENT UTILISER VOTRE VRAI MODÈLE 3D ---
  // 1. Placez votre fichier (ex: avatar.gltf) dans le dossier /public
  // 2. Décommentez le code ci-dessous et supprimez le <Box> ci-dessus.
  // 3. (Vous aurez besoin de 'useAnimations' de @react-three/drei si votre modèle est animé)

  const { scene } = useGLTF('/avatar.gltf');
  
  // Vous pouvez aussi gérer les animations ici
  // const { animations } = useGLTF('/avatar.gltf');
  // const { ref, actions } = useAnimations(animations, scene);
  //
  // useEffect(() => {
  //   // 'Idle' et 'Talking' sont les noms des animations dans votre fichier 3D
  //   if (isTalking) {
  //     actions['Talking']?.play();
  //     actions['Idle']?.stop();
  //   } else {
  //     actions['Idle']?.play();
  //     actions['Talking']?.stop();
  //   }
  // }, [isTalking, actions]);

  // 'scene' est l'objet 3D chargé. 
  // 'ref' serait utilisé si vous avez des animations.
  return <primitive ref={meshRef} object={scene} scale={1.2} />;
  */
};

/**
 * C'est le composant que vous importerez dans ShccElite.tsx
 * Il contient la "scène" 3D (Canvas) et le modèle.
 */
export default function AvatarModel({ 
  isTalking, 
  onClick 
}: { 
  isTalking: boolean, 
  onClick: () => void 
}) {
  return (
    // Conteneur pour la scène 3D. Cliquer dessus active la fonction onClick.
    <div 
      className="w-32 h-32 md:w-40 md:h-40 cursor-pointer rounded-full" 
      onClick={onClick}
      style={{
        // Effet de "verre" ou "hologramme"
        backdropFilter: 'blur(5px)',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        boxShadow: '0 0 20px rgba(0, 84, 64, 0.5)'
      }}
    >
      <Canvas camera={{ position: [0, 0, 2], fov: 40 }}>
        {/* Lumières pour éclairer le modèle */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#007a5e" />
        
        {/* Suspense est nécessaire pour le chargement de modèles 3D */}
        <Suspense fallback={null}>
          <Model isTalking={isTalking} />
        </Suspense>
        
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}