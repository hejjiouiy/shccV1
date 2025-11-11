// app/HolographicGuide.tsx
'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF, Loader } from '@react-three/drei';
import * as THREE from 'three';

type SectionKey = string;

/**
 * DoctorModel: loads the GLB model and applies small animation
 * - rotates slowly
 * - leans/tilts according to `mood` target
 * - exposes an <Html> hologram text via Drei's Html
 */
function DoctorModel({
  section,
  open,
  description,
  onSpeak,
}: {
  section: SectionKey;
  open: boolean;
  description: string;
  onSpeak?: (text: string) => void;
}) {
  const group = useRef<THREE.Group | null>(null);
  const gltf = useGLTF('/models/ai_guide.glb', true) as any; // safe cast

  // Small state for animation targets
  const targetRotation = useRef({ y: 0, x: 0 });
  const baseScale = 1.6;

  // Set different poses per section
  useEffect(() => {
    // Tune the rotation and tilt per section
    switch (section) {
      case 'fms':
        targetRotation.current = { y: -0.25, x: -0.05 }; // looks left/up slightly
        break;
      case 'hospital':
        targetRotation.current = { y: 0.3, x: 0.02 }; // looks right slightly
        break;
      case 'mission':
        targetRotation.current = { y: 0, x: 0.05 }; // nod/forward
        break;
      default:
        targetRotation.current = { y: 0, x: 0 }; // neutral
    }

    // speak short description once when section changes
    if (onSpeak) {
      onSpeak(description);
    }
  }, [section, description, onSpeak]);

  // Gentle breathing + look smoothing
  useFrame((state, delta) => {
    if (!group.current) return;

    // continuous slow rotation around Y (very subtle)
    group.current.rotation.y += delta * 0.08;

    // smooth towards target rotation
    group.current.rotation.y += (targetRotation.current.y - group.current.rotation.y) * Math.min(1, delta * 2);
    group.current.rotation.x += (targetRotation.current.x - group.current.rotation.x) * Math.min(1, delta * 2);

    // subtle breathing (scale)
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.005;
    group.current.scale.setScalar(baseScale * breathe * (open ? 1.03 : 1));
  });

  // Add subtle emissive/glow material overlay if model uses mesh
  useEffect(() => {
    if (!gltf || !gltf.scene) return;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        // allow original material but add slight emissive tint if available
        if (child.material) {
          child.material.emissive = child.material.emissive || new THREE.Color(0x004f3b);
          child.material.emissiveIntensity = 0.02;
          // make sure to allow transparency if model uses it
          child.material.transparent = true;
        }
      }
    });
  }, [gltf]);

  return (
    <group ref={group} position={[0, -1.05, 0]} dispose={null}>
      {/* the actual model */}
      <primitive object={gltf.scene} />

      {/* holographic floor ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <ringGeometry args={[1.2, 2.4, 64]} />
        <meshBasicMaterial
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          color={0x00e0b5}
        />
      </mesh>

      {/* vertical shimmer */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.6, 16]} />
        <meshBasicMaterial color={0x00e0b5} transparent opacity={0.12} />
      </mesh>

      {/* Floating holographic label using Html */}
      <Html
        position={[0, 1.6, 0]}
        center
        style={{
          pointerEvents: 'none',
          transform: 'translateY(-8px)',
        }}
        wrapperClass="no-events"
      >
        <div
          style={{
            minWidth: 180,
            maxWidth: 260,
            padding: '10px 14px',
            borderRadius: 14,
            background: 'linear-gradient(180deg, rgba(0,84,64,0.12), rgba(0,84,64,0.06))',
            color: '#eafaf4',
            border: '1px solid rgba(0, 84, 64, 0.18)',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 8px 30px rgba(0,84,64,0.08)',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, Arial',
            fontSize: 13,
            lineHeight: '1.1',
          }}
        >
          <div style={{ fontWeight: 700, letterSpacing: '0.03em', marginBottom: 6 }}>
            {section === 'home' ? 'Welcome' : section.toUpperCase()}
          </div>
          <div style={{ fontWeight: 400, opacity: 0.95 }}>{description}</div>
        </div>
      </Html>
    </group>
  );
}

/**
 * HolographicGuide wrapper component
 * Props:
 * - section: key indicating the current section (from ShccElite)
 */
