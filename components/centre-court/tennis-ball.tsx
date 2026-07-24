'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type TennisBallProps = {
  position?: [number, number, number]
  radius?: number
  glow?: boolean
  spin?: number
}

/**
 * A stylized tennis ball: fuzzy yellow-green sphere with two white seam curves.
 */
export function TennisBall({
  position = [0, 0, 0],
  radius = 0.5,
  glow = false,
  spin = 1,
}: TennisBallProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.6 * spin
      group.current.rotation.x += delta * 0.15 * spin
    }
  })

  return (
    <group ref={group} position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={'#c6e84b'}
          roughness={0.95}
          metalness={0}
          emissive={glow ? '#d8ff62' : '#000000'}
          emissiveIntensity={glow ? 1.4 : 0}
        />
      </mesh>
      {/* Seam curves */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[radius * 0.99, radius * 0.06, 16, 100]} />
        <meshStandardMaterial color={'#ffffff'} roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} scale={[1, 1, 1]}>
        <torusGeometry
          args={[radius * 0.62, radius * 0.06, 16, 100, Math.PI * 1.0]}
        />
        <meshStandardMaterial color={'#ffffff'} roughness={0.6} />
      </mesh>
    </group>
  )
}
