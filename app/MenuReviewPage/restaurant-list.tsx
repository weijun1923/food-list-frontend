

"use client"

import { useState, useEffect } from "react"
import RestaurantCard from "./RestaurantCard"
import Pagination from "./Pagination"

import { Restaurant, fetchRestaurants } from "../libs/restaurants"

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
      // 呼叫fetchRestaurants
      const { restaurants: data, total } = await fetchRestaurants(
        page,
        itemsPerPage
      )
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

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <RestaurantCard
              key={i}
              restaurant={{
                id: "",
                name: "",
                image: "",
                rating: 0,
              }}
              isFavorite={false}
              onToggleFavorite={() => {}}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">精選推薦</h1>
        <p className="text-gray-600">發現您附近的美味餐廳</p>
      </div>

      <div className="space-y-3 mb-8">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isFavorite={favorites.has(restaurant.id)}
            onToggleFavorite={toggleFavorite}
            onClick={() => {}}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
      <div className="text-center text-sm text-gray-500 mt-4">
        第 {currentPage} 頁，共 {totalPages} 頁
      </div>
    </div>
  )
}
