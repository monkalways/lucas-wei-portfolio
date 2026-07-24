'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COURT = {
  halfLength: 11.9, // baseline distance from net
  halfWidthDoubles: 5.485,
  halfWidthSingles: 4.115,
  serviceLine: 6.4,
  lineY: 0.03,
  lineW: 0.12,
}

function Line({
  length,
  width,
  position,
}: {
  length: number
  width: number
  position: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial
        color={'#ffffff'}
        roughness={0.5}
        emissive={'#ffffff'}
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}

function CourtLines() {
  const { halfLength, halfWidthDoubles, halfWidthSingles, serviceLine, lineY, lineW } =
    COURT
  const fullLen = halfLength * 2
  return (
    <group position={[0, lineY, 0]}>
      {/* Baselines */}
      <Line length={lineW} width={halfWidthDoubles * 2} position={[0, 0, halfLength]} />
      <Line length={lineW} width={halfWidthDoubles * 2} position={[0, 0, -halfLength]} />
      {/* Doubles sidelines */}
      <Line length={fullLen} width={lineW} position={[halfWidthDoubles, 0, 0]} />
      <Line length={fullLen} width={lineW} position={[-halfWidthDoubles, 0, 0]} />
      {/* Singles sidelines */}
      <Line length={fullLen} width={lineW} position={[halfWidthSingles, 0, 0]} />
      <Line length={fullLen} width={lineW} position={[-halfWidthSingles, 0, 0]} />
      {/* Service lines */}
      <Line
        length={lineW}
        width={halfWidthSingles * 2}
        position={[0, 0, serviceLine]}
      />
      <Line
        length={lineW}
        width={halfWidthSingles * 2}
        position={[0, 0, -serviceLine]}
      />
      {/* Center service line */}
      <Line length={serviceLine * 2} width={lineW} position={[0, 0, 0]} />
      {/* Center marks on baselines */}
      <Line length={0.6} width={lineW} position={[0, 0, halfLength - 0.3]} />
      <Line length={0.6} width={lineW} position={[0, 0, -halfLength + 0.3]} />
    </group>
  )
}

function Net() {
  const netMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0b0f0d',
      transparent: true,
      opacity: 0.55,
      roughness: 1,
      side: THREE.DoubleSide,
    })
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Net mesh */}
      <mesh position={[0, 0.55, 0]} material={netMat}>
        <planeGeometry args={[11.6, 1.07]} />
      </mesh>
      {/* White tape on top */}
      <mesh position={[0, 1.07, 0]}>
        <boxGeometry args={[11.6, 0.07, 0.05]} />
        <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} />
      </mesh>
      {/* Posts */}
      {[-5.8, 5.8].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.15, 12]} />
          <meshStandardMaterial color={'#123'} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Floodlight({
  position,
  night,
}: {
  position: [number, number, number]
  night: number
}) {
  // Rotate the rig so the lamp bank faces the court centre (world origin).
  const facing = Math.atan2(-position[0], -position[2])
  const lampGlow = 1.4 + night * 5
  return (
    <group position={position}>
      <group rotation={[0, facing, 0]}>
        {/* Tapered pole */}
        <mesh position={[0, 9, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.5, 18, 12]} />
          <meshStandardMaterial color={'#0c171c'} metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Support arm reaching toward the court */}
        <mesh position={[0, 17.5, 0.55]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.25, 0.25, 2.2]} />
          <meshStandardMaterial color={'#0c171c'} metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Banked lamp head, tilted down toward the court */}
        <group position={[0, 18.4, 1.0]} rotation={[0.5, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.2, 2.3, 0.4]} />
            <meshStandardMaterial color={'#16262c'} metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Grid of individual lamps */}
          {[-1.6, -0.8, 0, 0.8, 1.6].map((x) =>
            [-0.75, 0, 0.75].map((y) => (
              <mesh key={`${x}-${y}`} position={[x, y, 0.23]}>
                <circleGeometry args={[0.3, 20]} />
                <meshStandardMaterial
                  color={'#fffdf0'}
                  emissive={'#fff4d0'}
                  emissiveIntensity={lampGlow}
                  toneMapped={false}
                />
              </mesh>
            )),
          )}
        </group>
      </group>
      {/* Local glow — reads by day, blooms strongly at night */}
      <pointLight
        position={[0, 18.4, 0]}
        intensity={1.4 + night * 22}
        distance={48}
        color={'#fff2d6'}
      />
      {night > 0.05 && (
        <spotLight
          position={[0, 18, 0]}
          angle={0.55}
          penumbra={0.6}
          intensity={night * 160}
          distance={85}
          color={'#fff6df'}
          target-position={[-position[0], 0, -position[2]]}
          castShadow
        />
      )}
    </group>
  )
}

