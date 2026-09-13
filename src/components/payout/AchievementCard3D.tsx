import React, { useMemo, useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { getOrCreateFeedbackCardTexture } from './feedbackTextureGenerator'

interface AchievementCard3DProps {
  imageUrl: string
  position: [number, number, number]
  normal: [number, number, number]
  index: number
  sphereRadius: number
  cardWidth?: number
  cardHeight?: number
}

export const AchievementCard3D: React.FC<AchievementCard3DProps> = ({
  imageUrl,
  position,
  normal,
  sphereRadius,
  cardWidth: propCardWidth,
  cardHeight: propCardHeight,
  index,
}) => {
  const meshRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const borderMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)

  // 1. Generate / Retrieve cached texture for real student feedback screenshot
  const texture = useMemo(() => getOrCreateFeedbackCardTexture(imageUrl, index), [imageUrl, index])

  // 2. Compute initial rotation so card faces outward from sphere center
  const initialQuat = useMemo(() => {
    const q = new THREE.Quaternion()
    const norm = new THREE.Vector3(...normal).normalize()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), norm)
    return q
  }, [normal])

  // Adaptive portrait dimensions for mobile feedback screenshots (800x1120 ratio: 1 : 1.4)
  const cardWidth = useMemo(
    () => propCardWidth ?? sphereRadius * 0.38,
    [propCardWidth, sphereRadius]
  )
  const cardHeight = useMemo(
    () => propCardHeight ?? cardWidth * 1.4,
    [propCardHeight, cardWidth]
  )

  // Temporary vectors for per-frame calculations
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), [])

  useFrame(() => {
    const group = meshRef.current
    if (!group) return

    // Get card world position
    group.getWorldPosition(worldPos)

    // Normalize z into [0, 1] relative to the actual sphere radius
    const frontZ = worldPos.z
    const proximity = THREE.MathUtils.clamp((frontZ + sphereRadius) / (sphereRadius * 2), 0, 1)

    // 1. Scale boost when front & when hovered
    const baseScale = THREE.MathUtils.lerp(0.85, 1.15, Math.pow(proximity, 1.8))
    const hoverBoost = hovered ? 1.06 : 1.0
    const finalScale = baseScale * hoverBoost

    targetScale.set(finalScale, finalScale, finalScale)
    group.scale.lerp(targetScale, 0.1)

    // 2. Material Opacity on Screenshot (Crystal clear front cards, soft rear cards)
    if (materialRef.current) {
      const targetOpacity = THREE.MathUtils.lerp(0.4, 1.0, Math.pow(proximity, 1.3))
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1)
    }

    // 3. Edge Design: Backing slab border glow
    if (borderMatRef.current) {
      const borderOpacity = THREE.MathUtils.lerp(0.35, 0.95, proximity)
      borderMatRef.current.opacity = borderOpacity
      borderMatRef.current.emissiveIntensity = hovered ? 0.5 : THREE.MathUtils.lerp(0.08, 0.28, proximity)
    }
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
  }

  // Scale corner clips proportionally with card
  const clipSize = Math.max(0.05, cardWidth * 0.05)
  const slabDepth = Math.max(0.015, cardWidth * 0.012)
  const accentColor = '#38BDF8'

  return (
    <group
      ref={meshRef}
      position={position}
      quaternion={initialQuat}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Background backing slab for 3D physical depth & Edge Design */}
      <mesh position={[0, 0, -slabDepth / 2]}>
        <boxGeometry args={[cardWidth + cardWidth * 0.024, cardHeight + cardHeight * 0.024, slabDepth]} />
        <meshStandardMaterial
          ref={borderMatRef}
          color="#061129"
          emissive={accentColor}
          emissiveIntensity={0.12}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Front Face: Authentic Screenshot (NO white glare layer, NO washed-out overlay) */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[cardWidth, cardHeight, 1, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={1.0}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Subtle Metallic Corner Clips */}
      <mesh position={[cardWidth / 2, cardHeight / 2, 0.01]}>
        <planeGeometry args={[clipSize, clipSize]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-cardWidth / 2, cardHeight / 2, 0.01]}>
        <planeGeometry args={[clipSize, clipSize]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>
      <mesh position={[cardWidth / 2, -cardHeight / 2, 0.01]}>
        <planeGeometry args={[clipSize, clipSize]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-cardWidth / 2, -cardHeight / 2, 0.01]}>
        <planeGeometry args={[clipSize, clipSize]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
