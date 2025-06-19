"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/libs/cookie";
import Link from "next/link";

export default function RestaurantDashboardPage() {
  // 1. create a new restaurant route
  // 2. create a new menu route
  // first fetch the restaurant data
  // if user click the restaurant , it's route to the create menu page
  // if user click teh create restaurant button, it's route to the create restaurant page
  interface RestaurantCard {
    id: string;
    restaurant_name: string;
    image_key: string;
    created_at: string;
    updated_at: string;
  }
  const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
  const fetchRestaurants = async () => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) {
      console.error("CSRF token not found");
      return;
    }
    const response = await fetch(
      `${process.env.API_POINT}/api/restaurant/all`,
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

  // 刪除餐廳
  const handleDelete = async (id: string) => {
    const csrf = getCookie("csrf_access_token");
    if (!csrf) return;

    try {
      const res = await fetch(`${process.env.API_POINT}/api/restaurant/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
        },
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        console.error("刪除失敗：", error);
        return;
      }

      // 刪除成功後更新前端 state，移除該項
      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant.id !== id)
      );
    } catch (error) {
      console.error("刪除過程出錯：", error);
    }
  };

  useEffect(() => {
    const loadRestaurants = async () => {
      const data = await fetchRestaurants();
      if (data && data.restaurants) {
        setRestaurants(data.restaurants);
      }
    };
    loadRestaurants();
  }, []);
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">餐廳管理</h1>
        </div>
        <div className=" flex justify-between items-center mb-7">
          <p className="text-center text-gray-600 mb-2">
            這是餐廳管理的頁面，請在此處添加您的餐廳訊息或是餐廳菜單。
          </p>
          <Link href={"/create/restaurant"}>
            <Button>新增餐廳</Button>
          </Link>
        </div>
        <Table className=" bg-neutral-50 shadow-md rounded-lg p-3">
          <TableHeader>
            <TableRow>
              <TableHead>餐廳名稱</TableHead>
              <TableHead>新增時間</TableHead>
              <TableHead>更新時間</TableHead>
              <TableHead className=" text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>{restaurant.restaurant_name}</TableCell>
                <TableCell>
                  {new Date(restaurant.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(restaurant.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className=" text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      className=" hover:bg-red-200"
                      variant="destructive"
                      onClick={() => handleDelete(restaurant.id)}
                    >
                      刪除餐廳
                    </Button>
                    <Link
                      href={`/create/menu/${restaurant.id}/${restaurant.restaurant_name}`}
                    >
                      <Button className=" bg-blue-500 hover:bg-blue-300">
                        新增菜單
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
