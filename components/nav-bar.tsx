"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";

const links = [
  { href: "/", label: "探索餐廳" },
  { href: "/food-tinder", label: "選擇餐廳" },
  { href: "/restaurant-dashboard", label: "後台管理" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl flex items-center justify-between p-4">
        <span className="text-4xl font-semibold text-black">美食清單</span>
        <ul className="hidden md:flex gap-6 font-medium">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`py-2 px-3 rounded-sm ${
                  pathname.startsWith(href)
                    ? "text-blue-700"
                    : "text-gray-900 dark:text-white hover:text-blue-700"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 使用者小圖示 / 下拉 */}
        <div className="relative">
          <button
            className="border p-2 bg-gray-50 rounded-full focus:ring"
            id="user-menu"
          >
            <Users className="w-8 h-8" />
          </button>
          {/* TODO：自行實作下拉內容 */}
        </div>
      </div>
    </nav>
  );
}
