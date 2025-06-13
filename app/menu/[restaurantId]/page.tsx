"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCookie } from "@/app/libs/cookie";
import { useEffect } from "react";
import Image from "next/image";
import placeholderSvg from "@/public/placeholder.svg";
import { DollarSign, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RestaurantMenu() {
  const [menusData, setMenuData] = useState<MenuCard[]>([]);

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

  const { restaurantId } = useParams();

  // fetch the restaurant data from the server
  const fetchRestaurants = async () => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) {
      console.error("CSRF token not found");
      return;
    }
    const response = await fetch(
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

      if (!data || !data.menus) {
        console.error("No menu data found");
        return;
      }

      //  {restaurants: [{id, restaurant_name, image_key},{ ... }]}
      const menuImageKeys = data.menus.map((menu: MenuCard) => menu.image_key);
      const presignedUrls = await fetchPresignedUrls(menuImageKeys);
      // Map the presigned URLs back to the restaurant data
      let urlCounter = 0;

      const menusData = data.menus.map((menu: MenuCard) => {
        if (menu.image_key != null) {
          return {
            ...menu,
            image_key: presignedUrls[urlCounter++],
          };
        }
        return { ...menu };
      });

      if (menusData) {
        console.log("Restaurant data with images:", menusData);
        setMenuData(menusData);
      }
    };
    loadRestaurants();
  }, [restaurantId]);

  return (
    <div className="min-h-screen  ">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* 餐廳標題 */}
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-white">
          {menusData.length > 0 ? menusData[0].restaurant_name : "Restaurant"}
        </h1>
        {/* 餐廳資訊卡片 */}
        {menusData.length === 0 && (
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <ChefHat className="mx-auto h-16 w-16 text-gray-400" />
              <CardTitle>沒有找到菜單</CardTitle>
              <CardDescription>
                這家餐廳目前沒有菜單，請稍後再試。
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {menusData.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menusData.map((menu) => (
              <Card
                key={menu.id}
                className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={menu.image_key ?? placeholderSvg}
                      alt={menu.dish_name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={false}
                    />
                  </div>
                </CardContent>

                <CardHeader className="space-y-3">
                  <div>
                    <CardTitle className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-orange-600">
                      {menu.dish_name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {menu.cuisine} cuisine
                    </CardDescription>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {menu.menu_category}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm font-semibold text-orange-600">
                      <DollarSign className="h-4 w-4" aria-hidden="true" />
                      {menu.price}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
