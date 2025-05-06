"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { IconButton } from "@material-tailwind/react";
import { NavArrowRight, NavArrowLeft } from "iconoir-react";

// Sample Product Data
const products = [
    { id: 1, name: "Product 1", price: "$49.99", image: "https://source.unsplash.com/400x400/?fashion" },
    { id: 2, name: "Product 2", price: "$59.99", image: "https://source.unsplash.com/400x400/?clothing" },
    { id: 3, name: "Product 3", price: "$39.99", image: "https://source.unsplash.com/400x400/?shoes" },
    { id: 4, name: "Product 4", price: "$69.99", image: "https://source.unsplash.com/400x400/?accessories" },
    { id: 5, name: "Product 5", price: "$79.99", image: "https://source.unsplash.com/400x400/?jacket" },
    { id: 6, name: "Product 6", price: "$89.99", image: "https://source.unsplash.com/400x400/?watch" },
    { id: 7, name: "Product 7", price: "$29.99", image: "https://source.unsplash.com/400x400/?sunglasses" },
    { id: 8, name: "Product 8", price: "$99.99", image: "https://source.unsplash.com/400x400/?bag" },
];

export default function ProductCarousel() {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="bg-gray-50 py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 px-4 text-center">Featured Products</h2>

                <div className="relative">
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        modules={[Navigation]}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 16 },
                            480: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                            1280: { slidesPerView: 5, spaceBetween: 24 },
                        }}
                        className="px-4 py-2"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className="select-none pb-6">
                                <div className="bg-white p-4 shadow-md rounded-lg h-full flex flex-col hover:shadow-lg transition-shadow">
                                    <div className="relative overflow-hidden rounded-md">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-lg mt-4">{product.name}</h3>
                                    <p className="text-gray-600 mt-1">{product.price}</p>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                                            Add to Cart
                                        </button>
                                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 w-full left-0 z-10 px-2">
                        <IconButton
                            isCircular
                            size="lg"
                            variant="gradient"
                            color="secondary"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="bg-white shadow-md hover:shadow-lg"
                            aria-label="Previous Slide"
                        >
                            <NavArrowLeft className="h-5 w-5" />
                        </IconButton>

                        <IconButton
                            isCircular
                            size="lg"
                            variant="gradient"
                            color="secondary"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="bg-white shadow-md hover:shadow-lg"
                            aria-label="Next Slide"
                        >
                            <NavArrowRight className="h-5 w-5" />
                        </IconButton>
                    </div>

                    {/* Mobile Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-6 md:hidden">
                        <IconButton
                            isCircular
                            size="md"
                            variant="gradient"
                            color="secondary"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="bg-white shadow-md"
                            aria-label="Previous Slide"
                        >
                            <NavArrowLeft className="h-4 w-4" />
                        </IconButton>

                        <IconButton
                            isCircular
                            size="md"
                            variant="gradient"
                            color="secondary"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="bg-white shadow-md"
                            aria-label="Next Slide"
                        >
                            <NavArrowRight className="h-4 w-4" />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
