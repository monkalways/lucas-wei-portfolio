'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import opentype from 'opentype.js'

const FONT_URL = '/fonts/Geist-Regular.ttf'
const TEXT = 'LUCAS WEI'

// Convert an opentype.js path to an array of THREE.Shape (with holes).
function pathToShapes(path: opentype.Path, scale: number): THREE.Shape[] {
  const shapes: THREE.Shape[] = []
  let current: THREE.Shape | null = null
  const subPaths: THREE.Path[] = []

  for (const cmd of path.commands) {
    switch (cmd.type) {
      case 'M': {
        current = new THREE.Shape()
        current.moveTo(cmd.x * scale, -cmd.y * scale)
        subPaths.push(current)
        break
      }
      case 'L':
        current?.lineTo(cmd.x * scale, -cmd.y * scale)
        break
      case 'C':
        current?.bezierCurveTo(
          cmd.x1 * scale,
          -cmd.y1 * scale,
          cmd.x2 * scale,
          -cmd.y2 * scale,
          cmd.x * scale,
          -cmd.y * scale,
        )
        break
      case 'Q':
        current?.quadraticCurveTo(
          cmd.x1 * scale,
          -cmd.y1 * scale,
          cmd.x * scale,
          -cmd.y * scale,
        )
        break
      case 'Z':
        current?.closePath()
        break
    }
  }

  // Determine outer shapes vs holes by signed area.
  const area = (pts: THREE.Vector2[]) => {
    let a = 0
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i]
      const p2 = pts[(i + 1) % pts.length]
      a += p1.x * p2.y - p2.x * p1.y
    }
    return a / 2
  }

  const withMeta = subPaths.map((sp) => {
    const pts = sp.getPoints(24)
    return { shape: sp as unknown as THREE.Shape, pts, area: area(pts) }
  })

  const outers = withMeta.filter((s) => s.area > 0)
  const holes = withMeta.filter((s) => s.area <= 0)

  const pointInPoly = (pt: THREE.Vector2, poly: THREE.Vector2[]) => {
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x,
        yi = poly[i].y
      const xj = poly[j].x,
        yj = poly[j].y
      const intersect =
        yi > pt.y !== yj > pt.y &&
        pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    return inside
  }

  for (const outer of outers) {
    const shape = outer.shape
    for (const hole of holes) {
      const sample = hole.pts[0]
      if (sample && pointInPoly(sample, outer.pts)) {
        shape.holes.push(new THREE.Path((hole.shape as THREE.Path).getPoints(24)))
      }
    }
    shapes.push(shape)
  }

  return shapes.length ? shapes : withMeta.map((s) => s.shape)
}

export function GrassName({
  position = [0, 0, 0],
  targetHeight = 2.4,
}: {
  position?: [number, number, number]
  targetHeight?: number
}) {
  const group = useRef<THREE.Group>(null)
  const [geometry, setGeometry] = useState<THREE.ExtrudeGeometry | null>(null)

  const grassMap = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/textures/grass.png')
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(0.12, 0.12)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useEffect(() => {
    let disposed = false
    // Fetch the font and parse it via opentype.parse (the callback-based
    // opentype.load is deprecated in newer opentype.js).
    fetch(FONT_URL)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (disposed) return
        const font = opentype.parse(buffer)
        const unitsPerEm = font.unitsPerEm || 1000
        const scale = targetHeight / (unitsPerEm * 0.7)
        const fontPath = font.getPath(TEXT, 0, 0, unitsPerEm * 0.7)
        const shapes = pathToShapes(fontPath, scale)

        const geo = new THREE.ExtrudeGeometry(shapes, {
          depth: 0.9,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.06,
          bevelSegments: 4,
          curveSegments: 12,
        })
        geo.center()
        geo.computeVertexNormals()
        // Scale UVs so the grass texture tiles across the letters.
        geo.computeBoundingBox()
        setGeometry(geo)
      })
      .catch((err) => {
        if (!disposed) console.error('[centre-court] font load error', err)
      })
    return () => {
      disposed = true
    }
  }, [targetHeight])

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime
      group.current.rotation.z = Math.sin(t * 0.6) * 0.012
      group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.05
    }
  })

  if (!geometry) return null

  return (
    <group ref={group} position={position}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          map={grassMap}
          color={'#57b87e'}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
    </group>
  )
}
