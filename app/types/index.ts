import { type RefObject } from "react";
export interface CardProps extends FoodCard {
  removeCard: (id: string, action: "like" | "dislike") => void;
  index: number; // 添加索引屬性
  constraintsRef: RefObject<HTMLDivElement>;
}

export interface FoodCard {
  id: string;
  url: string;
  restaurantName: string;
  dishName?: string; // 添加菜名屬性
  cuisine?: string;
  rating?: number;
  menuCategory?: string; // 添加菜單類別屬性
}
