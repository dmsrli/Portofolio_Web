'use client'

import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { easing } from 'maath'

export default function Background3D() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={['#050b16']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#1E90FF" />
        <NeuralWeb />
        <Effects />
      </Canvas>
    </div>
  )
}

function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.015} focalLength={0.025} bokehScale={3.5} height={480} />
      <Bloom
        luminanceThreshold={0.1}
        luminanceSmoothing={0.8}
        height={300}
        opacity={2}
        blendFunction={BlendFunction.ADD}
      />
    </EffectComposer>
  )
}

function NeuralWeb() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const energyRef = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  const particleCount = 320

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  const linePositions = useMemo(() => {
    const lines: number[] = []
    const p: THREE.Vector3[] = []
    for (let i = 0; i < particleCount; i++) {
      p.push(new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]))
    }
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = p[i].distanceTo(p[j])
        if (dist < 1.4) {
          lines.push(p[i].x, p[i].y, p[i].z, p[j].x, p[j].y, p[j].z)
        }
      }
    }
    return new Float32Array(lines)
  }, [positions])

  const energyPositions = useMemo(() => {
    const arr = new Float32Array(180 * 3)
    for (let i = 0; i < 180; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const targetRotX = mouse.y * 0.3
    const targetRotY = mouse.x * 0.3

    if (pointsRef.current && linesRef.current && energyRef.current) {
      easing.dampE(pointsRef.current.rotation, [targetRotX, targetRotY, 0], 0.3, delta)
      easing.dampE(linesRef.current.rotation, [targetRotX, targetRotY, 0], 0.3, delta)
      easing.dampE(energyRef.current.rotation, [targetRotX, targetRotY, 0], 0.3, delta)
    }

    if (energyRef.current) {
      const hue = (t * 30) % 360
      const color = new THREE.Color(`hsl(${hue}, 100%, 60%)`)
      const mat = energyRef.current.material as THREE.PointsMaterial
      mat.color = color
      mat.size = 0.1 + Math.sin(t * 2) * 0.03
    }

    if (pointsRef.current) {
      pointsRef.current.position.y = Math.sin(t * 0.4) * 0.1
    }
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#00BFFF" size={0.05} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1E90FF" transparent opacity={0.1} />
      </lineSegments>

      <points ref={energyRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[energyPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#00FFFF" size={0.09} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}
