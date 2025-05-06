// hooks/useProductForm.ts
import { useState } from 'react';
import { Product } from '../../../types';

export const useProductForm = (initialProduct?: Product) => {
    const [product, setProduct] = useState<Product>(initialProduct || {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'quantity' ? Number(value) : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProduct(prev => ({
                ...prev,
                image: e.target.files![0]
            }));
        }
    };

    const prepareFormData = (): FormData => {
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price.toString());
        formData.append('quantity_in_stock', product.quantity_in_stock.toString());
        if (product.images instanceof File) {
            formData.append('image', product.images);
        }
        return formData;
    };

    return {
        product,
        setProduct,
        handleChange,
        handleImageChange,
        prepareFormData
    };
};