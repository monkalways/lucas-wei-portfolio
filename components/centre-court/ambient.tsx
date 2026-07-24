'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TennisBall } from './tennis-ball'

/** Slowly drifting dust motes caught in the light. */
export function DustParticles({ count = 400 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70
      positions[i * 3 + 1] = Math.random() * 24
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70
      speeds[i] = 0.2 + Math.random() * 0.6
    }
    return { positions, speeds }
  }, [count])

  useFrame((state, delta) => {
    if (!points.current) return
    const pos = points.current.geometry.attributes.position
      .array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta * 0.6
      pos[i * 3] += Math.sin(state.clock.elapsedTime * 0.2 + i) * delta * 0.1
      if (pos[i * 3 + 1] > 24) pos[i * 3 + 1] = 0
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={'#d8ff62'}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** A handful of tennis balls floating gently around the court. */
export function FloatingBalls() {
  const balls = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        base: [
          (Math.random() - 0.5) * 20,
          2 + Math.random() * 6,
          (Math.random() - 0.5) * 24,
        ] as [number, number, number],
        radius: 0.35 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        amp: 0.4 + Math.random() * 0.8,
        spin: 0.5 + Math.random(),
      })),
    [],
  )

  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.children.forEach((child, i) => {
      const b = balls[i]
      child.position.y = b.base[1] + Math.sin(state.clock.elapsedTime * 0.7 + b.phase) * b.amp
    })
  })

  return (
    <group ref={group}>
      {balls.map((b, i) => (
        <group key={i} position={b.base}>
          <TennisBall radius={b.radius} spin={b.spin} />
        </group>
      ))}
    </group>
  )
}

/** A ball that arcs across the sky over and over. */
export function FlyingBall() {
  const ref = useRef<THREE.Group>(null)
  const period = 6 // seconds per pass

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime % period) / period
    const x = THREE.MathUtils.lerp(-22, 22, t)
    const y = 6 + Math.sin(t * Math.PI) * 9
    ref.current.position.set(x, y, -3)
  })

  return (
    <group ref={ref}>
      <TennisBall radius={0.45} spin={3} />
    </group>
  )
}
