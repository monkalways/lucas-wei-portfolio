'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TennisBall } from './tennis-ball'
import { serveControl, setServeHud } from '@/lib/serve-store'

/**
 * Interactive serve mini-game.
 *
 *   1. Press "T" (idle)  → camera zooms to the baseline and the ball is tossed
 *      up in a slow, floaty arc.
 *   2. Press "T" again    → you "strike" the ball. The closer to the toss's peak
 *      you hit, the better the serve (Ace → Fault).
 *
 * Self-contained: owns the ball, takes over the camera while active (the
 * CameraRig yields via serveControl.active), and drives the HUD via the store.
 */

// Server stance, just behind the near baseline.
const SX = 1.5
const SZ = 11
const HAND_Y = 1.5
const APEX = 1.35 // seconds to the top of the toss (slower = easier timing)
const TOSS_H = 3.6 // how high above the hand the toss peaks
const MISS_AT = APEX * 2 + 0.5 // toss comes back down un-hit → fault
const RESULT_DUR = 2.0 // seconds the result plays before returning to scroll

// A close, low camera looking up at the toss.
const CAM_POS = new THREE.Vector3(SX + 0.5, 3.2, SZ + 3.8)
const CAM_LOOK = new THREE.Vector3(SX, 4.4, SZ - 2)

type Phase = 'idle' | 'toss' | 'result'

function announce(q: number) {
  const jitter = Math.floor(Math.random() * 12)
  const speed =
    q >= 1 ? 216 + jitter : q >= 0.75 ? 196 + jitter : q >= 0.5 ? 168 + jitter : 0
  const result =
    q >= 1
      ? `🎾 ACE! ${speed} km/h — perfect contact`
      : q >= 0.75
        ? `Great serve · ${speed} km/h`
        : q >= 0.5
          ? `In play · ${speed} km/h`
          : `Fault — mistimed the toss`
  setServeHud({ show: true, prompt: '', result, quality: q })
}

export function ServeBall() {
  const { camera } = useThree()
  const ball = useRef<THREE.Group>(null)
  const phase = useRef<Phase>('idle')
  const tossStart = useRef(0)
  const resultStart = useRef(0)
  const quality = useRef(0)
  const hitFrom = useRef(new THREE.Vector3())

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== 't' || e.metaKey || e.ctrlKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const now = performance.now() / 1000

      if (phase.current === 'idle') {
        phase.current = 'toss'
        tossStart.current = now
        serveControl.active = true
        setServeHud({
          show: true,
          prompt: 'Toss is up… press T at the very peak!',
          result: '',
          quality: 0,
        })
      } else if (phase.current === 'toss') {
        const t = now - tossStart.current
        const err = Math.abs(t - APEX)
        const q = err < 0.12 ? 1 : err < 0.26 ? 0.75 : err < 0.45 ? 0.5 : 0
        quality.current = q
        phase.current = 'result'
        resultStart.current = now
        if (ball.current) hitFrom.current.copy(ball.current.position)
        announce(q)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useFrame(() => {
    const g = ball.current
    if (!g) return
    const now = performance.now() / 1000

    if (phase.current === 'idle') {
      g.visible = false
      return
    }

    // Camera takeover while serving.
    camera.position.lerp(CAM_POS, 0.09)
    camera.lookAt(CAM_LOOK)

    if (phase.current === 'toss') {
      g.visible = true
      const t = now - tossStart.current
      const frac = Math.min(1, t / (2 * APEX))
      const y = HAND_Y + Math.sin(frac * Math.PI) * TOSS_H
      g.position.set(SX, y, SZ)
      g.rotation.y += 0.03
      if (t > MISS_AT) {
        quality.current = 0
        phase.current = 'result'
        resultStart.current = now
        hitFrom.current.set(SX, HAND_Y, SZ)
        announce(0)
      }
      return
    }

    // phase === 'result'
    const rt = now - resultStart.current
    const p = Math.min(1, rt / RESULT_DUR)
    g.visible = true

    if (quality.current > 0) {
      // Struck serve arcing down the court; reach scales with timing.
      const reach = 0.55 + quality.current * 0.45
      const z = THREE.MathUtils.lerp(hitFrom.current.z, hitFrom.current.z - 30 * reach, p)
      const x = THREE.MathUtils.lerp(SX, SX + 3 * quality.current, p)
      const ground = 0.25
      const bt = 0.4
      let y: number
      if (p < bt) {
        const u = p / bt
        y = ground + (hitFrom.current.y - ground) * (1 - u) * (1 - u)
      } else {
        const u = (p - bt) / (1 - bt)
        y = ground + Math.sin(u * Math.PI) * 1.8 * (1 - u * 0.4)
      }
      g.position.set(x, y, z)
      g.rotation.x += 0.5
      g.rotation.z -= 0.2
    } else {
      // Fault: the ball just drops to the feet.
      const y = Math.max(0.25, hitFrom.current.y - 8 * rt * rt)
      g.position.set(SX, y, SZ)
      g.rotation.x += 0.1
    }

    if (rt > RESULT_DUR) {
      phase.current = 'idle'
      serveControl.active = false
      g.visible = false
      setServeHud({ show: false, prompt: '', result: '', quality: 0 })
    }
  })

  return (
    <group ref={ball} visible={false}>
      <TennisBall radius={0.42} glow spin={0} />
    </group>
  )
}
