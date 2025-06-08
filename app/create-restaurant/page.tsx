"use client";
import { useEffect, useState } from "react";
import Carousel from "@/components/carousel";
import type { Slide } from "@/app/types";
export default function CreateRestaurantPage() {
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
        {/* if user not upload image show the upload image component */}

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

        <form className="space-y-4">
          <div className="grid gap-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              餐廳名稱
            </label>
            <input
              id="name"
              type="text"
              placeholder="餐廳名稱"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid gap-3">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              餐廳位置
            </label>
            <input
              id="location"
              type="text"
              placeholder="餐廳位置"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            建立餐廳
          </button>
        </form>
      </div>
    </div>
  );
}
