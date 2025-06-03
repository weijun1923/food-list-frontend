
"use client"

import { FC } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart } from "lucide-react"
import Image from "next/image"

interface Restaurant {
  id: string
  name: string
  image: string
  // 於顯示星等分數
  rating: number
}

interface RestaurantCardProps {
  restaurant: Restaurant
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick?: () => void
}

const RestaurantCard: FC<RestaurantCardProps> = ({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative">
            <Image
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate pr-2">
                {restaurant.name}
              </h3>

              {/* 收藏按鈕 */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(restaurant.id)
                }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RestaurantCard
