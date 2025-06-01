"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Undo2, X } from "lucide-react";
import { CardProps } from "../types";
import { cn } from "@/lib/utils";

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

        touchAction: "none",
        // 這裡同時控制縮放
        scale: isFront ? 1 : 0.98,
        // 將容器設為彈性或 block 皆可，確保圖片和文字能垂直排列
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "0.5rem", // tailwind 的 rounded-lg
      }}
      // 卡片大小
      className=" w-full lg:w-2/5 h-96 hover:cursor-grab active:cursor-grabbing"
    >
      {/* 圖片 */}

      <Card
        className={cn(
          " h-full grid grid-rows-12 gap-0 p-0 shadow-none",
          isFront && "shadow-lg"
        )}
      >
        <CardHeader className="row-span-8 overflow-hidden relative p-0 m-0">
          <Image
            src={url}
            fill
            alt="Card image"
            draggable={false}
            className=" w-full h-full rounded-t-lg object-cover"
          />
        </CardHeader>
        <CardContent className="row-span-2 flex flex-col justify-center text-center p-4">
          <h3 className="text-lg font-medium">{restaurantname}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {/* 可以放描述或其他任意文字 */}
            這是一張卡片的說明文字，和圖片會一起同步滑動。
          </p>
        </CardContent>
        <CardFooter className="flex justify-between row-span-2">
          <Button>
            <X />
          </Button>
          <Button>
            <Undo2 />
          </Button>
          <Button>
            <Heart />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
