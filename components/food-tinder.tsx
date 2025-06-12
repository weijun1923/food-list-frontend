"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TinderCard from "./tinder-card";
import { RotateCcw, Heart, X } from "lucide-react";
import type { FoodCard } from "../app/types";
import { initialCards } from "@/app/libs/data";

export default function FoodTinder() {
  const [cards, setCards] = useState<FoodCard[]>(initialCards);
  const [likedCards, setLikedCards] = useState<FoodCard[]>([]);
  const [dislikedCards, setDislikedCards] = useState<FoodCard[]>([]);
  const containerRef = useRef<HTMLDivElement>(null!);

  const removeCard = (id: string, action: "like" | "dislike") => {
    const cardToRemove = cards.find((card) => card.id === id);
    if (!cardToRemove) return;

    setCards((prev) => prev.filter((card) => card.id !== id));

    if (action === "like") {
      setLikedCards((prev) => [...prev, cardToRemove]);
    } else {
      setDislikedCards((prev) => [...prev, cardToRemove]);
    }
  };

  const resetCards = () => {
    setCards(initialCards);
    setLikedCards([]);
    setDislikedCards([]);
  };

  return (
    <div className="mx-auto container h-screen flex flex-col justify-between items-center backdrop-blur-3xl  bg-white/30 p-4">
      <div className="  flex flex-col flex-1 lg:w-2/7 w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">美食選擇</h1>
          <p className="text-gray-600">滑動發現你的下一餐</p>
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-6 text-sm">
          <div className="flex items-center gap-2 text-red-600">
            <X size={16} />
            <span>跳過: {dislikedCards.length}</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <Heart size={16} fill="currentColor" />
            <span>喜歡: {likedCards.length}</span>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-full  mb-8">
          {cards.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                沒有更多美食了！
              </h3>
              <p className="text-gray-600 mb-6">你已經看完所有推薦</p>
              <motion.button
                onClick={resetCards}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <RotateCcw size={20} />
                重新開始
              </motion.button>
            </div>
          ) : (
            <div className="relative w-full h-full" ref={containerRef}>
              <AnimatePresence>
                {cards.map((card, index) => (
                  <TinderCard
                    key={card.id}
                    {...card}
                    removeCard={removeCard}
                    index={index}
                    constraintsRef={containerRef}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Instructions */}
        {cards.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            <p>← 左滑跳過 | 右滑喜歡 →</p>
            <p className="mt-1">或點擊下方按鈕</p>
          </div>
        )}
      </div>
    </div>
  );
}
