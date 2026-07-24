'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let raf = 0
    const startedAt = performance.now()
    const total = 2400 // ms

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / total)
      // ease-out so it slows near the end
      const eased = 1 - Math.pow(1 - t, 2)
      setPct(Math.round(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setGone(true)
          onDone()
        }, 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#091118]"
        >
          <div className="relative flex h-40 w-40 items-end justify-center">
            <div
              className="h-16 w-16 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #e8ff8f, #c6e84b 60%, #9fc22f)',
                boxShadow: '0 0 30px rgba(216,255,98,0.5)',
                animation: 'cc-bounce 0.9s cubic-bezier(0.5,0,0.5,1) infinite',
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-t-2 border-white/70" />
            </div>
            <div className="absolute bottom-0 h-2 w-16 rounded-full bg-black/40 blur-sm" />
          </div>
          <div className="mt-8 flex items-baseline gap-3 font-serif">
            <span className="text-3xl italic text-foreground">Loading</span>
            <span className="text-3xl tabular-nums text-primary">{pct}%</span>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Centre Court
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
