// components/ProductForm.tsx
import { useEffect, useState } from 'react';
import { createProduct, getProduct, updateProduct } from './api';
import { useProductForm } from './useProductForm';

interface ProductFormProps {
    productId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ProductForm = ({ productId, onSuccess, onCancel }: ProductFormProps) => {
    const {
        product,
        setProduct,
        handleChange,
        handleImageChange,
        prepareFormData
    } = useProductForm();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            getProduct(productId)
                .then(fetchedProduct => {
                    setProduct({
                        ...fetchedProduct,
                        images: [] 
                    });
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [productId, setProduct]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = prepareFormData();
            if (productId) {
                await updateProduct(productId, formData);
            } else {
                await createProduct(formData);
            }
            onSuccess?.();
            if (!productId) {
                setProduct({
                    id: 0,
                    name: '',
                    description: '',
                    sku: '',
                    price: 0,
                    discount_price: 0,
                    quantity_in_stock: 0,
                    weight: 0,
                    is_active: false,
                    images: [],
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !product.name) return <div>Loading product data...</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
                {productId ? 'Edit Product' : 'Add New Product'}
            </h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        rows={3}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity_in_stock}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                        {product.images && !(product.images instanceof File) && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Current image:</p>
                                <img
                                    // src={product.images[url]}
                                    alt="Current product"
                                    className="h-20 object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;