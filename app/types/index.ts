import { type RefObject } from "react";
export interface CardProps extends FoodCard {
  removeCard: (id: string, action: "like" | "dislike") => void;
  index: number; // 添加索引屬性
  constraintsRef: RefObject<HTMLDivElement>;
}

export interface MenuItem {
  name: string; // 品項名稱
  price: number; // 價格
  category: string; // 分類
}

export interface FoodCard {
  id: string;
  url: string;
  restaurantName: string;
  dishName?: string;
  cuisine?: string;
  rating?: number;
  menuCategory?: string;
  price: number;
}

export interface Slide {
  src: string;
  alt?: string;
}

export interface CarouselProps {
  images: Slide[];
  /**
   * Tailwind max height classes, e.g. "h-56 md:h-96"
   * Default: "h-56 md:h-96"
   */
  heightClasses?: string;
  /**
   * Tailwind width classes, e.g. "w-full"
   * Default: "w-full"
   */
  widthClasses?: string;
  /**
   * Auto-advance delay in ms. 0 to disable.
   * Default: 5000
   */
  interval?: number;
}

// app/types.ts
export interface Restaurant {
  id: string;
  restaurant_name: string;
  image_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  image_key: string | null;
  dish_name: string;
  cuisine: string;
  menu_category: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}
