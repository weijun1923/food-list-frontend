"use client";

import { useState } from "react";
import Image from "next/image";
import type { CarouselProps } from "@/app/types";

export default function Carousel({
  images,
  heightClasses = "h-56 md:h-96",
  widthClasses = "w-full",
}: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((idx) => (idx - 1 + images.length) % images.length);
  const next = () => setCurrent((idx) => (idx + 1) % images.length);

  return (
    <div
      className="relative border-gray-300 border-dashed border-2 rounded-lg"
      style={{ width: "100%" }}
    >
      {/* Slides */}
      <div
        className={`relative overflow-hidden rounded-lg ${heightClasses} ${widthClasses}`}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt || `Slide ${idx + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex space-x-2 -translate-x-1/2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? "bg-blue-700" : "bg-blue-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-50 hover:bg-blue-100 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 text-blue-300" viewBox="0 0 6 10" fill="none">
          <path
            d="M5 1 1 5l4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-50 hover:bg-blue-100 focus:outline-none"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 text-blue-300" viewBox="0 0 6 10" fill="none">
          <path
            d="m1 9 4-4-4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
