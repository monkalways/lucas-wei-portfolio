# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Centre Court" — a single-page personal portfolio (Lucas Wei) rendered as an interactive 3D tennis stadium built with Next.js 16 (App Router), React 19, and react-three-fiber. The user scrolls a normal HTML page; scroll progress drives a WebGL camera walk through the stadium behind the content.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` — run the dev server (Next.js)
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint

There is no test suite. Note `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` will **not** fail on type errors — run `pnpm exec tsc --noEmit` to actually type-check.

## Architecture

### The scroll → 3D bridge (most important concept)

DOM scroll and the WebGL render loop are decoupled through a tiny external store in `lib/scroll-store.ts`:

- `progressRef.current` (0→1) is a plain mutable ref updated on scroll. R3F components read it **every frame inside `useFrame`** — this never triggers a React render.
- `useScrollProgress()` is a `useSyncExternalStore` hook for React (DOM/HUD) components that need to re-render. It is deliberately **throttled**: listeners only fire when progress changes by >0.002.
- `components/centre-court/experience.tsx` owns the single scroll listener (rAF-throttled) and calls `setScrollProgress()`.

When adding scroll-reactive behavior: read `progressRef.current` inside `useFrame` for 3D/animation; use `useScrollProgress()` only for React components that must re-render. Do not add more scroll listeners.

### Rendering layers (`experience.tsx`)

Three stacked layers:
1. **Fixed `<Canvas>`** (`z-0`, `fixed inset-0`) — the 3D scene, never scrolls.
2. **HUD** (`z-40`, fixed) — scoreboard, ball scroll-nav, custom cursor, serve flash (`hud.tsx`).
3. **Foreground content** (`z-10`, `relative`) — the seven scrolling `<section>`s (`sections.tsx`).

The whole `Experience` is loaded via `next/dynamic` with `ssr: false` from `app/page.tsx` because it is WebGL/browser-only.

### The seven-section model

The site is exactly **7 full-screen sections**, and this count is encoded in multiple places that must stay in sync:
- `SECTION_COUNT` in `lib/scroll-store.ts`
- `sectionOrder` array in `lib/content.ts`
- The `<section id="...">` elements in `sections.tsx`
- The `KEYS` array in `camera-rig.tsx` (one camera keyframe per section)
- The `NAV` array in `hud.tsx`

`camera-rig.tsx` maps scroll progress across the 7 keyframes: it finds the current segment, eases the local `t`, lerps camera position + look-at target, then adds mouse parallax and idle shake, and damps toward the result each frame. Changing the number of sections means updating **all** of the above.

### Content is centralized

`lib/content.ts` is the single source of truth for all site copy (hero, about, hobbies, projects, skills as orbiting balls, contact, scoreboard labels, section order). Edit text there rather than in components.

### 3D scene composition (`components/centre-court/`)

`scene.tsx` assembles the world: `Stadium` (memoized; re-rendered only via a rounded `night` value derived from late scroll progress for the day→night transition), `GrassName` (3D text extruded from a font via `opentype.js`), `Lighting`, `CameraRig`, ambient effects (`ambient.tsx`), scene props (`scene-props.tsx` — orbiting skill balls, project platforms), and `ServeBall`. Post-processing (`@react-three/postprocessing`) is imported but currently commented out in `scene.tsx`.

Performance patterns to preserve: memoize heavy meshes, quantize scroll-derived values before passing them as React props (see the `night` rounding), and keep per-frame work inside `useFrame` reading refs rather than state.

## Conventions

- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- Styling is **Tailwind CSS v4** (config-less; PostCSS plugin `@tailwindcss/postcss`, theme via CSS variables in `app/globals.css`). shadcn/ui is set up (`components.json`, "base-nova" style, base color neutral); UI primitives live in `components/ui/`.
- Any component using hooks, R3F, or browser APIs needs `'use client'` (all of `components/centre-court/` and the stores are client components).
- The custom tennis-ball cursor is toggled by adding the `cc-custom-cursor` class to `<html>` (see `TennisCursor` in `hud.tsx`), gated on `(pointer: fine)`.
