"use client";

import { useState, useMemo } from "react";
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
  cuisine,
  rating,
  removeCard,
  index,
  constraintsRef,
  dishName,
  menuCategory,
}: CardProps) {
  const x = useMotionValue(0);
  const isTop = index === 0;
  const controls = useAnimation();

  const [isExiting, setIsExiting] = useState(false);

  const rotateRaw = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 80;
    const velocity = info.velocity.x;
    const movement = x.get();

    if (Math.abs(movement) > threshold || Math.abs(velocity) > 300) {
      const direction = movement > 0 || velocity > 300 ? "like" : "dislike";

      if (isExiting) return;
      setIsExiting(false);
      removeCard(id, direction);
    }
  };

  const handleLike = async () => {
    if (isExiting) return;
    setIsExiting(false);
    removeCard(id, "like");
  };

  const handleDislike = async () => {
    if (isExiting) return;
    setIsExiting(false);
    removeCard(id, "dislike");
  };

  // 根據索引計算卡片的樣式
  const cardStyle = useMemo(() => {
    const yOffset = -10 * index;
    const scaleValue = 1 - index * 0.05;
    const opacityValue = 1 - index * 0.2;

    return {
      y: yOffset,
      scale: scaleValue,
      opacity: Math.max(opacityValue, 0),
      zIndex: 10 - index,
    };
  }, [index]);

  return (
    <>
      <motion.div
        data-card-id={id}
        drag={"x"}
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
        initial={false}
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
              src={url ? url : placeholderSvg}
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

          <CardContent className="basis-1/6 px-2 flex flex-col justify-center ">
            <div className=" flex justify-between items-center ">
              <div className=" flex flex-col justify-center items-start">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {restaurantName}
                </h3>
                <p>{dishName}</p>
              </div>
              <div className=" flex flex-col justify-center items-start">
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {cuisine}
                </p>
                <p className="text-sm text-gray-500">{menuCategory}</p>
              </div>
            </div>
          </CardContent>

          {isTop && (
            <CardFooter className="basis-1/6 p-2  flex justify-center gap-6">
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
