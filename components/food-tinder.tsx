"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TinderCard from "./tinder-card";
import { RotateCcw, Heart, X } from "lucide-react";
import type { FoodCard } from "../app/types";
import { getCookie } from "@/app/libs/cookie";
import { useEffect } from "react";

export default function FoodTinder() {
  const [cards, setCards] = useState<FoodCard[]>([]);
  const [likedCards, setLikedCards] = useState<FoodCard[]>([]);
  const [dislikedCards, setDislikedCards] = useState<FoodCard[]>([]);
  const containerRef = useRef<HTMLDivElement>(null!);
  const [menusData, setMenuData] = useState<FoodCard[]>([]);

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
    setCards(menusData);
    setLikedCards([]);
    setDislikedCards([]);
  };

  interface RestaurantCard {
    id: string;
    restaurant_name: string;
    image_key: string | null;
  }

  interface MenuCard {
    id: string;
    restaurant_name: string;
    restaurant_id: string;
    image_key: string | null;
    dish_name: string;
    cuisine: string;
    menu_category: string;
    price: number;
  }

  // Fetch presigned URLs for restaurant images
  const fetchPresignedUrls = async (imageKeys: string[]) => {
    if (imageKeys.length === 0) return [];

    const csrf = getCookie("csrf_access_token");
    if (!csrf) throw new Error("CSRF token not found");

    const res = await fetch("http://localhost:5000/api/images/presigned/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      credentials: "include",
      body: JSON.stringify({ keys: imageKeys }),
    });

    if (!res.ok) throw new Error("Failed to fetch presigned URLs");
    const { urls } = await res.json();
    return urls as string[];
  };

  const fetchRestaurants = async () => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) throw new Error("CSRF token not found");

    const res = await fetch("http://localhost:5000/api/restaurant/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch restaurants");
    return res.json();
  };
  const fetchRestaurantMenus = async (restaurantId: string) => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) throw new Error("CSRF token not found");

    const res = await fetch(
      `http://localhost:5000/api/restaurant-menus/get/${restaurantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch menus");
    const { menus } = await res.json();
    return menus as MenuCard[];
  };

  useEffect(() => {
    const loadRestaurantsAndMenus = async () => {
      try {
        const restaurantResp = await fetchRestaurants();
        const restaurants: RestaurantCard[] = restaurantResp.restaurants;

        const menuRespArr = await Promise.all(
          restaurants.map((r) => fetchRestaurantMenus(r.id))
        );
        const allMenus: MenuCard[] = menuRespArr.flat();

        const imageKeys = allMenus
          .filter((m) => m.image_key)
          .map((m) => m.image_key as string);

        const presignedUrls = await fetchPresignedUrls(imageKeys);

        let urlIdx = 0;
        const menusWithUrls = allMenus.map((menu) => {
          if (menu.image_key) {
            return { ...menu, image_key: presignedUrls[urlIdx++] };
          }
          return menu;
        });

        const foodCards: FoodCard[] = menusWithUrls.map((menu) => ({
          id: menu.id,
          url: menu.image_key || "",
          restaurantName: menu.restaurant_name,
          dishName: menu.dish_name,
          cuisine: menu.cuisine,
          menuCategory: menu.menu_category,
          price: menu.price,
          restaurant_id: menu.restaurant_id,
        }));

        console.log("menuwithurls", menusWithUrls);
        setMenuData(foodCards);
        setCards(foodCards);
      } catch (err) {
        console.error(err);
      }
    };

    loadRestaurantsAndMenus();
  }, []);

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
