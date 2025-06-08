import { type RefObject } from "react";
export interface CardProps extends FoodCard {
  removeCard: (id: string, action: "like" | "dislike") => void;
  index: number; // 添加索引屬性
  constraintsRef: RefObject<HTMLDivElement>;
}

export interface MenuItem {
  name: string;    // 品項名稱
  price: number;   // 價格
  category: string; // 分類
}

export interface FoodCard {
  id: string;
  url: string;
  restaurantName: string;
  dishName?: string; // 添加菜名屬性
  cuisine?: string;
  rating?: number;
  menuCategory?: string; // 添加菜單類別屬性
  menuItems?: MenuItem[];
}
