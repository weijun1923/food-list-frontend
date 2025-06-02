export interface CardProps {
  id: number;
  url: string;
  restaurantname: string;
  // 把 setCards 拿掉，改用 removeCard
  removeCard: (id: number) => void;
  cards: { id: number; url: string }[];
}
