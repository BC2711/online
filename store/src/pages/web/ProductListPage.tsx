import { Breadcrumb } from "@material-tailwind/react";
import { useSearchParams } from "react-router-dom";
import { StarIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import useProducts from "../../service/api/products/useProducts";
import { getPublicProducts } from "../../service/api/publicApi/api";
import { Product, PaginatedProductResponse } from "../../types/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get('type') || '';
    const gender = searchParams.get('gender') || '';
    const category = searchParams.get('category') || '';
    const page = searchParams.get('page') || '1';

    const { 
        data: response, 
        loading, 
        errors, 
        refetch 
    } = useProducts<PaginatedProductResponse>(() => 
        getPublicProducts({ type, gender, category, page })
    );

    const products = response?.data || [];
    const pagination = response?.meta || null;
    const links = response?.links || null;

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        ...(gender ? [{ label: gender, href: `/?gender=${gender}` }] : []),
        ...(type ? [{ label: type, href: `/?gender=${gender}&type=${type}` }] : []),
        ...(category ? [{ label: category, href: `/?gender=${gender}&type=${type}&category=${category}` }] : [])
    ].filter(Boolean);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
    };

    if (errors) {
        return (
            <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading products</h2>
                    <p className="text-gray-600 mb-6">{errors.message}</p>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                {/* Breadcrumb Navigation */}
                <Breadcrumb className="mb-6">
                    {breadcrumbItems.map((item, index) => (
                        <div key={index} className="flex items-center">
                            {index > 0 && <Breadcrumb.Separator className="mx-2" />}
                            <Breadcrumb.Link 
                                href={item.href} 
                                className={`text-sm sm:text-base ${index === breadcrumbItems.length - 1 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
                            >
                                {item.label}
                            </Breadcrumb.Link>
                        </div>
                    ))}
                </Breadcrumb>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {[gender, type, category].filter(Boolean).join(' ')}
                    </h1>
                    {loading ? (
                        <Skeleton width={200} height={20} className="mt-2" />
                    ) : (
                        <p className="mt-2 text-sm text-gray-600">
                            Showing {pagination?.from}-{pagination?.to} of {pagination?.total} products
                        </p>
                    )}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="group relative">
                                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                                    <Skeleton height="100%" />
                                </div>
                                <div className="mt-4">
                                    <Skeleton width="80%" height={20} />
                                    <Skeleton width="60%" height={16} className="mt-1" />
                                    <Skeleton width="40%" height={16} className="mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {products.map((product: Product) => (
                                <div
                                    key={product.id}
                                    className="group relative"
                                >
                                    <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75 transition-opacity">
                                        <img
                                            src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                        />
                                        {product.discount_price && product.discount_price < product.price && (
                                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                <a href={`/products/${product.id}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </a>
                                            </h3>
                                            <div className="mt-1 flex items-center">
                                                {[0, 1, 2, 3, 4].map((rating) => (
                                                    <StarIcon
                                                        key={rating}
                                                        className={`h-4 w-4 ${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                                <span className="ml-1 text-xs text-gray-500">
                                                    ({product.review_count || 0})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {product.discount_price && product.discount_price < product.price ? (
                                                <>
                                                    <p className="text-sm font-medium text-gray-900">ZMW {product.discount_price}</p>
                                                    <p className="text-xs text-gray-500 line-through">ZMW {product.price}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">ZMW {product.price}</p>
                                            )}
                                        </div>
                                    </div>
                                    {product.quantity_in_stock <= 0 && (
                                        <p className="mt-1 text-xs text-red-600">Out of stock</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && (
                            <nav className="mt-12 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                                <div className="-mt-px flex w-0 flex-1">
                                    {links?.prev ? (
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            disabled={!links.prev}
                                        >
                                            <ArrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Previous
                                        </button>
                                    ) : null}
                                </div>
                                <div className="hidden md:-mt-px md:flex">
                                    {pagination.links?.map((link, index) => {
                                        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') return null;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && handlePageChange(parseInt(link.label))}
                                                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                                                    link.active
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            >
                                                {link.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="-mt-px flex w-0 flex-1 justify-end">
                                    {links?.next ? (
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            disabled={!links.next}
                                        >
                                            Next
                                            <ArrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </button>
                                    ) : null}
                                </div>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}