export default function PromotionSection() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <div className="sm:max-w-lg">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Summer styles are finally here
                        </h1>
                        <p className="mt-4 text-xl text-gray-600">
                            Discover our new summer collection designed to keep you cool and stylish all season long.
                        </p>
                        <div className="mt-10">
                            <a
                                href="#"
                                className="inline-block rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-indigo-700 transition-colors duration-300 hover:shadow-xl"
                            >
                                Shop Collection
                            </a>
                        </div>
                    </div>
                    
                    {/* Image grid with hover effects */}
                    <div className="mt-20 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 lg:gap-8">
                            {[
                                "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg",
                                "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg",
                                "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg",
                                "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg",
                                "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg",
                                "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg"
                            ].map((src, index) => (
                                <div 
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                                >
                                    <img
                                        alt={`Summer collection item ${index + 1}`}
                                        src={src}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-white font-medium">View Product</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>
    )
}