"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, Star, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  color: string
  type: "heart" | "sparkle" | "star" | "dot" | "zap"
}

interface EnhancedParticleEffectProps {
  isActive: boolean
  type: "love" | "dislike"
  centerX: number
  centerY: number
  onComplete?: () => void
}

export default function EnhancedParticleEffect({
  isActive,
  type,
  centerX,
  centerY,
  onComplete,
}: EnhancedParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isActive) return

    // 創建粒子
    const newParticles: Particle[] = []
    const particleCount = type === "love" ? 15 : 20

    for (let i = 0; i < particleCount; i++) {
      // 創建爆炸效果的角度分布
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8
      const speed = 80 + Math.random() * 120
      const size = type === "love" ? 12 + Math.random() * 16 : 6 + Math.random() * 12

      // 根據類型選擇粒子類型
      let particleType: Particle["type"]
      if (type === "love") {
        particleType = Math.random() > 0.7 ? "heart" : "dot"
      } else {
        const types: Particle["type"][] = ["sparkle", "star", "zap", "dot"]
        particleType = types[Math.floor(Math.random() * types.length)]
      }

      newParticles.push({
        id: `particle-${i}`,
        x: centerX + (Math.random() - 0.5) * 40, // 添加一些隨機散布
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (30 + Math.random() * 40), // 向上的初始速度
        size,
        rotation: Math.random() * 360,
        color:
          type === "love"
            ? ["#ff1744", "#ff4569", "#ff6b9d", "#ff8fab", "#ffa8c5"][Math.floor(Math.random() * 5)]
            : ["#ffd700", "#ffed4e", "#fff176", "#ffeb3b", "#ff9800"][Math.floor(Math.random() * 5)],
        type: particleType,
      })
    }

    setParticles(newParticles)

    // 清理粒子
    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 2500)

    return () => clearTimeout(timer)
  }, [isActive, type, centerX, centerY, onComplete])

  const getParticleIcon = (particle: Particle) => {
    const commonProps = {
      size: particle.size,
      style: { color: particle.color },
    }

    switch (particle.type) {
      case "heart":
        return <Heart {...commonProps} fill={particle.color} className="text-transparent drop-shadow-sm" />
      case "sparkle":
        return <Sparkles {...commonProps} className="drop-shadow-sm" />
      case "star":
        return <Star {...commonProps} fill={particle.color} className="text-transparent drop-shadow-sm" />
      case "zap":
        return <Zap {...commonProps} fill={particle.color} className="text-transparent drop-shadow-sm" />
      case "dot":
        return (
          <div
            className="rounded-full drop-shadow-sm"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size / 2}px ${particle.color}40`,
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              rotate: particle.rotation,
              opacity: 0,
            }}
            animate={{
              x: particle.x + particle.vx * 1.5,
              y: particle.y + particle.vy + 300, // 重力效果
              scale: [0, 1.2, 1, 0.8, 0],
              rotate: particle.rotation + (particle.type === "heart" ? 180 : 720),
              opacity: [0, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 2,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.15, 0.4, 0.8, 1],
            }}
            style={{
              zIndex: 50,
            }}
          >
            {getParticleIcon(particle)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 背景光暈效果 */}
      {isActive && (
        <motion.div
          className="absolute rounded-full"
          style={{
            left: centerX - 50,
            top: centerY - 50,
            width: 100,
            height: 100,
            background:
              type === "love"
                ? "radial-gradient(circle, rgba(255, 23, 68, 0.3) 0%, rgba(255, 23, 68, 0) 70%)"
                : "radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0) 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: [0, 1, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}
    </div>
  )
}
