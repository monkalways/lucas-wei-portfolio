'use client'

import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { progressRef } from '@/lib/scroll-store'

type Key = {
  pos: [number, number, number]
  target: [number, number, number]
}

// One keyframe per section (7 total). The camera walks down from high above
// the court, onto the baseline, toward the net, and finally looks up at the
// floodlights at night.
const KEYS: Key[] = [
  { pos: [0, 19, 34], target: [0, 3, -2] }, // hero — high above
  { pos: [0, 7, 24], target: [0, 3, -2] }, // about — descending
  { pos: [-3, 2.4, 16], target: [0, 2, -4] }, // hobbies — on the baseline
  { pos: [5, 3.2, 11], target: [0, 2, -5] }, // traveling — drifting in
  { pos: [-6, 4, 6], target: [0, 2.5, -7] }, // projects — near service line
  { pos: [0, 4.5, 3], target: [0, 3.5, -9] }, // skills — center, looking down court
  { pos: [0, 2.6, 7], target: [0, 5, -1] }, // contact — low, looking up at lights
]

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const curPos = new THREE.Vector3(KEYS[0].pos[0], KEYS[0].pos[1], KEYS[0].pos[2])
const curTarget = new THREE.Vector3(
  KEYS[0].target[0],
  KEYS[0].target[1],
  KEYS[0].target[2],
)

function lerpKey(a: Key, b: Key, t: number, outPos: THREE.Vector3, outTarget: THREE.Vector3) {
  outPos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  )
  outTarget.set(
    THREE.MathUtils.lerp(a.target[0], b.target[0], t),
    THREE.MathUtils.lerp(a.target[1], b.target[1], t),
    THREE.MathUtils.lerp(a.target[2], b.target[2], t),
  )
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function CameraRig() {
  const { camera } = useThree()

  useFrame((state, delta) => {
    const p = progressRef.current
    const segs = KEYS.length - 1
    const scaled = p * segs
    const i = Math.min(segs - 1, Math.floor(scaled))
    const localT = easeInOut(scaled - i)

    lerpKey(KEYS[i], KEYS[i + 1], localT, tmpPos, tmpTarget)

    // Mouse parallax
    const px = state.pointer.x * 1.4
    const py = state.pointer.y * 0.8
    tmpPos.x += px
    tmpPos.y += py

    // Subtle idle camera shake
    const t = state.clock.elapsedTime
    tmpPos.x += Math.sin(t * 1.3) * 0.05
    tmpPos.y += Math.cos(t * 1.7) * 0.04

    // Smooth toward target
    const damp = 1 - Math.pow(0.0015, delta)
    curPos.lerp(tmpPos, damp)
    curTarget.lerp(tmpTarget, damp)

    camera.position.copy(curPos)
    camera.lookAt(curTarget)
  })

  return null
}
