import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Restaurant {
  id: string;
  name: string;
  imageUrl?: string;
  shortDescription: string;
}

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "美味小館",
    imageUrl: "/placeholder.svg?height=200&width=300",
    shortDescription: "提供各種傳統台灣小吃，價格實惠，環境舒適。",
  },
  {
    id: "2",
    name: "海鮮世界",
    imageUrl: "/placeholder.svg?height=200&width=300",
    shortDescription: "新鮮海鮮直送，特色料理包括清蒸魚、椒鹽蝦等海鮮美食。",
  },
  {
    id: "3",
    name: "義大利麵屋",
    imageUrl: "/placeholder.svg?height=200&width=300",
    shortDescription: "正宗義大利麵和披薩，使用進口食材，道地風味。",
  },
  {
    id: "4",
    name: "素食天地",
    shortDescription: "健康素食料理，注重食材原味，提供多種創意素食選擇。",
  },
  {
    id: "5",
    name: "咖啡小站",
    imageUrl: "/placeholder.svg?height=200&width=300",
    shortDescription: "精選咖啡豆，手工烘焙，還有多種甜點可搭配。",
  },
  {
    id: "6",
    name: "燒烤之家",
    imageUrl: "/placeholder.svg?height=200&width=300",
    shortDescription: "特色燒烤，提供多種醬料選擇，適合朋友聚餐。",
  },
];

export default function RestaurantList() {
  return (
    <div className=" lg:p-6 sm:p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Card
          key={restaurant.id}
          className="h-full overflow-hidden hover:shadow-lg transition-shadow"
        >
          {restaurant.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={restaurant.imageUrl || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle>{restaurant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {restaurant.shortDescription}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
