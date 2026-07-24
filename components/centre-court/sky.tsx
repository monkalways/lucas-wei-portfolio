'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A soft vertical gradient sky dome (warm horizon → cooler zenith).
 *
 * We use this as the visible backdrop instead of showing the raw HDRI, because
 * an HDRI is a full sphere whose lower half is the (grey) ground — displaying
 * it directly exposed an ugly hard horizon line. The HDRI is still used purely
 * for lighting.
 *
 * The dome is re-centred on the camera every frame and drawn with depth test
 * off, so it can never be clipped by the camera's far plane (which previously
 * sliced a moving black wedge out of the background) and always sits behind
 * every other object.
 */
export function GradientSky() {
  const mesh = useRef<THREE.Mesh>(null)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
        uniforms: {
          // NOTE: bottomColor must match the scene fog colour in scene.tsx so
          // the fogged ground blends seamlessly into the sky at the horizon.
          topColor: { value: new THREE.Color('#8a90b0') },
          bottomColor: { value: new THREE.Color('#e7c6a2') },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            // Object-space direction → gradient is by latitude, so it stays
            // correct no matter where the dome is translated to.
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          varying vec3 vDir;
          void main() {
            float t = smoothstep(-0.1, 0.55, vDir.y);
            gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
          }
        `,
      }),
    [],
  )

  useFrame((state) => {
    if (mesh.current) mesh.current.position.copy(state.camera.position)
  })

  return (
    <mesh
      ref={mesh}
      material={material}
      renderOrder={-1}
      frustumCulled={false}
    >
      <sphereGeometry args={[100, 32, 16]} />
    </mesh>
  )
}