/**
 * Raked grandstand bowl surrounding the court: stepped risers with alternating
 * seat rows and a dark-green front barrier wall.
 */
function Stands() {
  const tiers = [0, 1, 2, 3, 4, 5, 6]
  const len = 52
  return (
    <group>
      {(['x', 'z'] as const).map((axis) =>
        [-1, 1].map((sign) => {
          const isX = axis === 'x'
          return (
            <group key={`${axis}-${sign}`}>
              {tiers.map((t) => {
                const offset = 15 + t * 1.9
                const height = 1.0 + t * 1.25
                const seatOffset = offset - 0.7 // toward the court
                return (
                  <group key={t}>
                    {/* Riser block (the step) */}
                    <mesh
                      position={
                        isX
                          ? [sign * offset, height / 2, 0]
                          : [0, height / 2, sign * offset]
                      }
                      receiveShadow
                      castShadow
                    >
                      <boxGeometry args={isX ? [1.9, height, len] : [len, height, 1.9]} />
                      <meshStandardMaterial
                        color={t % 2 === 0 ? '#101f27' : '#163039'}
                        roughness={0.92}
                      />
                    </mesh>
                    {/* Seat-row lip along the top front edge */}
                    <mesh
                      position={
                        isX
                          ? [sign * seatOffset, height + 0.04, 0]
                          : [0, height + 0.04, sign * seatOffset]
                      }
                    >
                      <boxGeometry args={isX ? [0.5, 0.16, len] : [len, 0.16, 0.5]} />
                      <meshStandardMaterial
                        color={'#26454f'}
                        roughness={0.8}
                        emissive={'#0b1c22'}
                        emissiveIntensity={0.3}
                      />
                    </mesh>
                  </group>
                )
              })}
            </group>
          )
        }),
      )}

      {/* Dark-green front barrier wall around the court */}
      {(['x', 'z'] as const).map((axis) =>
        [-1, 1].map((sign) => {
          const isX = axis === 'x'
          const wall = 13.5
          return (
            <mesh
              key={`wall-${axis}-${sign}`}
              position={isX ? [sign * wall, 0.7, 0] : [0, 0.7, sign * wall]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={isX ? [0.4, 1.4, 54] : [54, 1.4, 0.4]} />
              <meshStandardMaterial color={'#0d3b2a'} roughness={0.8} />
            </mesh>
          )
        }),
      )}
    </group>
  )
}

export function Stadium({ night = 0 }: { night?: number }) {
  const grassMap = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/textures/grass.png')
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(30, 30)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const courtMap = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/textures/grass.png')
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(6, 12)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const grassRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    // gentle "wind" shimmer on the surrounding grass
    if (grassRef.current) {
      const m = grassRef.current.material as THREE.MeshStandardMaterial
      m.opacity = 1
    }
  })

  return (
    <group>
      {/* Surrounding lawn */}
      <mesh
        ref={grassRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial map={grassMap} color={'#2e8b57'} roughness={1} />
      </mesh>

      {/* Court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 30]} />
        <meshStandardMaterial map={courtMap} color={'#35654d'} roughness={1} />
      </mesh>

      <CourtLines />
      <Net />
      <Stands />

      {/* Four floodlight towers */}
      <Floodlight position={[-18, 0, -18]} night={night} />
      <Floodlight position={[18, 0, -18]} night={night} />
      <Floodlight position={[-18, 0, 18]} night={night} />
      <Floodlight position={[18, 0, 18]} night={night} />
    </group>
  )
}
