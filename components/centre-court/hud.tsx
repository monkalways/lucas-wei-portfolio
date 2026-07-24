'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollProgress } from '@/lib/scroll-store'
import { hero } from '@/lib/content'
import { useServeHud } from '@/lib/serve-store'

/* --------------------------- Tennis scoreboard -------------------------- */
const TENNIS = [0, 15, 30, 40]

function scoreForRange(progress: number, start: number, end: number) {
  const t = Math.min(1, Math.max(0, (progress - start) / (end - start)))
  const idx = Math.min(3, Math.floor(t * 4))
  return TENNIS[idx]
}

export function Scoreboard() {
  const p = useScrollProgress()
  const rows = [
    { label: 'ABOUT', score: scoreForRange(p, 0.08, 0.32) },
    { label: 'PROJECTS', score: scoreForRange(p, 0.5, 0.72) },
    { label: 'CONTACT', score: scoreForRange(p, 0.82, 1) },
  ]
  return (
    <div className="pointer-events-none fixed left-6 top-6 z-40 select-none">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1620]/70 backdrop-blur-md">
        <div className="bg-primary/90 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground">
          Centre Court
        </div>
        <div className="divide-y divide-white/5">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-8 px-4 py-2"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-foreground/80">
                {r.label}
              </span>
              <span className="w-8 text-right font-mono text-lg tabular-nums text-primary">
                {r.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------- Tennis-ball scroll nav ----------------------- */
const NAV = [
  { id: 'hero', label: 'Court' },
  { id: 'about', label: 'About' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'traveling', label: 'Travel' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export function BallScrollNav() {
  const p = useScrollProgress()
  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="relative flex flex-col items-center">
        {/* track */}
        <div className="absolute top-0 h-full w-px bg-white/15" />
        {/* rolling ball */}
        <div
          className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full transition-[top] duration-150 ease-out"
          style={{
            top: `calc(${p * 100}% - 8px)`,
            background:
              'radial-gradient(circle at 35% 30%, #e8ff8f, #c6e84b 60%, #9fc22f)',
            boxShadow: '0 0 12px rgba(216,255,98,0.7)',
            transform: `translateX(-50%) rotate(${p * 720}deg)`,
          }}
        >
          <div className="absolute inset-0 rounded-full border-t border-white/70" />
        </div>
        {/* section markers */}
        <div className="flex flex-col justify-between gap-8 py-1">
          {NAV.map((n, i) => {
            const active = Math.round(p * (NAV.length - 1)) === i
            return (
              <button
                key={n.id}
                onClick={() =>
                  document
                    .getElementById(n.id)
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group relative flex items-center"
                aria-label={`Go to ${n.label}`}
              >
                <span className="absolute right-6 whitespace-nowrap rounded-md bg-[#0b1620]/80 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  {n.label}
                </span>
                <span
                  className={`h-2 w-2 rounded-full border transition-all ${
                    active
                      ? 'scale-125 border-primary bg-primary'
                      : 'border-white/40 bg-transparent'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* --------------------- Shrunk name (sticky, top center) ----------------- */
export function MiniName() {
  const p = useScrollProgress()
  // Appears once the big hero name has scrolled off (early in the first section).
  const visible = p > 0.05
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-40 flex justify-center">
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="font-serif text-sm uppercase tracking-[0.4em] text-foreground/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]"
          >
            {hero.name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------- Custom cursor ---------------------------- */
export function TennisCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('cc-custom-cursor')

    // Lock the ball exactly to the pointer — no smoothing lag.
    const onMove = (e: MouseEvent) => {
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('cc-custom-cursor')
    }
  }, [])

  if (!enabled) return null
  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[90] h-6 w-6 rounded-full"
      style={{
        background:
          'radial-gradient(circle at 35% 30%, #e8ff8f, #c6e84b 60%, #9fc22f)',
        boxShadow: '0 0 12px rgba(216,255,98,0.6)',
      }}
    >
      <div className="absolute inset-0 rounded-full border-t border-white/70" />
    </div>
  )
}

/* ------------------------- Serve mini-game overlay ---------------------- */
export function ServeOverlay() {
  const hud = useServeHud()
  const tone =
    hud.quality >= 1
      ? 'text-primary border-primary/50'
      : hud.quality >= 0.5
        ? 'text-foreground border-white/30'
        : hud.result
          ? 'text-red-300 border-red-400/40'
          : 'text-foreground border-white/20'
  return (
    <AnimatePresence>
      {hud.show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="pointer-events-none fixed inset-x-0 bottom-28 z-40 flex justify-center px-6"
        >
          <div
            className={`rounded-2xl border bg-[#0b1620]/85 px-8 py-4 text-center shadow-2xl backdrop-blur-md ${tone}`}
          >
            {hud.result ? (
              <span className="font-serif text-2xl md:text-3xl">
                {hud.result}
              </span>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="font-serif text-xl italic text-foreground md:text-2xl">
                  {hud.prompt}
                </span>
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  press T to strike
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
