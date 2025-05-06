import React, { useState, useMemo, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
    id: number;
    name: string;
    sku: string;
    stock: number;
    threshold: number;
    disabled?: boolean;
    lastRestocked?: string;
};

const LowStockAlertPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Wireless Mouse', sku: 'MSE-001', stock: 3, threshold: 5 },
        { id: 2, name: 'USB-C Charger', sku: 'CHG-234', stock: 1, threshold: 5 },
        { id: 3, name: 'Bluetooth Speaker', sku: 'SPK-990', stock: 4, threshold: 10 },
    ]);
    const [restockAmount, setRestockAmount] = useState<number>(10);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [sortField, setSortField] = useState<keyof Product>('stock');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleRestock = useCallback(
        (productId: number, quantity: number) => {
            if (quantity <= 0) {
                toast.error('Restock quantity must be positive');
                return;
            }
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === productId
                        ? {
                            ...product,
                            stock: product.stock + quantity,
                            lastRestocked: new Date().toISOString(),
                        }
                        : product
                )
            );
            toast.success('Stock updated successfully');
        },
        []
    );

    const handleDisable = useCallback((productId: number) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId
                    ? { ...product, disabled: !product.disabled }
                    : product
            )
        );
        toast.success('Product status updated');
    }, []);

    const toggleSort = (field: keyof Product) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedProducts = useMemo(() => {
        return products
            .filter(
                (p) =>
                    !p.disabled &&
                    p.stock < p.threshold &&
                    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            });
    }, [products, searchTerm, sortField, sortDirection]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Low Stock Alerts</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Search products"
                    />
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600" htmlFor="restockAmount">
                            Restock Qty:
                        </label>
                        <input
                            type="number"
                            id="restockAmount"
                            min="1"
                            value={restockAmount}
                            onChange={(e) => setRestockAmount(parseInt(e.target.value) || 10)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Default restock quantity"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-red-50">
                            <tr>
                                {[
                                    { key: 'name', label: 'Product' },
                                    { key: 'sku', label: 'SKU' },
                                    { key: 'stock', label: 'Stock' },
                                    { key: 'threshold', label: 'Threshold' },
                                    { key: 'lastRestocked', label: 'Last Restocked' },
                                ].map((header) => (
                                    <th
                                        key={header.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => toggleSort(header.key as keyof Product)}
                                    >
                                        {header.label}
                                        {sortField === header.key && (
                                            <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                                        )}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-medium text-red-800 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-red-800 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {filteredAndSortedProducts.length > 0 ? (
                                    filteredAndSortedProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={product.stock === 0 ? 'bg-red-50' : 'hover:bg-gray-50'}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span
                                                    className={`font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-yellow-600'
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                {product.threshold}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {product.lastRestocked
                                                    ? new Date(product.lastRestocked).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock === 0
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedProduct(product)}
                                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    aria-label={`Restock ${product.name}`}
                                                >
                                                    Restock
                                                </button>
                                                <button
                                                    onClick={() => handleDisable(product.id)}
                                                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                                    aria-label={`${product.disabled ? 'Enable' : 'Disable'} ${product.name}`}
                                                >
                                                    {product.disabled ? 'Enable' : 'Disable'}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td colSpan={7} className="px-6 py-8 text-center">
                                            <div className="text-gray-500 mb-2">🎉</div>
                                            <p className="text-gray-600">All stock levels are healthy!</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                No products below their threshold levels
                                            </p>
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Restock Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        >
                            <h2 className="text-xl font-bold mb-4">
                                Restock {selectedProduct.name}
                            </h2>
                            <div className="mb-4 space-y-2">
                                <p className="text-sm text-gray-700">
                                    Current Stock:{' '}
                                    <span className="font-semibold">{selectedProduct.stock}</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                    Threshold:{' '}
                                    <span className="font-semibold">{selectedProduct.threshold}</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                    SKU: <span className="font-semibold">{selectedProduct.sku}</span>
                                </p>
                            </div>
                            <div className="mb-6">
                                <label
                                    htmlFor="restockQty"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Quantity to Add:
                                </label>
                                <input
                                    type="number"
                                    id="restockQty"
                                    min="1"
                                    value={restockAmount}
                                    onChange={(e) => setRestockAmount(parseInt(e.target.value) || 10)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    aria-label="Restock quantity"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    aria-label="Cancel restock"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleRestock(selectedProduct.id, restockAmount);
                                        setSelectedProduct(null);
                                    }}
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    aria-label="Confirm restock"
                                >
                                    Confirm Restock
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LowStockAlertPage;