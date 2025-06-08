import type { FoodCard, MenuItem } from "@/app/types";

export const initialCards: FoodCard[] = [
  {
    id: "1",
    url: "",
    restaurantName: "八方雲集",
    dishName: "牛肉麵",
    cuisine: "中式料理",
    menuCategory: "麵食",
    rating: 4.4,
   menuItems: [
    { name: "牛肉麵", price: 120, category: "麵食" },
    { name: "酸辣湯麵", price: 50, category: "麵食" },
    { name: "辣味麵", price: 80, category: "麵食" },
    { name: "小籠包", price: 60, category: "點心" },
    { name: "煎餃", price: 45, category: "點心" },
    { name: "蒸餃", price: 40, category: "點心" },
    { name: "可樂", price: 25, category: "飲料" },
    { name: "熱茶", price: 15, category: "飲料" },
    ],
    
  },
  {
    id: "2",
    url: "",
    restaurantName: "八方雲集",
    dishName: "牛肉麵",
    cuisine: "中式料理",
    menuCategory: "麵食",
    rating: 4.4,
  },
];
