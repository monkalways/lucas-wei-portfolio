'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TennisBall } from './tennis-ball'
import { progressRef } from '@/lib/scroll-store'

/** Slowly drifting dust motes caught in the light. */
export function DustParticles({ count = 300 }: { count?: number }) {
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={'#fff0cf'}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/**
 * A handful of tennis balls at rest on the court. They sit still on the grass
 * (no floating, no spin) so they read as real balls left lying around.
 */
export function RestingBalls() {
  const balls = useMemo(
    () => [
      { pos: [-7.5, 0, -3], r: 0.42 },
      { pos: [6.2, 0, -6], r: 0.4 },
      { pos: [-3.5, 0, -10], r: 0.38 },
      { pos: [4.8, 0, -13], r: 0.44 },
      { pos: [-8.5, 0, -15], r: 0.4 },
      { pos: [1.5, 0, -1.5], r: 0.4 },
    ],
    [],
  )

  return (
    <group>
      {balls.map((b, i) => (
        <group key={i} position={[b.pos[0], b.r, b.pos[2]]}>
          <TennisBall radius={b.r} spin={0} />
        </group>
      ))}
    </group>
  )
}

/**
 * A served ball whose bouncing path down the court is driven entirely by
 * scroll position — so scrolling "hits" the ball. It only moves while you
 * scroll; stop, and the ball rests mid-court. Scroll back up and it retraces.
 */
export function ScrollRally() {
  const group = useRef<THREE.Group>(null)
  const shadow = useRef<THREE.Mesh>(null)
  const radius = 0.4
  const bounces = 5

  useFrame(() => {
    if (!group.current) return
    const p = progressRef.current

    // Travel down the court as you scroll, with a gentle lateral sway.
    const z = THREE.MathUtils.lerp(5, -20, p)
    const x = Math.sin(p * Math.PI * 2) * 2.2

    // Bounces that lose height as the ball travels (energy loss).
    const seg = p * bounces
    const u = seg - Math.floor(seg)
    const decay = 1 - Math.min(0.85, Math.floor(seg) * 0.16)
    const y = radius + Math.sin(u * Math.PI) * 4.2 * decay

    group.current.position.set(x, y, z)
    // Spin proportional to distance travelled — fast because it was just hit.
    group.current.rotation.z = -p * 60
    group.current.rotation.x = p * 40

    if (shadow.current) {
      shadow.current.position.set(x, 0.02, z)
      const lift = (y - radius) / 4.2
      const s = 1 - lift * 0.6
      shadow.current.scale.set(s, s, s)
      ;(shadow.current.material as THREE.MeshBasicMaterial).opacity =
        0.35 * (1 - lift * 0.7)
    }
  })

  return (
    <group>
      <group ref={group}>
        <TennisBall radius={radius} glow spin={0} />
      </group>
      {/* Contact shadow that tightens as the ball nears the ground. */}
      <mesh
        ref={shadow}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <circleGeometry args={[radius * 1.3, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
