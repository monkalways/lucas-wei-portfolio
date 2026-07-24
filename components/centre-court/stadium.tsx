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
  return (
    <group position={position}>
      {/* Tower */}
      <mesh position={[0, 9, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 18, 10]} />
        <meshStandardMaterial color={'#0e1a1f'} metalness={0.4} roughness={0.7} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 18.2, 0]}>
        <boxGeometry args={[3.4, 1.6, 0.5]} />
        <meshStandardMaterial color={'#1a2a30'} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Individual lamps */}
      {[-1.1, -0.37, 0.37, 1.1].map((x) =>
        [-0.4, 0.4].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, 18.2 + y, 0.28]}>
            <circleGeometry args={[0.22, 16]} />
            <meshStandardMaterial
              color={'#fffdf0'}
              emissive={'#fff8e0'}
              emissiveIntensity={0.4 + night * 3.5}
            />
          </mesh>
        )),
      )}
      {night > 0.05 && (
        <spotLight
          position={[0, 18, 0.5]}
          angle={0.5}
          penumbra={0.6}
          intensity={night * 140}
          distance={70}
          color={'#fff6df'}
          target-position={[position[0] * -0.6, 0, position[2] * -0.6]}
          castShadow
        />
      )}
    </group>
  )
}

/**
 * Simple tiered stands surrounding the court.
 */
function Stands() {
  const tiers = [0, 1, 2, 3, 4, 5]
  return (
    <group>
      {(['x', 'z'] as const).map((axis) =>
        [-1, 1].map((sign) => (
          <group key={`${axis}-${sign}`}>
            {tiers.map((t) => {
              const offset = 16 + t * 2.2
              const height = 1.2 + t * 1.4
              const isX = axis === 'x'
              return (
                <mesh
                  key={t}
                  position={
                    isX
                      ? [sign * offset, height / 2, 0]
                      : [0, height / 2, sign * offset]
                  }
                  receiveShadow
                >
                  <boxGeometry
                    args={
                      isX ? [1.9, height, 46] : [46, height, 1.9]
                    }
                  />
                  <meshStandardMaterial
                    color={t % 2 === 0 ? '#0f1d24' : '#132730'}
                    roughness={0.9}
                  />
                </mesh>
              )
            })}
          </group>
        )),
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
