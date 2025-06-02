"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart } from "lucide-react"
import Image from "next/image"

// Mock API data structure
interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
}

// Mock API function - replace with your actual API call
const fetchRestaurants = async (page: number, limit = 15): Promise<{ restaurants: Restaurant[]; total: number }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Burger King漢堡王 台中大平店",
      image: "/img/勤美.img",
      rating: 4.8,
    },
    {
      id: "2",
      name: "一哥雞排二店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.5
    },
    {
      id: "3",
      name: "田邊燒肉飯",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.8
    },
    {
      id: "4",
      name: "潮味決・港澳專門店大平中華夜",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.7
    },
    {
      id: "5",
      name: "皇平炸雞十甲店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
    },
    {
      id: "6",
      name: "林記飯館 豐山店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
    },
    {
      id: "7",
      name: "白烟麵線攤 北屯東大店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.2,
    },
    {
      id: "8",
      name: "不知道吃什麼",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
    },
    {
      id: "9",
      name: "麥當勞 台中文心店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.4,
    },
    {
      id: "10",
      name: "鼎泰豐 台中店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
    },
    {
      id: "11",
      name: "春水堂 創始店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
    },
    {
      id: "12",
      name: "老四川 巴蜀麻辣燙",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.3,
    },
    {
      id: "13",
      name: "築間幸福鍋物",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
    },
    {
      id: "14",
      name: "八方雲集 台中店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.5,
    },
    {
      id: "15",
      name: "星巴克 台中三民店",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.4,
    },
    // Add more mock data for pagination testing
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `${16 + i}`,
      name: `餐廳 ${16 + i}`,
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.0 + Math.random(),
    })),
  ]

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedRestaurants = mockRestaurants.slice(startIndex, endIndex)

  return {
    restaurants: paginatedRestaurants,
    total: mockRestaurants.length,
  }
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const itemsPerPage = 15

  useEffect(() => {
    loadRestaurants(currentPage)
  }, [currentPage])

  const loadRestaurants = async (page: number) => {
    setLoading(true)
    try {
      const { restaurants: data, total } = await fetchRestaurants(page, itemsPerPage)
      setRestaurants(data)
      setTotalPages(Math.ceil(total / itemsPerPage))
    } catch (error) {
      console.error("Failed to load restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(restaurantId)) {
        newFavorites.delete(restaurantId)
      } else {
        newFavorites.add(restaurantId)
      }
      return newFavorites
    })
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">精選推薦</h1>
        <p className="text-gray-600">發現您附近的美味餐廳</p>
      </div>

      {/* Restaurant List */}
      <div className="space-y-3 mb-8">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Restaurant Image */}
                <div className="relative">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Restaurant Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">{restaurant.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(restaurant.id)
                      }}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(restaurant.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Rating and Delivery Info */}
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
        ))}
      </div>

      {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            上一頁
        </Button>

        {generatePageNumbers().map((page, index) => (
            <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
            className="min-w-[40px]"
            >
            {page}
            </Button>
        ))}

        <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
        >
            下一頁
        </Button>
        </div>

      {/* Page Info */}
        <div className="text-center text-sm text-gray-500 mt-4">
        第 {currentPage} 頁，共 {totalPages} 頁
        </div>
    </div>
    )
}
