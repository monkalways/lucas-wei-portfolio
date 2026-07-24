'use client'

import { useSyncExternalStore } from 'react'

/**
 * Coordinates the interactive serve mini-game across the 3D scene (which owns
 * the ball + camera) and the HTML HUD (prompt + result overlay).
 *
 * `serveControl.active` is a plain flag read every frame by the CameraRig so it
 * can hand camera control to the serve game without React re-renders.
 */
export const serveControl = { active: false }

export type ServeHud = {
  show: boolean
  prompt: string
  result: string
  quality: number // 0 (fault) → 1 (perfect ace)
}

let hud: ServeHud = { show: false, prompt: '', result: '', quality: 0 }
const listeners = new Set<() => void>()

export function setServeHud(next: Partial<ServeHud>) {
  hud = { ...hud, ...next }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useServeHud() {
  return useSyncExternalStore(
    subscribe,
    () => hud,
    () => hud,
  )
}
