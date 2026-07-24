'use client'

import { useSyncExternalStore } from 'react'

/**
 * A tiny shared store for scroll progress (0 → 1 across the whole page).
 * - `progressRef` is read every frame inside R3F without triggering React
 *   re-renders.
 * - React components can subscribe via `useScrollProgress()` to re-render
 *   (throttled) when progress changes meaningfully.
 */
export const progressRef = { current: 0 }

let reactProgress = 0
const listeners = new Set<() => void>()

export function setScrollProgress(value: number) {
  const clamped = Math.min(1, Math.max(0, value))
  progressRef.current = clamped
  // Only notify React when the change is visible (avoids excessive renders).
  if (Math.abs(clamped - reactProgress) > 0.002) {
    reactProgress = clamped
    listeners.forEach((l) => l())
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return reactProgress
}

export function useScrollProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}

/** Total number of full-screen sections (must match the DOM sections). */
export const SECTION_COUNT = 7
