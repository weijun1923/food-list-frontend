
export interface Restaurant {
    id: string
    name: string
    image: string
    rating: number
  }

  export const fetchRestaurants = async (
    page: number,
    limit = 15
  ): Promise<{ restaurants: Restaurant[]; total: number }> => {
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
        rating: 4.5,
      },
      {
        id: "3",
        name: "田邊燒肉飯",
        image: "/placeholder.svg?height=80&width=80",
        rating: 4.8,
      },
      {
        id: "4",
        name: "潮味決・港澳專門店大平中華夜",
        image: "/placeholder.svg?height=80&width=80",
        rating: 4.7,
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
  