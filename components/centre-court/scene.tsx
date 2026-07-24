'use client'

import { memo } from 'react'
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { Stadium } from './stadium'
import { GrassName } from './grass-name'
import { Lighting } from './lighting'
import { CameraRig } from './camera-rig'
import { DustParticles, FloatingBalls, FlyingBall } from './ambient'
import { OrbitingSkills, ProjectPlatforms } from './scene-props'
import { ServeBall } from './serve-ball'
import { useScrollProgress } from '@/lib/scroll-store'

const MemoStadium = memo(Stadium)

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function Scene({ onServe }: { onServe?: () => void }) {
  const progress = useScrollProgress()
  // Round so the (memoized) stadium only re-renders a handful of times.
  const night = Math.round(smoothstep(0.8, 0.98, progress) * 10) / 10

  return (
    <>
      <color attach="background" args={['#091118']} />
      <fog attach="fog" args={['#091118', 24, 90]} />

      <Lighting />
      <CameraRig />

      <MemoStadium night={night} />
      <GrassName position={[0, 2.6, 4]} scale={1} />

      <OrbitingSkills />
      <ProjectPlatforms />

      <FloatingBalls />
      <FlyingBall />
      <DustParticles count={350} />
      <ServeBall onServe={onServe} />

      {/* TEMP: effects disabled for debugging visibility */}
    </>
  )
}
