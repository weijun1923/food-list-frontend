"use client";
import { useEffect, useState } from "react";
import Carousel from "@/components/carousel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Slide } from "@/app/types";
import { div, i } from "framer-motion/client";
export default function CreateRestaurantPage() {
  // add the useSate to store the restaurant data

  const [restaurantName, setRestaurantName] = useState("");
  const [dishName, setDishName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [previewUploadImage, setPreviewUploadImage] = useState<Slide[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const newPreivewUploadImage = files.map((file) => {
      return { src: URL.createObjectURL(file) };
    });
    setPreviewUploadImage((prev) => [...prev, ...newPreivewUploadImage]);
  };

  useEffect(() => {
    return () => {
      previewUploadImage?.forEach((image) => {
        URL.revokeObjectURL(image.src);
      });
    };
  }, [previewUploadImage]);

  {
    /*     id: "1",
    url: "",
    restaurantName: "八方雲集",
    dishName: "牛肉麵",
    cuisine: "中式料理",
    menuCategory: "麵食",
    rating: 4.4,
    price: 150, */
  }
  interface RestaurantInputConfig {
    labelName: string;
    htmlFor: string;
    value: string | number;
    placeholder: string;
    type: string;
    required: boolean;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  const createRestaurant: RestaurantInputConfig[] = [
    {
      labelName: "餐廳名稱",
      htmlFor: "restaurantName",
      value: restaurantName,
      placeholder: "請輸入餐廳名稱",
      type: "text",
      required: true,
      id: "restaurantName",
      onChange: (e) => setRestaurantName(e.target.value),
    },
    {
      labelName: "菜名",
      htmlFor: "dishName",
      value: dishName,
      placeholder: "請輸入菜名 eg: 牛肉麵",
      type: "text",
      required: true,
      id: "dishName",
      onChange: (e) => setDishName(e.target.value),
    },
    {
      labelName: "菜系",
      htmlFor: "cuisine",
      value: cuisine,
      placeholder: "請輸入菜系 eg: 中式, 西式, 日式",
      type: "text",
      required: true,
      id: "cuisine",
      onChange: (e) => setCuisine(e.target.value),
    },
    {
      labelName: "菜單類別",
      htmlFor: "menuCategory",
      value: menuCategory,
      placeholder: "請輸入菜單類別 eg: 麵食, 飯類, 餃類",
      type: "text",
      required: true,
      id: "menuCategory",
      onChange: (e) => setMenuCategory(e.target.value),
    },
    {
      labelName: "價格",
      htmlFor: "price",
      value: price,
      placeholder: "請輸入價格 eg: 150",
      type: "number",
      required: true,
      id: "price",
      onChange: (e) => setPrice(Number(e.target.value)),
    },
  ];
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">建立餐廳</h1>
        {/* image upload */}
        {/* if user upload image show the preview image component */}
        {previewUploadImage && previewUploadImage.length > 0 && (
          <Carousel images={previewUploadImage} />
        )}
        {/* if user upload image the upload imaeg component it's change to the button  */}
        {previewUploadImage && previewUploadImage.length > 0 && (
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            ></label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm p-2 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={handleImageUpload}
            />
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              PNG, JPG
            </p>
          </div>
        )}

        {/* if user not upload image show the upload image component */}
        {!previewUploadImage ||
          (previewUploadImage.length === 0 && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">點擊上傳圖片</span>
                    或是將圖片拖放到這裡
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          ))}
        {/* the user can add restaurant name , dishname , chisine , menucategort , price */}

        <form>
          <div className="flex flex-col gap-6">
            {createRestaurant.map((data) => (
              <div key={data.id} className="grid gap-2">
                <Label htmlFor={data.htmlFor}>{data.labelName}</Label>
                <Input
                  id={data.id}
                  type={data.type}
                  placeholder={data.placeholder}
                  value={data.value}
                  onChange={data.onChange}
                  required={data.required}
                />
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
