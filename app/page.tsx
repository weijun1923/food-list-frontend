"use client";
import React, { useState, useEffect } from "react";
import TinderCard from "./components/card";
import { cardData } from "@/app/libs/data";

const SwipeCards = () => {
  const [cards, setCards] = useState([...cardData]);
  // 用來存「已經滑掉的卡片」
  const [removedCards, setRemovedCards] = useState<typeof cardData>([]);

  useEffect(() => {
    console.log("removeCards:", removedCards);
  }, [removedCards]);

  useEffect(() => {
    console.log("cards :", cards);
  }, [cards]);

  // 這個函式是用來「移除一張卡片」然後把它存到 removedCards
  const removeCard = (id: number) => {
    // 1. 找到這張卡在 cards 裡的完整資訊
    const cardToRemove = cards.find((c) => c.id === id);
    if (!cardToRemove) return; // 如果找不到就不用做後面了

    // 2. 把這張卡從 cards 裡濾掉
    setCards((prev) => prev.filter((c) => c.id !== id));

    // 3. 將這張卡推進 removedCards 陣列的最後
    setRemovedCards((prev) => [...prev, cardToRemove]);
  };

  // 2. 用這個函式來「回上一張卡片」
  const handleGoBack = () => {
    console.log("handleGoBack called");
    // 如果 removedCards 裡沒有東西，就不用做後面了
    if (removedCards.length === 0) return;

    // 取出 removedCards 最後一張（LIFO）
    const copyRemovedCards = [...removedCards];
    const lastCard = copyRemovedCards[copyRemovedCards.length - 1];

    // 把它放回 cards 的最後面，並且從 removedCards 裡移掉
    setCards((prev) => [...prev, lastCard]);
    setRemovedCards((prev) => prev.slice(0, prev.length - 1));
  };
  return (
    <div className=" h-screen container m-auto bg-neutral-300">
      <div
        // 背景滿版
        className="grid  w-full place-items-center h-full"
      >
        {cards.map((card) => {
          return (
            <TinderCard
              key={card.id}
              cards={cards}
              removeCard={removeCard}
              {...card}
            />
          );
        })}
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleGoBack}
        >
          回上一張
        </button>
      </div>
    </div>
  );
};

export default SwipeCards;
