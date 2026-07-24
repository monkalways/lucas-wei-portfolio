'use client'

import { memo } from 'react'
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { Environment } from '@react-three/drei'
import { Stadium } from './stadium'
import { GradientSky } from './sky'
import { Lighting } from './lighting'
import { CameraRig } from './camera-rig'
import { DustParticles, RestingBalls, ScrollRally } from './ambient'
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
      {/* Fog colour MUST match GradientSky's bottomColor (see sky.tsx). */}
      <fog attach="fog" args={['#e7c6a2', 45, 125]} />

      {/* Clean gradient backdrop (avoids the HDRI's grey ground hemisphere). */}
      <GradientSky />

      {/* HDRI used for lighting only — natural colour + soft reflections. */}
      <Environment
        files="/hdri/pink_sunrise_1k.hdr"
        environmentIntensity={0.6}
      />

      <Lighting />
      <CameraRig />

      <MemoStadium night={night} />

      <OrbitingSkills />
      <ProjectPlatforms />

      <RestingBalls />
      <ScrollRally />
      <DustParticles count={300} />
      <ServeBall />

      {/* Cinematic post-processing: subtle glow, film grain, edge vignette. */}
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette offset={0.25} darkness={0.65} />
        <Noise opacity={0.025} premultiply />
      </EffectComposer>
    </>
  )
}
