'use client'

import { useRef } from 'react'
import { Float, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TennisBall } from './tennis-ball'
import { skills as skillsContent, projects as projectsContent } from '@/lib/content'

const FONT = '/fonts/Geist-Regular.ttf'

/** Skills rendered as tennis balls orbiting a central point down the court. */
export function OrbitingSkills() {
  const group = useRef<THREE.Group>(null)
  const items = skillsContent.items
  const center: [number, number, number] = [0, 4, -12]
  const radius = 4.2

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.25
    }
  })

  return (
    <group position={center}>
      <group ref={group}>
        {items.map((skill, i) => {
          const angle = (i / items.length) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = Math.sin(angle * 2) * 0.8
          return (
            <group key={skill} position={[x, y, z]}>
              <TennisBall radius={0.6} glow spin={1.5} />
              <Text
                font="/fonts/Geist-Regular.ttf"
                fontSize={0.42}
                position={[0, -0.95, 0]}
                color="#f4f7f2"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#091118"
              >
                {skill}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}

function Platform({
  index,
  label,
}: {
  index: number
  label: string
}) {
  const x = (index - (projectsContent.items.length - 1) / 2) * 3.4
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <group position={[x, 1.5, -20]}>
        {/* platform disc */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.35, 0.35, 32]} />
          <meshStandardMaterial color="#123027" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.04, 32]} />
          <meshStandardMaterial
            color="#d8ff62"
            emissive="#d8ff62"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* small tennis ball floating above */}
        <group position={[0, 1.1, 0]}>
          <TennisBall radius={0.45} spin={1.2} />
        </group>
        <Text
          font={FONT}
          fontSize={0.42}
          position={[0, -0.7, 0]}
          color="#f4f7f2"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#091118"
        >
          {label.toUpperCase()}
        </Text>
      </group>
    </Float>
  )
}

/** Projects sitting on floating platforms further down the court. */
export function ProjectPlatforms() {
  return (
    <group>
      {projectsContent.items.map((p, i) => (
        <Platform key={p.name} index={i} label={p.name} />
      ))}
    </group>
  )
}
