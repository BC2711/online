import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ShoppingBagIcon,
    XCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../../context/AuthContext';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product,
    Links,
    Meta,
} from '../../../../service/api/admin/product/product';
import { categoryDropDown } from '../../../../service/api/admin/category/category';
import Modal from 'react-modal';
import { FiSearch, FiX } from "react-icons/fi";
import debounce from 'lodash.debounce';
import Pagination from '../../../../components/Pagination';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableSkeleton from '../../../../components/TableSkeleton';

// Types
interface Category {
    id: number;
    name: string;
}

interface ImageFile {
    file: File;
    preview: string;
    id: number;
    image_url: string;
}

interface ProductFormState extends Omit<Product, "id" | "message" | "success" | "images"> {
    images?: ImageFile[];
    discount_price?: number;
}

// Constants
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const AllProducts: React.FC = () => {
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [links, setLinks] = useState<Links | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);
    const { authToken } = useAuth();
    const [deleteImagesIds, setDeleteImagesIds] = useState<number[]>([]);
    const [newProduct, setNewProduct] = useState<ProductFormState>({
        name: '',
        description: '',
        sku: '',
        price: 0,
        quantity_in_stock: 0,
        is_active: true,
        images: [],
        category_id: null,
        category_name: [],
        discount_price: undefined
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | boolean>("all");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Memoized filtered products
    const filteredProducts = products.filter((product) => {
        const matchesSearch = searchTerm === "" ||
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price?.toString().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.quantity_in_stock?.toString().includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || product.is_active === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Fetch products with debounced search
    const fetchProducts = useCallback(async (search: string = "") => {
        setLoading(true);
        try {
            const response = await getProducts(authToken as string, currentPage, search);
            if (response?.data) {
                setProducts(response.data);
                setLinks(response.links);
                setMeta(response.meta);
            } else {
                setError(response?.errors?.join(', ') || 'No products found');
                toast.error('No products found');
            }
        } catch (error) {
            toast.error('Failed to fetch products');
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [authToken, currentPage]);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoryDropDown(authToken as string);
            if (response.success) {
                setCategories(response.data);
            } else {
                setError(response.errors?.join(', '));
                toast.error('Failed to fetch categories');
            }
        } catch (error) {
            toast.error('Failed to fetch categories');
            console.error('Failed to fetch categories:', error);
        }
    }, [authToken]);

    // Debounced search handler
    const handleSearch = useMemo(
        () => debounce((value: string) => {
            setSearchTerm(value);
            fetchProducts(value);
        }, 500),
        [fetchProducts]
    );

    // Handle refresh
    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchProducts(searchTerm);
    }, [fetchProducts, searchTerm]);

    // Initialize data
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            handleSearch.cancel();
        };
    }, [handleSearch]);

    // Modal handlers
    const openModal = useCallback((product?: Product) => {
        if (product) {
            setIsEditing(true);
            setCurrentProductId(product.id);
            setNewProduct({
                ...product,
                images: product.images?.map(img => ({
                    file: new File([], img.image_url.split('/').pop() || ''),
                    preview: img.image_url,
                    id: img.id,
                    image_url: img.image_url,
                })) || []
            });
            setDeleteImagesIds([]);
        } else {
            setIsEditing(false);
            setCurrentProductId(null);
            setNewProduct({
                name: '',
                description: '',
                sku: '',
                price: 0,
                quantity_in_stock: 0,
                is_active: true,
                images: [], 
                category_id: null,
                category_name: [],
                discount_price: undefined
            });
            setDeleteImagesIds([]);
        }
        setError(null);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        if (!isSubmitting) {
            setIsModalOpen(false);
        }
    }, [isSubmitting]);

    // Form submission
    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (isEditing && currentProductId) {
                // Prepare the data for API
                const apiProductData = {
                    ...newProduct,
                    images: newProduct.images?.map(img => ({
                        file: img.file,
                        preview: img.preview,
                        id: img.id as number, 
                        image_url: img.image_url as string 
                    })),
                    delete_images: deleteImagesIds
                };

                const resp = await updateProduct(authToken as string, currentProductId, apiProductData, deleteImagesIds);

                if (resp?.success) {
                    toast.success('Product updated successfully');
                    setProducts(prev => prev.map(p => (p.id === currentProductId ? resp.data : p)));
                    closeModal();
                } else {
                    setError(resp?.errors?.join(', ') || 'Failed to update product');
                }
            } else {
                // Prepare data for creation
                const productToCreate = {
                    ...newProduct,
                    images: newProduct.images?.map(img => ({
                        file: img.file,
                        preview: img.preview,
                        id: img.id,
                        image_url: img.image_url || '', // Ensure image_url exists
                    })) || []
                };

                const resp = await createProduct(authToken as string, productToCreate);

                if (resp?.success) {
                    toast.success('Product created successfully');
                    fetchProducts(searchTerm);
                    closeModal();
                } else {
                    setError(resp?.errors?.join(', ') || 'Failed to create product');
                }
            }
        } catch (error) {
            toast.error('Failed to save product');
            console.error('Failed to save product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Image handling
    // When creating new product images, provide a default empty string for image_url
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const validFiles = files.filter(file =>
            IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE
        );

        const imagePreviews = validFiles.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            id: new Date().getTime() + index,
            image_url: '', 
        }));

        setNewProduct(prev => ({
            ...prev,
            images: [...(prev.images || []), ...imagePreviews],
        }));
    };

    const removeImage = (index: number) => {
        const imageToRemove = newProduct.images?.[index];
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
            if (imageToRemove.id && typeof imageToRemove.id === 'number') {
                setDeleteImagesIds(prev => [...prev, imageToRemove.id]);
            }
        }

        setNewProduct(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index),
        }));
    };

    // Product deletion
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            setIsDeleting(id);
            try {
                await deleteProduct(authToken as string, id);
                toast.success('Product deleted successfully');
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                toast.error('Failed to delete product');
                console.error('Failed to delete product:', error);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    // Pagination
    const handlePageChange = (url: string | null) => {
        if (url) {
            const page = new URL(url).searchParams.get('page');
            setCurrentPage(Number(page));
        }
    };

    // Status filter options
    const statusFilterOptions = [
        { value: 'all' as const, label: 'All', icon: null },
        { value: true as const, label: 'Active', icon: <CheckCircleIcon className="h-4 w-4" /> },
        { value: false as const, label: 'Inactive', icon: <XCircleIcon className="h-4 w-4" /> }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        Product Management
                        <button
                            onClick={handleRefresh}
                            className={`p-1 text-gray-500 hover:text-gray-700 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                            disabled={isRefreshing}
                            aria-label="Refresh products"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                        </button>
                    </h1>
                    <p className="text-sm text-gray-500">
                        {meta?.total ? `Showing ${meta.total} products` : 'Manage your product inventory'}
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
                    aria-label="Add new product"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            aria-label="Search products"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label="Clear search"
                            >
                                <FiX className="text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {statusFilterOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => setStatusFilter(option.value)}
                                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition-colors ${statusFilter === option.value
                                    ? option.value === true
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : option.value === false
                                            ? "bg-red-100 text-red-700 border border-red-200"
                                            : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <TableSkeleton rows={5} columns={6} />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={product.images[0].image_url}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                                <ShoppingBagIcon className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {product.category_name?.[0] || 'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                ${product.price}
                                                {product.discount_price && (
                                                    <span className="ml-2 text-xs text-green-600 line-through">
                                                        ${product.discount_price}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded-full text-xs ${product.quantity_in_stock > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.quantity_in_stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${product.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => openModal(product)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                                                        aria-label={`Edit ${product.name}`}
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                        disabled={isDeleting === product.id}
                                                        aria-label={`Delete ${product.name}`}
                                                    >
                                                        {isDeleting === product.id ? (
                                                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                                        ) : (
                                                            <TrashIcon className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
                                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                                <p className="text-gray-500 max-w-md">
                                                    {searchTerm || statusFilter !== "all"
                                                        ? 'No products match your search criteria. Try adjusting your filters.'
                                                        : 'You currently have no products in your inventory.'}
                                                </p>
                                                {(searchTerm || statusFilter !== "all") && (
                                                    <button
                                                        onClick={() => {
                                                            setSearchTerm("");
                                                            setStatusFilter("all");
                                                        }}
                                                        className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm transition-colors"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                                {!searchTerm && statusFilter === "all" && (
                                                    <button
                                                        onClick={() => openModal()}
                                                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors shadow-sm"
                                                    >
                                                        <PlusIcon className="h-4 w-4 inline mr-1" />
                                                        Add your first product
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {links && meta && meta.total > 0 && (
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                            <Pagination
                                links={links}
                                meta={meta}
                                handlePageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Product Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto my-8 sm:my-20 border border-gray-200 overflow-hidden"
                overlayClassName="fixed inset-0 bg-black/30 flex justify-center items-center backdrop-blur-sm transition-all duration-300 ease-out z-50"
                closeTimeoutMS={300}
                ariaHideApp={false}
                shouldCloseOnOverlayClick={!isSubmitting}
            >
                <div className="divide-y divide-gray-200 h-full flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors p-1 rounded-full"
                            disabled={isSubmitting}
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmitProduct} className="overflow-y-auto flex-grow p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="product-name"
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="product-description"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                        placeholder="Enter product description"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="product-category"
                                        value={newProduct.category_id ?? ''}
                                        onChange={(e) => {
                                            const selectedCategoryId = e.target.value ? Number(e.target.value) : null;
                                            setNewProduct({
                                                ...newProduct,
                                                category_id: selectedCategoryId,
                                            });
                                        }}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="product-sku" className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU
                                    </label>
                                    <input
                                        id="product-sku"
                                        type="text"
                                        value={newProduct.sku}
                                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                        placeholder="Enter SKU (optional)"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price ($) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="product-price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="product-discount" className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Price ($)
                                        </label>
                                        <input
                                            id="product-discount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newProduct.discount_price || ''}
                                            onChange={(e) => setNewProduct({
                                                ...newProduct,
                                                discount_price: e.target.value ? Number(e.target.value) : undefined
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                            placeholder="0.00 (optional)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="product-stock"
                                        type="number"
                                        min="0"
                                        value={newProduct.quantity_in_stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, quantity_in_stock: Number(e.target.value) })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                        placeholder="Enter quantity"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newProduct.is_active}
                                                onChange={(e) => setNewProduct({ ...newProduct, is_active: e.target.checked })}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Active product</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Images
                                    </label>
                                    <div className="mt-1 flex flex-col gap-4">
                                        {/* Image Upload */}
                                        <label className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-300 transition-colors">
                                            <div className="space-y-1 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                        <span>Upload files</span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </label>

                                        {/* Image Previews */}
                                        {newProduct.images && newProduct.images.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {newProduct.images.map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image.preview}
                                                            alt={`Preview ${index}`}
                                                            className="w-full h-32 object-cover rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 bg-white/80 text-red-500 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                            aria-label="Remove image"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center min-w-[120px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                                        {isEditing ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : isEditing ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default AllProducts;