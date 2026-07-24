'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type TennisBallProps = {
  position?: [number, number, number]
  radius?: number
  glow?: boolean
  spin?: number
}

/**
 * The classic tennis-ball seam: a single closed curve that waves twice as it
 * wraps around the sphere (unlike two flat rings, this reads as a real seam).
 */
class SeamCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly radius: number,
    private readonly amp = 0.6,
  ) {
    super()
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const lon = t * Math.PI * 2
    const lat = this.amp * Math.sin(lon * 2)
    const cl = Math.cos(lat)
    return target.set(
      this.radius * cl * Math.cos(lon),
      this.radius * Math.sin(lat),
      this.radius * cl * Math.sin(lon),
    )
  }
}

/**
 * A realistic-ish tennis ball: matte optic-yellow felt with a curved white
 * seam. Set `glow` to make it pop, `spin` to control idle rotation speed
 * (spin={0} = a ball at rest).
 */
export function TennisBall({
  position = [0, 0, 0],
  radius = 0.5,
  glow = false,
  spin = 1,
}: TennisBallProps) {
  const group = useRef<THREE.Group>(null)

  const seamGeo = useMemo(
    () =>
      new THREE.TubeGeometry(
        new SeamCurve(radius * 1.002),
        220,
        radius * 0.05,
        10,
        true,
      ),
    [radius],
  )

  useFrame((_, delta) => {
    if (spin && group.current) {
      group.current.rotation.y += delta * 0.6 * spin
      group.current.rotation.x += delta * 0.15 * spin
    }
  })

  return (
    <group ref={group} position={position}>
      {/* Felt */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={'#d7e300'}
          roughness={1}
          metalness={0}
          emissive={'#c3d400'}
          emissiveIntensity={glow ? 0.9 : 0.18}
        />
      </mesh>
      {/* Curved seam */}
      <mesh geometry={seamGeo} castShadow>
        <meshStandardMaterial color={'#f4f2e6'} roughness={0.85} metalness={0} />
      </mesh>
    </group>
  )
}