export default function HolographicGuide({ section }: { section: SectionKey }) {
  const [open, setOpen] = useState(false); // expanded panel
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Provide descriptions per section (you can extend)
  const descriptions: Record<string, string> = {
    home: 'Your virtual guide to Smart Health Care City.',
    fms: 'Faculty of Medicine — education, training and research.',
    hospital: 'UM6P Hospital — advanced clinical care & innovation.',
    mission: 'Our mission: integrated education, research and exceptional clinical care.',
  };

  const description = descriptions[section] || 'Explore more about this section.';

  // speak function using Web Speech API
  const speak = (text: string) => {
    try {
      if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 1.03;
      utter.pitch = 1.05;
      synth.speak(utter);
    } catch (e) {
      console.warn('Speech canceled or not supported', e);
    }
  };

  // speak when section changes (but avoid repeated spam: small debounce)
  useEffect(() => {
    speak(description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  return (
    <>
      {/* Container */}
      <div
        style={{
          position: 'fixed',
          right: 18,
          bottom: 18,
          width: 320,
          height: open ? 420 : 320,
          zIndex: 60,
          borderRadius: 18,
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          border: '1px solid rgba(0,84,64,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Suspense fallback={<div style={{ padding: 18, color: '#ccc' }}>Loading avatar…</div>}>
            <Canvas camera={{ position: [0, 1.6, 4], fov: 35 }}>
              <color attach="background" args={['transparent']} />
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 10, 2]} intensity={0.6} />
              <pointLight position={[-5, 2, -5]} intensity={0.4} color={0x00ffd0} />
              <spotLight position={[0, 6, 6]} angle={0.4} intensity={0.9} color={0x00ffd0} />
              {/* enable soft shadows if needed (requires more setup) */}
              <DoctorModel section={section} open={open} description={description} onSpeak={speechEnabled ? speak : undefined} />
              <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
            </Canvas>
          </Suspense>

          {/* top-right small controls */}
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSpeechEnabled((s) => !s)}
              title={speechEnabled ? 'Disable speech' : 'Enable speech'}
              style={{
                border: 'none',
                background: speechEnabled ? 'rgba(0,84,64,0.9)' : 'rgba(255,255,255,0.06)',
                color: speechEnabled ? '#fff' : '#d1f7e9',
                padding: '6px 8px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {speechEnabled ? '🔊' : '🔈'}
            </button>

            <button
              onClick={() => setOpen((o) => !o)}
              title={open ? 'Collapse' : 'Expand for more'}
              style={{
                border: 'none',
                background: 'rgba(255,255,255,0.03)',
                color: '#dffaf0',
                padding: '6px 8px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {open ? '▾' : '▴'}
            </button>
          </div>

          {/* bottom overlay: expanded info or mini CTA */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              right: 12,
              bottom: 12,
              pointerEvents: 'auto',
            }}
          >
            {open ? (
              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(0,84,64,0.08), rgba(0,84,64,0.04))',
                  borderRadius: 12,
                  padding: 12,
                  color: '#e9fff6',
                  border: '1px solid rgba(0,84,64,0.12)',
                  fontSize: 13,
                  lineHeight: 1.25,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  {section === 'home' ? 'Welcome to SHCC' : section.toUpperCase()}
                </div>
                <div style={{ opacity: 0.95, marginBottom: 10 }}>{description}</div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={section === 'fms' ? 'https://fms.shcc-um6p.ma' : section === 'hospital' ? 'https://hospital.shcc-um6p.ma' : '#'}
                    style={{
                      textDecoration: 'none',
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e7fff8',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Open
                  </a>
                  <button
                    onClick={() => speak(description)}
                    style={{
                      background: 'transparent',
                      color: '#ccfff0',
                      padding: 8,
                      fontSize: 13,
                      cursor: 'pointer',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    🔊 Narrate
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '8px 10px',
                  borderRadius: 10,
                  color: '#dffaf0',
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 700 }}>{section === 'home' ? 'Virtual Guide' : section.toUpperCase()}</div>
                <div style={{ opacity: 0.9 }}>{/* small status or icon */}💠</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drei global loader (shows when GLTF loading) */}
      <Loader />
    </>
  );
}
