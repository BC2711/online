import React, { useState, useEffect } from 'react';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    EyeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    FunnelIcon,
} from '@heroicons/react/24/solid';
import { SearchIcon } from 'lucide-react';
import { PhoneXMarkIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    price: number;
    status: 'active' | 'inactive';
}

interface SortConfig {
    key: keyof Product;
    direction: 'asc' | 'desc';
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

const initialProducts: Product[] = [
    { id: 1, name: 'Wireless Headphones', sku: 'SKU123', stock: 12, price: 129.99, status: 'active' },
    { id: 2, name: 'Smart Watch', sku: 'SKU456', stock: 5, price: 199.99, status: 'inactive' },
    { id: 3, name: 'Bluetooth Speaker', sku: 'SKU789', stock: 34, price: 59.99, status: 'active' },
    { id: 4, name: 'Yoga Mat', sku: 'SKU101', stock: 0, price: 29.99, status: 'active' },
    { id: 5, name: 'Running Shoes', sku: 'SKU112', stock: 8, price: 89.99, status: 'inactive' },
];

const InventoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        sku: '',
        stock: 0,
        price: 0,
        status: 'active',
    });

    const itemsPerPage = 10;

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const requestSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Product) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronDownIcon className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4 ml-1" />
        ) : (
            <ChevronDownIcon className="h-4 w-4 ml-1" />
        );
    };

    const handleAddProduct = () => {
        const newId = Math.max(...products.map((p) => p.id), 0) + 1;
        setProducts([...products, { ...newProduct, id: newId }]);
        setIsAddModalOpen(false);
        setNewProduct({ name: '', sku: '', stock: 0, price: 0, status: 'active' });
        showToast('Product added successfully', 'success');
    };

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter((p) => p.id !== id));
        setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
        showToast('Product deleted successfully', 'success');
    };

    const handleBulkDelete = () => {
        setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        showToast('Selected products deleted successfully', 'success');
    };

    const toggleSelectProduct = (id: number) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setToasts((prev:any) => [...prev, { id, message, type }]);
    };

    useEffect(() => {
        const timers = toasts.map((toast:any) =>
            setTimeout(() => setToasts((prev:any) => prev.filter((t:any) => t.id !== toast.id)), 3000)
        );
        return () => timers.forEach(clearTimeout);
    }, [toasts]);

    const getStockColor = (stock: number) => {
        if (stock === 0) return 'text-red-600 bg-red-50';
        if (stock < 10) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
                <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600">{selectedProducts.length} selected</span>
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                                        onChange={() =>
                                            setSelectedProducts(
                                                selectedProducts.length === paginatedProducts.length
                                                    ? []
                                                    : paginatedProducts.map((p) => p.id)
                                            )
                                        }
                                    />
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group cursor-pointer"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center">
                                        Product
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group cursor-pointer"
                                    onClick={() => requestSort('sku')}
                                >
                                    <div className="flex items-center">
                                        SKU
                                        {getSortIcon('sku')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider group cursor-pointer"
                                    onClick={() => requestSort('stock')}
                                >
                                    <div className="flex items-center justify-end">
                                        Stock
                                        {getSortIcon('stock')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider group cursor-pointer"
                                    onClick={() => requestSort('price')}
                                >
                                    <div className="flex items-center justify-end">
                                        Price
                                        {getSortIcon('price')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => toggleSelectProduct(product.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(product.stock)}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    title="View"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No products found. {searchTerm && 'Try a different search term.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="product-name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="product-sku" className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    id="product-sku"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.sku}
                                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        id="product-stock"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="product-price"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="product-status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="product-status"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.status}
                                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as 'active' | 'inactive' })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                disabled={!newProduct.name.trim() || !newProduct.sku.trim()}
                                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${newProduct.name.trim() && newProduct.sku.trim()
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-blue-400 cursor-not-allowed'
                                    }`}
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {toasts.map((toast:any) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-md text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                            } animate-in slide-in-from-bottom-4`}
                    >
                        <span>{toast.message}</span>
                        <button
                            onClick={() => setToasts((prev :any) => prev.filter((t:any) => t.id !== toast.id))}
                            className="text-white hover:text-gray-200"
                        >
                            <PhoneXMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryPage;