"use client";

import { Card, CardContent } from "@/components/ui/card";
import { initialCards } from "@/app/libs/data";
import placeholderSvg from "@/public/placeholder.svg";
import Image from "next/image";
import Link from "next/link";   

export default function RestaurantList() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">探索餐廳</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialCards.map((cardData) => (
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
                    src={cardData.url ? cardData.url : placeholderSvg}
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
