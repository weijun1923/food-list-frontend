"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardProps } from "../types";

export default function TinderCard({
  id,
  url,
  restaurantname,
  removeCard,
  cards,
}: CardProps) {
  const x = useMotionValue(0); // 左右移動的動畫路徑

  // 根據 x 來變化旋轉角度與透明度
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  // 判斷這張卡片是不是「最上面」那張
  const isFront = id === cards[0].id;

  // 把旋轉角度轉成字串加上 "deg"
  const rotate = useTransform(rotateRaw, (value) => `${value}deg`);

  // 滑得超過 100 px，就觸發 removeCard
  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      removeCard(id);
    }
  };

  return (
    <Card>
      <motion.div
        // 整個容器可拖曳
        drag="x"
        onDragEnd={handleDragEnd}
        style={{
          x,
          opacity,
          rotate,
          transition: "0.125s transform",
          gridRow: 1,
          gridColumn: 1,
          // 如果是最上層卡片，加上陰影
          boxShadow: isFront
            ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
            : undefined,
          touchAction: "none",
          // 這裡同時控制縮放
          scale: isFront ? 1 : 0.98,
          // 將容器設為彈性或 block 皆可，確保圖片和文字能垂直排列
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "0.5rem", // tailwind 的 rounded-lg
        }}
        // 卡片大小
        className=" w-2/5 h-3/5 hover:cursor-grab active:cursor-grabbing"
      >
        {/* 圖片 */}
        <Image
          src={url}
          width={500}
          height={500}
          alt="Card image"
          draggable={false}
          className=" w-full h-full rounded-t-lg object-cover"
        />

        {/* 文字區塊 */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium">{restaurantname}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {/* 可以放描述或其他任意文字 */}
            這是一張卡片的說明文字，和圖片會一起同步滑動。
          </p>
        </div>
      </motion.div>

      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p> Footer</p>
      </CardFooter>
    </Card>
  );
}
