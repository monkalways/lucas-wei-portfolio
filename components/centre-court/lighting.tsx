'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { progressRef } from '@/lib/scroll-store'

const goldenSun = new THREE.Color('#ffb066')
const nightSun = new THREE.Color('#2a4a66')
const goldenAmb = new THREE.Color('#ffd9a0')
const nightAmb = new THREE.Color('#12314a')

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Ref-driven lighting: warm golden hour that fades to night near the end. */
export function Lighting() {
  const sun = useRef<THREE.DirectionalLight>(null)
  const amb = useRef<THREE.AmbientLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)

  useFrame(() => {
    const night = smoothstep(0.8, 0.98, progressRef.current)
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(3.1, 0.45, night)
      sun.current.color.copy(goldenSun).lerp(nightSun, night)
    }
    if (amb.current) {
      amb.current.intensity = THREE.MathUtils.lerp(0.8, 0.3, night)
      amb.current.color.copy(goldenAmb).lerp(nightAmb, night)
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(0.95, 0.4, night)
    }
  })

  return (
    <>
      <ambientLight ref={amb} intensity={0.5} />
      <hemisphereLight ref={hemi} args={['#bfe3ff', '#20402e', 0.7]} />
      <directionalLight
        ref={sun}
        position={[18, 22, 12]}
        intensity={2.6}
        color={'#ffb066'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
      />
    </>
  )
}
