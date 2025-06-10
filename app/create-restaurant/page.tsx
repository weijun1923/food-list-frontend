"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Carousel from "@/components/carousel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import type { Slide } from "@/app/types";
import { cn } from "@/lib/utils";

export default function CreateRestaurantPage() {
  // add the useSate to store the restaurant data

  const [restaurantName, setRestaurantName] = useState("");
  const [dishName, setDishName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [previewUploadImage, setPreviewUploadImage] = useState<Slide[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  interface R2PresignedPost {
    url: string;
    key: string;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    // [x] check the file type is image
    const newFiles = Array.from(fileList);
    const validImageTypes = ["image/jpeg", "image/png"];
    const validFiles = newFiles.filter((file) =>
      validImageTypes.includes(file.type)
    );
    if (validFiles.length === 0) {
      setError("請上傳有效的圖片格式 (JPEG 或 PNG)");
      return;
    }
    // [x] check the file size is less than 5MB
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = newFiles.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setError(
        `以下檔案超過 5MB 限制，請選擇較小的檔案：\n${oversizedFiles
          .map((file) => file.name)
          .join(", ")}`
      );
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);

    setFileName((prev) => [...prev, ...newFiles.map((file) => file.name)]);

    setPreviewUploadImage((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        src: URL.createObjectURL(file),
      })),
    ]);
  };

  // [x] first send the request to flask get r2 presigned url
  const getPresignedUrl = async () => {
    setLoading(true);
    if (previewUploadImage.length === 0) return;
    interface FilesInterface {
      files: { name: string }[];
    }
    const files: FilesInterface = {
      files: [],
    };

    // [x] the image name use restaurantName/ + uuid + file name
    for (let i = 0; i < fileName.length; i++) {
      files.files.push({
        name: restaurantName + "/" + uuidv4() + "-" + fileName[i],
      });
    }
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/images/presigned/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(files),
        }
      );

      if (!response.ok) {
        console.log(response);
      }

      const data = await response.json();
      return data as R2PresignedPost[];
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };
  // [x] get the presigned url and upload the image to r2
  const uploadFilesToR2 = async (
    presigned: R2PresignedPost[],
    files: File[]
  ) => {
    if (presigned.length === 0 || files.length === 0) return;
    const uploadPromises = presigned.map((item, index) => {
      const formData = new FormData();
      formData.append("file", files[index]);
      formData.append("key", item.key);
      formData.append("url", item.url);

      return fetch(item.url, {
        method: "PUT",
        body: formData,
      });
    });
    try {
      const results = await Promise.all(uploadPromises);
      results.forEach((result, index) => {
        if (!result.ok) {
          console.error(`Failed to upload file ${files[index].name}`);
        } else {
          console.log(`File ${files[index].name} uploaded successfully`);
        }
      });
    } catch (error) {
      console.error("Error uploading files to R2:", error);
    } finally {
      setPreviewUploadImage([]);
      setFiles([]);
      setFileName([]);
    }
  };
  // restaurant_name = data.get("restaurant_name")
  // image_key = data.get("image_key")
  // dish_name = data.get("dish_name")
  // cuisine = data.get("cuisine")
  // menu_category = data.get("menu_category")
  // price = data.get("price")

  const storeRestaurantData = async (presigned: R2PresignedPost[]) => {
    let image_keys: string[] = [];

    if (presigned.length !== 0) {
      image_keys = presigned.map((item) => item.key);
    }
    const data = {
      restaurant_name: restaurantName,
      image_keys: image_keys,
      dish_name: dishName,
      cuisine: cuisine,
      menu_category: menuCategory,
      price: price,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/restaurant/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(response);
      }
    } catch (error) {
      console.log("Error storing restaurant data:", error);
    }
  };

  const handleSubmit = async () => {
    if (loading || previewUploadImage.length === 0) return;
    setLoading(true);
    try {
      const presigned = await getPresignedUrl();
      if (presigned) {
        await uploadFilesToR2(presigned, files);
      }
      await storeRestaurantData(presigned || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // [] then save the restaurant data and image key to the database

  useEffect(() => {
    return () => {
      previewUploadImage?.forEach((image) => {
        URL.revokeObjectURL(image.src);
      });
    };
  }, [previewUploadImage]);

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
        {/* 1. let user check the restaurant item it's current
            2. if user check first get the presigned url
              2-1. cleck the send button then set loading to true
              2-2. if the presigned url is success then set loading to false and close the dialog
            3. if user cloud be to change the restaurant item then close the dialog
        */}
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!loading) setIsOpen(open);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>請確認餐廳資訊是否正確</DialogTitle>
              <DialogDescription>
                如果確認後請點擊送出按鈕，否則請點擊關閉按鈕重新修改。
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="grid gap-4">
                <div>
                  <Label>餐廳名稱</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {restaurantName}
                  </p>
                </div>
                <div>
                  <Label>菜名</Label>
                  <p className="text-gray-700 dark:text-gray-300">{dishName}</p>
                </div>
                <div>
                  <Label>菜系</Label>
                  <p className="text-gray-700 dark:text-gray-300">{cuisine}</p>
                </div>
                <div>
                  <Label>菜單類別</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {menuCategory}
                  </p>
                </div>
                <div>
                  <Label>價格</Label>
                  <p className="text-gray-700 dark:text-gray-300">{price} 元</p>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={loading}>
                  關閉
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={cn({ loading: "spin" })}
              >
                {loading ? <Loader /> : "送出"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              accept="image/png, image/jpeg"
              multiple
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
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          ))}

        {/* if the image upload file type it's not current show the error message */}
        {error && (
          <div
            className=" mt-2 flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <svg
              className="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">錯誤訊息</span>
              {error}
            </div>
          </div>
        )}
        {/* the user can add restaurant name , dishname , chisine , menucategort , price */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
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
            <Button type={"submit"} className=" w-full">
              新增餐廳
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
