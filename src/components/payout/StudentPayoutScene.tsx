import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { AchievementSphere, SphereImpulse } from './AchievementSphere'

interface StudentPayoutSceneProps {
  sphereImpulse?: React.MutableRefObject<SphereImpulse>
  isAutoRotating?: boolean
  onSelectCard?: (url: string) => void
}

// Adjust camera distance and FOV dynamically for balanced, immersive framing
function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const isMobile = size.width < 580
      const isTablet = size.width >= 580 && size.width < 900

      if (isMobile) {
        camera.position.z = 4.8
        camera.fov = 46
      } else if (isTablet) {
        camera.position.z = 5.6
        camera.fov = 46
      } else {
        camera.position.z = 5.6
        camera.fov = 46
      }
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width, size.height])

  return null
}

// Subtle ambient financial dust / particles drifting in deep space
function FinancialParticles({ count = 90 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cyan = new THREE.Color('#38bdf8')
    const blue = new THREE.Color('#2563eb')
    const gold = new THREE.Color('#f59e0b')

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 6

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const choice = Math.random()
      const c = choice < 0.65 ? cyan : choice < 0.88 ? blue : gold
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015
      pointsRef.current.rotation.x += delta * 0.008
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export const StudentPayoutScene: React.FC<StudentPayoutSceneProps> = ({
  sphereImpulse,
  isAutoRotating = true,
  onSelectCard,
}) => {
  return (
    <div className="student-payout-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0, 5.6], fov: 46, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ResponsiveCamera />

        {/* Cinematic Ambient & Directional Lighting */}
        <ambientLight intensity={1.2} color="#0f172a" />
        <directionalLight position={[5, 6, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, -4, 4]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[0, 0, 3]} intensity={1.2} color="#38bdf8" distance={12} />

        {/* Ambient Floating Particle Field */}
        <FinancialParticles count={90} />

        {/* Multi-Directional Floating Payout Proof Cards */}
        <AchievementSphere
          sphereImpulse={sphereImpulse}
          isAutoRotating={isAutoRotating}
          onSelectCard={onSelectCard}
        />
      </Canvas>
    </div>
  )
}
