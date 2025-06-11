"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { initialCards } from "@/app/libs/data";
import placeholderSvg from "@/public/placeholder.svg";
import Image from "next/image";
import Link from "next/link";
import { getCookie } from "@/app/libs/cookie";
export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
  interface RestaurantCard {
    id: string;
    cuisine: string;
    dish_name: string;
    image_keys: string[];
    menu_category: string;
    price: number;
    restaurant_name: string;
  }
  //   {
  //     "count": 3,
  //     "msg": "Restaurants retrieved successfully",
  //     "restaurants": [
  //         {
  //             "cuisine": "a",
  //             "dish_name": "a",
  //             "id": "c1e3938f-477c-48b4-8022-ab192f3afe33",
  //             "image_keys": [],
  //             "menu_category": "a",
  //             "price": 10,
  //             "restaurant_name": "a"
  //         },
  //         {
  //             "cuisine": "b",
  //             "dish_name": "b",
  //             "id": "18d737db-2f95-401d-80ff-4cde1f0bb3c1",
  //             "image_keys": [
  //                 "b/88527b4e-4329-4d3b-b4bb-57991d518511-螢幕擷取畫面 2024-08-05 170314.png"
  //             ],
  //             "menu_category": "b",
  //             "price": 10,
  //             "restaurant_name": "b"
  //         },
  //         {
  //             "cuisine": "c",
  //             "dish_name": "c",
  //             "id": "fba207bd-2f1b-48ed-a0b3-26e481c8d5e6",
  //             "image_keys": [
  //                 "c/dd0c8196-031f-439f-bdb0-b8b61ef1e36b-螢幕擷取畫面 2024-08-05 171712.png",
  //                 "c/7e7f649c-f804-4cb3-95e9-3459b83ebd6e-螢幕擷取畫面 2024-08-06 142654.png"
  //             ],
  //             "menu_category": "c",
  //             "price": 10,
  //             "restaurant_name": "c"
  //         }
  //     ]
  // }

  // fetch the restaurant data from the server
  const fetchRestaurants = async () => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) {
      console.error("CSRF token not found");
      return;
    }
    const response = await fetch("http://localhost:5000/api/restaurant/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Failed to fetch restaurants");
      return;
    }
    const data = await response.json();
    console.log("Fetched restaurants:", data);
    return data;
  };
  useEffect(() => {
    const loadRestaurants = async () => {
      const data = await fetchRestaurants();
      if (data) {
        setRestaurants(data.restaurants);
      }
    };
    loadRestaurants();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">探索餐廳</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((cardData) => (
            <Link
              key={cardData.id}
              href="/restaurant-menu"
              className="group block"
            >
              <Card
                key={cardData.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={
                        cardData.image_keys
                          ? cardData.image_keys
                          : placeholderSvg
                      }
                      alt={cardData.restaurantName}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {cardData.restaurantName}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
