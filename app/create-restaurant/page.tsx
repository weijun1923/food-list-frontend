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
import { uploadFilesToR2 } from "./actions";

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

  useEffect(() => {
    console.log("files.length:", files.length);
    console.log("previewUploadImage.length:", previewUploadImage.length);
  }, [files, previewUploadImage]);

  interface R2PresignedPost {
    url: string;
    key: string;
    fields: R2PresignedFileds;
  }
  interface R2PresignedFileds {
    /** MIME type of the file to upload */
    "Content-Type": string;
    /** Object key under which to store the file */
    key: string;
    /** Base64‐encoded policy document */
    policy: string;
    /** AWS signature algorithm (always “AWS4-HMAC-SHA256”) */
    "x-amz-algorithm": string;
    /** Credential scope for signing the request */
    "x-amz-credential": string;
    /** ISO8601 timestamp when the signature was created */
    "x-amz-date": string;
    /** Signature string to authorize the upload */
    "x-amz-signature": string;
    /** Allow any additional form fields the upload might include */
    [field: string]: string;
  }
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);

    setFiles((prev) => [...prev, ...newFiles]);

    setFileName((prev) => [...prev, ...newFiles.map((file) => file.name)]);

    setPreviewUploadImage((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        src: URL.createObjectURL(file),
      })),
    ]);
  };

  // first send the request to flask get r2 presigned url
  const getPresignedUrl = async () => {
    setLoading(true);
    if (previewUploadImage.length === 0) return;
    interface FilesInterface {
      files: { name: string }[];
    }
    const files: FilesInterface = {
      files: [],
    };

    // the image name use restaurantName/ + uuid + file name
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
  // get the presigned url and upload the image to r2

  const handleSubmit = async () => {
    if (loading || previewUploadImage.length === 0) return;
    setLoading(true);
    try {
      const presigned = await getPresignedUrl(); // <── 這裡拿到最新的陣列
      if (presigned) {
        await uploadFilesToR2(presigned, files); // 長度一致
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // then save the restaurant data and image key to the database

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
