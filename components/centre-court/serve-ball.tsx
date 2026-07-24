'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TennisBall } from './tennis-ball'

/**
 * Press "T" to fire a serve: a ball rockets across the court leaving a
 * streaking trail. Self-contained — listens for the keypress itself.
 */
export function ServeBall({ onServe }: { onServe?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const trail = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)
  const start = useRef(0)
  const duration = 1.1

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        setActive(true)
        onServe?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onServe])

  useFrame((state) => {
    if (!active || !group.current) return
    if (start.current === 0) start.current = state.clock.elapsedTime
    const t = (state.clock.elapsedTime - start.current) / duration
    if (t >= 1) {
      setActive(false)
      start.current = 0
      group.current.visible = false
      return
    }
    group.current.visible = true
    const x = THREE.MathUtils.lerp(-16, 16, t)
    const y = 3 + Math.sin(t * Math.PI) * 5
    const z = THREE.MathUtils.lerp(-6, 2, t)
    group.current.position.set(x, y, z)
    if (trail.current) {
      trail.current.scale.x = 1 + Math.sin(t * Math.PI) * 6
    }
  })

  return (
    <group ref={group} visible={false}>
      <TennisBall radius={0.5} glow spin={6} />
      <mesh ref={trail} position={[-1.6, 0, 0]}>
        <boxGeometry args={[3, 0.12, 0.12]} />
        <meshStandardMaterial
          color="#d8ff62"
          emissive="#d8ff62"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}
