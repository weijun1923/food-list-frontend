"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import placeholderSvg from "@/public/placeholder.svg";
import Image from "next/image";
import Link from "next/link";
import { getCookie } from "@/app/libs/cookie";
export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
  interface RestaurantCard {
    id: string;
    restaurant_name: string;
    image_key: string;
  }

  // [
  //   {
  //     id: "4c311d44-b19e-48b8-bcc0-138c20f2ae6d",
  //     image_key:
  //       "https://b7089f46117e04595ba6fc423814e5d5.r2.cloudflarestorage.com/food-list/a/2b8db054-535b-42c5-904c-2882ef787721-%E8%9E%A2%E5%B9%95%E6%93%B7%E5%8F%96%E7%95%AB%E9%9D%A2%202024-08-05%20171612.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0f67844378510cc03612ecd4b52933e9%2F20250612%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250612T063112Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=bee743d151d21f5fed87fa04d216606877f59f631823d1b11e9519f0435937be",
  //     restaurant_name: "a",
  //   },
  // ];
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

  // Fetch presigned URLs for restaurant images
  const fetchPresignedUrls = async (imageKeys: string[]) => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) {
      console.error("CSRF token not found");
      return;
    }
    const response = await fetch(
      "http://localhost:5000/api/images/presigned/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
        },
        credentials: "include",
        body: JSON.stringify({ keys: imageKeys }),
      }
    );
    if (!response.ok) {
      console.error("Failed to fetch presigned URLs");
      return;
    }
    const data = await response.json();
    console.log("Fetched presigned URLs:", data);
    return data.urls;
  };

  useEffect(() => {
    const loadRestaurants = async () => {
      const data = await fetchRestaurants();
      //  {restaurants: [{id, restaurant_name, image_key},{ ... }]}
      const restaurantsImageKeys = data.restaurants.map(
        (restaurant: any) => restaurant.image_key
      );
      const presignedUrls = await fetchPresignedUrls(restaurantsImageKeys);
      // Map the presigned URLs back to the restaurant data
      const restaurantData = data.restaurants.map(
        (restaurant: any, index: number) => ({
          ...restaurant,
          image_key: presignedUrls[index] || "",
        })
      );

      if (restaurantData) {
        console.log("Restaurant data with images:", restaurantData);
        setRestaurants(restaurantData);
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
              href={`/menu/${cardData.id}`}
              className="group block"
            >
              <Card
                key={cardData.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <CardContent className="p-0">
                  {/* 把高度或比例加在這裡 */}
                  <div className="relative w-full h-48">
                    {" "}
                    {/* or aspect-[3/2] */}
                    <Image
                      src={cardData.image_key ?? placeholderSvg}
                      alt={cardData.restaurant_name}
                      fill
                      sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {cardData.restaurant_name}
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
