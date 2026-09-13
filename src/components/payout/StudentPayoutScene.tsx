import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { AchievementSphere, SphereImpulse } from './AchievementSphere'

interface StudentPayoutSceneProps {
  sphereImpulse?: React.MutableRefObject<SphereImpulse>
  isAutoRotating?: boolean
}

// Adjust camera distance and FOV dynamically for mobile portrait screens
function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const isMobile = size.width < 580
      const isTablet = size.width >= 580 && size.width < 900

      if (isMobile) {
        // Perfectly framed for true 3D sphere showing top, middle, and bottom tiers
        camera.position.z = 7.6
        camera.fov = 48
      } else if (isTablet) {
        camera.position.z = 8.5
        camera.fov = 46
      } else {
        camera.position.z = 9.4
        camera.fov = 46
      }
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width, size.height])

  return null
}

// Subtle ambient financial dust / particles in background
function FinancialParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cyan = new THREE.Color('#38bdf8')
    const blue = new THREE.Color('#2563eb')
    const gold = new THREE.Color('#f59e0b')

    for (let i = 0; i < count; i++) {
      const r = 4.8 + Math.random() * 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI

      pos[i * 3] = r * Math.cos(phi) * Math.sin(theta)
      pos[i * 3 + 1] = r * Math.sin(phi)
      pos[i * 3 + 2] = r * Math.cos(phi) * Math.cos(theta)

      const choice = Math.random()
      const c = choice < 0.6 ? cyan : choice < 0.85 ? blue : gold
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02
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
        size={0.065}
        vertexColors
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export const StudentPayoutScene: React.FC<StudentPayoutSceneProps> = ({
  sphereImpulse,
  isAutoRotating = true,
}) => {
  return (
    <div className="student-payout-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0, 9.4], fov: 46, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ResponsiveCamera />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={1.1} color="#0f172a" />
        <directionalLight position={[6, 7, 7]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-6, -4, 4]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[0, 0, -4]} intensity={1.4} color="#2563eb" distance={15} />

        {/* Ambient Financial Particle Cloud */}
        <FinancialParticles count={85} />

        {/* 3D Achievement Sphere */}
        <AchievementSphere sphereImpulse={sphereImpulse} isAutoRotating={isAutoRotating} />
      </Canvas>
    </div>
  )
}
