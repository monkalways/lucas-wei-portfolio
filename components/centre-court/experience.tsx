'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './scene'
import {
  AboutSection,
  ContactSection,
  HeroSection,
  HobbiesSection,
  ProjectsSection,
  SkillsSection,
  TravelingSection,
} from './sections'
import {
  BallScrollNav,
  MiniName,
  Scoreboard,
  ServeOverlay,
  TennisCursor,
} from './hud'
import { LoadingScreen } from './loading-screen'
import { setScrollProgress } from '@/lib/scroll-store'

export function Experience() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? window.scrollY / max : 0)
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main className="relative w-full bg-background">
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      {/* Fixed 3D background */}
      <div className="fixed inset-0 z-0 h-screen w-full">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 50, near: 0.1, far: 200, position: [0, 19, 34] }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD */}
      <Scoreboard />
      <MiniName />
      <BallScrollNav />
      <TennisCursor />
      <ServeOverlay />

      {/* Foreground scrolling content */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <HobbiesSection />
        <TravelingSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </div>
    </main>
  )
}
