// app/components/RestaurantForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiMutation } from "@/app/libs/api";
import { Restaurant } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  restaurant?: Restaurant; // 有傳入表示「編輯」，否則「新增」
}

export default function RestaurantForm({ restaurant }: Props) {
  const [name, setName] = useState(restaurant?.restaurant_name ?? "");
  const [imageKey, setImageKey] = useState(restaurant?.image_key ?? "");
  const [pending, start] = useTransition();
  const router = useRouter();

  async function handleSubmit() {
    start(async () => {
      try {
        if (restaurant) {
          await apiMutation(`/restaurant/${restaurant.id}`, "PUT", {
            restaurant_name: name,
            image_key: imageKey || null,
          });
        } else {
          await apiMutation("/restaurant/add", "POST", {
            restaurant_name: name,
            image_key: imageKey || null,
          });
        }
        router.push("/admin/restaurants");
      } catch (err) {
        console.error(err);
        alert("儲存失敗");
      }
    });
  }

  return (
    <div className="space-y-4">
      <Input
        value={name}
        placeholder="餐廳名稱"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        value={imageKey ?? ""}
        placeholder="圖片 key（可留空）"
        onChange={(e) => setImageKey(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={pending || !name.trim()}>
        {restaurant ? "更新餐廳" : "新增餐廳"}
      </Button>
    </div>
  );
}
