"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const testimonials = [
    {
        quote: "My order arrived super quickly. The product is even better than I hoped it would be. Very happy customer over here!",
        name: "Sarah Peters",
        location: "New Orleans",
        image: "https://source.unsplash.com/100x100/?woman",
    },
    {
        quote: "I had to return a purchase that didn’t fit. The whole process was so simple that I ended up ordering two new items!",
        name: "Kelly McPherson",
        location: "Chicago",
        image: "https://source.unsplash.com/100x100/?man",
    },
    {
        quote: "Now that I’m on holiday for the summer, I’ll probably order a few more shirts. It’s just so convenient, and I know the quality will always be there.",
        name: "Chris Paul",
        location: "Phoenix",
        image: "https://source.unsplash.com/100x100/?person",
    },
];

const Testimonials: React.FC = () => {
    return (
        <div className="bg-gray-50 py-16 px-6 lg:px-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                What Our Customers Are Saying
            </h2>
            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={24}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="max-w-7xl mx-auto"
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">“{testimonial.quote}”</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Testimonials;
