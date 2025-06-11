"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"
import { initialCards } from "@/app/libs/data"


// 取全部商品

export default function RestaurantMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const restaurant = initialCards[0]

  const categories = ["全部", ...Array.from(new Set(restaurant.menuItems?.map((item) => item.category) ?? []))]

  // 目前選中的分類
  const filteredMenuItems =
    selectedCategory === "全部"
      ? restaurant.menuItems ?? []
      : restaurant.menuItems?.filter((item) => item.category === selectedCategory) ?? []

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 餐廳資訊卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{restaurant.restaurantName}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  {restaurant.cuisine}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{restaurant.rating}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 分類導航 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>菜單分類</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 菜單項目 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory === "全部" ? "所有菜品" : selectedCategory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredMenuItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-orange-600">NT$ {item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
