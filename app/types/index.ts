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
