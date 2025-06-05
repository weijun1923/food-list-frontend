"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  type PanInfo,
} from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, X, Star } from "lucide-react";
import type { CardProps } from "../app/types";
import { cn } from "@/lib/utils";
import placeholderSvg from "@/public/placeholder.svg";

export default function TinderCard({
  id,
  url,
  restaurantName,
  description,
  cuisine,
  rating,
  removeCard,
  cards,
  index,
  constraintsRef,
}: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const [isExiting, setIsExiting] = useState(false);
  const [particleEffect, setParticleEffect] = useState<{
    isActive: boolean;
    type: "love" | "dislike";
    centerX: number;
    centerY: number;
  }>({
    isActive: false,
    type: "love",
    centerX: 0,
    centerY: 0,
  });

  // 旋轉和透明度動畫
  const rotateRaw = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  // 喜歡/不喜歡的視覺提示
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  // 卡片縮放效果
  const scale = useTransform(x, [-300, 0, 300], [0.9, 1, 0.9]);

  const isTop = index === 0;

  const triggerParticleEffect = (
    type: "love" | "dislike",
    centerX: number,
    centerY: number
  ) => {
    setParticleEffect({
      isActive: true,
      type,
      centerX,
      centerY,
    });
  };

  const flyAway = async (direction: "left" | "right") => {
    if (isExiting) return;
    setIsExiting(true);

    // 計算卡片中心位置
    const cardElement = document.querySelector(
      `[data-card-id="${id}"]`
    ) as HTMLElement;

    const rect = cardElement?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    // 觸發粒子效果
    triggerParticleEffect(
      direction === "right" ? "love" : "dislike",
      centerX,
      centerY
    );

    removeCard(id, direction === "right" ? "like" : "dislike");

    // 計算飛走的目標位置
    const targetX = direction === "right" ? 500 : -500;
    const targetY = -150 + Math.random() * 100;
    const targetRotate = direction === "right" ? 45 : -45;

    // 執行飛走動畫
    await controls.start({
      x: targetX,
      y: targetY,
      rotate: targetRotate,
      opacity: 0,
      scale: 0.7,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    });
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 80;
    const velocity = info.velocity.x;
    const movement = x.get();

    if (Math.abs(movement) > threshold || Math.abs(velocity) > 300) {
      const direction = movement > 0 || velocity > 300 ? "right" : "left";

      await flyAway(direction);
    }
  };

  const handleLike = async () => {
    if (isExiting) return;
    await flyAway("right");
    removeCard(id, "like");
  };

  const handleDislike = async () => {
    if (isExiting) return;
    await flyAway("left");
    removeCard(id, "dislike");
  };

  // 根據索引計算卡片的樣式
  const getCardStyle = () => {
    const yOffset = -10 * index;
    const scaleValue = 1 - index * 0.05;
    const opacityValue = 1 - index * 0.2;

    return {
      y: yOffset,
      scale: scaleValue,
      opacity: opacityValue > 0 ? opacityValue : 0,
      zIndex: 10 - index,
    };
  };

  const cardStyle = getCardStyle();

  return (
    <>
      <motion.div
        data-card-id={id}
        drag={isTop ? "x" : false}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotateRaw : 0,
          touchAction: "none",
        }}
        className="absolute inset-0 w-full h-full"
        initial={{
          scale: 0.8,
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          scale: cardStyle.scale,
          opacity: cardStyle.opacity,
          y: cardStyle.y,
          zIndex: cardStyle.zIndex,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          },
        }}
      >
        <Card
          className={cn(
            "gap-0 p-0 flex flex-col h-full w-full relative overflow-hidden bg-white border border-gray-200",
            isTop ? "shadow-xl" : "shadow-md"
          )}
        >
          {/* 喜歡指示器 */}
          {isTop && (
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 right-8 z-20 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12"
            >
              <Heart className="inline mr-2" size={20} fill="white" />
              LIKE
            </motion.div>
          )}

          {/* 不喜歡指示器 */}
          {isTop && (
            <motion.div
              style={{ opacity: dislikeOpacity }}
              className="absolute top-8 left-8 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12"
            >
              <X className="inline mr-2" size={20} />
              NOPE
            </motion.div>
          )}

          <CardHeader className="p-0 basis-4/6  m-0 relative overflow-hidden">
            <Image
              src={url || placeholderSvg}
              fill
              alt={restaurantName}
              draggable={false}
              className="object-cover"
              priority={index < 2}
            />

            {rating && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={14} fill="gold" className="text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="basis-1/6 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {restaurantName}
              </h3>
              {cuisine && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {cuisine}
                </p>
              )}
              {description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </CardContent>

          {isTop && (
            <CardFooter className="basis-1/6 p-2 mt-4 flex justify-center gap-4">
              <motion.button
                onClick={handleDislike}
                disabled={isExiting}
                className="w-14 h-14 bg-white border-2 border-red-500 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <X size={24} strokeWidth={2.5} />
              </motion.button>

              <motion.button
                onClick={handleLike}
                disabled={isExiting}
                className="w-14 h-14 bg-white border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <Heart size={24} strokeWidth={2.5} />
              </motion.button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </>
  );
}
