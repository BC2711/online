import { useState } from 'react';
import {
    // FilterIcon,
    // SearchIcon,
    // SortAscendingIcon,
    // ChevronDownIcon,
    // XIcon,
    StarIcon
} from '@heroicons/react/24/solid';
import {
    ShoppingBagIcon,
    HeartIcon,
    // ArrowsExpandIcon,
    XMarkIcon,
    ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { FilterIcon, SearchIcon, SortAscIcon } from 'lucide-react';

const CategoriesPage = () => {
    // Sample categories data
    const categories = [
        { id: 1, name: 'Electronics', count: 156, image: 'https://via.placeholder.com/300x200?text=Electronics' },
        { id: 2, name: 'Clothing', count: 289, image: 'https://via.placeholder.com/300x200?text=Clothing' },
        { id: 3, name: 'Home & Kitchen', count: 178, image: 'https://via.placeholder.com/300x200?text=Home+Kitchen' },
        { id: 4, name: 'Beauty', count: 92, image: 'https://via.placeholder.com/300x200?text=Beauty' },
        { id: 5, name: 'Sports', count: 64, image: 'https://via.placeholder.com/300x200?text=Sports' },
        { id: 6, name: 'Books', count: 121, image: 'https://via.placeholder.com/300x200?text=Books' },
        { id: 7, name: 'Toys', count: 87, image: 'https://via.placeholder.com/300x200?text=Toys' },
        { id: 8, name: 'Automotive', count: 53, image: 'https://via.placeholder.com/300x200?text=Automotive' },
    ];

    // Sample products data
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 99.99, rating: 4.5, reviews: 128, category: 'Electronics', image: 'https://via.placeholder.com/300x300?text=Headphones' },
        { id: 2, name: 'Smart Watch', price: 199.99, rating: 4.2, reviews: 86, category: 'Electronics', image: 'https://via.placeholder.com/300x300?text=Smart+Watch' },
        { id: 3, name: 'Running Shoes', price: 79.99, rating: 4.7, reviews: 215, category: 'Sports', image: 'https://via.placeholder.com/300x300?text=Running+Shoes' },
        { id: 4, name: 'Coffee Maker', price: 129.99, rating: 4.3, reviews: 94, category: 'Home & Kitchen', image: 'https://via.placeholder.com/300x300?text=Coffee+Maker' },
        { id: 5, name: 'Bluetooth Speaker', price: 59.99, rating: 4.1, reviews: 72, category: 'Electronics', image: 'https://via.placeholder.com/300x300?text=Speaker' },
        { id: 6, name: 'Yoga Mat', price: 29.99, rating: 4.4, reviews: 153, category: 'Sports', image: 'https://via.placeholder.com/300x300?text=Yoga+Mat' },
        { id: 7, name: 'Cookware Set', price: 149.99, rating: 4.6, reviews: 68, category: 'Home & Kitchen', image: 'https://via.placeholder.com/300x300?text=Cookware' },
        { id: 8, name: 'Novel - Best Seller', price: 14.99, rating: 4.8, reviews: 231, category: 'Books', image: 'https://via.placeholder.com/300x300?text=Novel' },
    ];

    // State for filters and sorting
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [sortOption, setSortOption] = useState('featured');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filter products based on selections
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            default:
                return b.rating * b.reviews - a.rating * a.reviews; // Featured sort
        }
    });

    return (
        <div className="bg-white">
            {/* Hero section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight">Shop by Category</h1>
                    <p className="mt-4 max-w-2xl text-xl">
                        Browse through our wide selection of products
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile filter dialog */}
                <div className={`fixed inset-0 z-40 lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-xs h-full ml-auto shadow-xl overflow-y-auto">
                        <div className="flex justify-between items-center px-4 py-3 border-b">
                            <h2 className="text-lg font-medium">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-6">
                                <h3 className="font-medium mb-2">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center">
                                            <input
                                                id={`mobile-category-${category.id}`}
                                                name="category"
                                                type="radio"
                                                checked={selectedCategory === category.name}
                                                onChange={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                                                className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor={`mobile-category-${category.id}`} className="ml-3 text-sm text-gray-700">
                                                {category.name} ({category.count})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Price range</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FilterIcon className="h-5 w-5 mr-2" />
                                Filters
                            </button>
                        </div>

                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <SortAscIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filters sidebar */}
                    <div className="hidden lg:block">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center">
                                            <input
                                                id={`category-${category.id}`}
                                                name="category"
                                                type="radio"
                                                checked={selectedCategory === category.name}
                                                onChange={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                                                className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-700">
                                                {category.name} ({category.count})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Price range</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
                                                Min
                                            </label>
                                            <input
                                                type="number"
                                                id="min-price"
                                                min="0"
                                                max="500"
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
                                                Max
                                            </label>
                                            <input
                                                type="number"
                                                id="max-price"
                                                min="0"
                                                max="500"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedCategory && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setPriceRange([0, 500]);
                                    }}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="lg:col-span-3">
                        {sortedProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedProducts.map((product) => (
                                    <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity duration-200"
                                            />
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                                                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                                                </button>
                                                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                                                    <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                <a href="#" className="hover:text-indigo-600">
                                                    {product.name}
                                                </a>
                                            </h3>
                                            <div className="mt-1 flex items-center">
                                                <div className="flex">
                                                    {[0, 1, 2, 3, 4].map((rating) => (
                                                        <StarIcon
                                                            key={rating}
                                                            className={`h-4 w-4 ${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                                                <button className="p-1 rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                                                    <ShoppingBagIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;