import { http } from "../../../api-client";

// Represents a single product
export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    discount_price?: number;
    quantity_in_stock: number;
    is_active: boolean;
    images?: { file: File; preview: string; id: number; image_url: string }[];
    category_id: number | null;
    category_name: string[];

}
export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    alt_text: string | null;
}

export interface CreateProductResponse {
    message: string;
    success: boolean;
    data?: Product;
    errors?: string[];
}

export type CreateProductInput = Omit<Product, 'id' | 'sku' | 'is_active' | 'created_by' | 'created_at' | 'updated_at'>;

// Represents pagination links
export interface Links {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

// Represents pagination metadata
export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

// Represents the API response for fetching products
export interface ProductResponse {
    success: boolean;
    data: Product[];
    links: Links;
    meta: Meta;
    errors: string[];
}

// Represents the API response for a single product
export interface SingleProductResponse {
    success: boolean;
    data: Product;
    errors: string[];
    message: string;
}

// Utility function for handling errors
const handleError = (error: any, defaultMessage: string): never => {
    console.error(defaultMessage, error.message || error);
    throw new Error(error.response?.data?.error || defaultMessage);
};

// Fetch all products with pagination
export const getProducts = async (
    token: string,
    page: number = 1,
    search: string = ""
): Promise<ProductResponse | undefined> => {
    try {
        const response = await http.get<ProductResponse>(`/products?page=${page}&search=${encodeURIComponent(search)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error: any) {
        handleError(error, "An error occurred while fetching products.");
    }
};

// Fetch a single product by ID
export const getProductById = async (token: string, id: number): Promise<SingleProductResponse | undefined> => {
    try {
        const response = await http.get<SingleProductResponse>(`/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error: any) {
        handleError(error, "An error occurred while fetching the product.");
    }
};

// Create a new product
export const createProduct = async (
    token: string,
    productData: CreateProductInput
): Promise<CreateProductResponse | undefined> => {
    try {
        const formData = new FormData();

        // Append product data to FormData
        Object.entries(productData).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
                // Append multiple images
                value.forEach((image) => {
                    if (typeof image === "object" && image !== null && "file" in image) {
                        formData.append("images[]", image.file);
                    }
                });
            } else if (key === "category" && Array.isArray(value)) {
                // Append multiple categories
                value.forEach((category) => {
                    if (typeof category === "string") {
                        formData.append("category[]", category);
                    }
                });
            } else {
                formData.append(key, value as string | Blob);
            }
        });

        // Make the API request
        const response = await http.post<CreateProductResponse>("/products", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // axios handles this automatically; optional
            },
        });

        return response;
    } catch (error: any) {
        handleError(error, "An error occurred while creating the product.");
    }
};

// Update an existing product
export const updateProduct = async (
    token: string,
    id: number,
    productData: Partial<Omit<Product, "id" | "created_by" | "created_at" | "updated_at">> & {
        discount_price?: number;
        delete_images?: number[];
    },
    delete_images?: number[]
    // productData: Partial<Product> & { delete_images?: number[] }
): Promise<SingleProductResponse | undefined> => {
    try {
        const formData = new FormData();

        // Handle simple fields
        const simpleFields = ['name', 'price', 'quantity_in_stock', 'description', 'discount_price', 'category_id'];
        simpleFields.forEach(field => {
            const value = productData[field as keyof typeof productData];
            if (value !== undefined && value !== null) {
                formData.append(field, value.toString());
            }
        });

        // Handle images
        if (productData.images && Array.isArray(productData.images)) {
            productData.images.forEach((image) => {
                // formData.append('delete_images[]',image.id)
                if (image instanceof File) {
                    formData.append('images[]', image);
                } else if (typeof image === 'object' && image.file instanceof File) {
                    formData.append('images[]', image.file);
                }
            });
        }

        // Handle delete_images
        if (delete_images && Array.isArray(delete_images)) {
            delete_images.forEach((id, index) => {
                formData.append(`delete_images[${index}]`, id.toString());
            });
        }

        // Spoof PUT
        formData.append('_method', 'PUT');
        // const entries = Array.from(formData.entries());
        // if (entries.length === 0) {
        //     console.error('FormData is empty! Input productData:', productData);
        // } else {
        //     entries.forEach(([key, value]) => {
        //         console.log(`${key}: ${value instanceof File ? value.name : value}`);
        //     });
        // }

        const response = await http.post<SingleProductResponse>(`/products/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });
        return response;
    } catch (error: any) {
        console.error('Error updating product:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            error: error,
        });
        if (error.response?.status === 422) {
            console.error('Validation errors:', error.response.data.errors);
            handleError(error, 'Validation failed: ' + JSON.stringify(error.response.data.errors));
        } else {
            handleError(error, 'An error occurred while updating the product.');
        }
        return undefined;
    }
};

// Delete a product
export const deleteProduct = async (token: string, id: number): Promise<void> => {
    try {
        await http.delete(`/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        handleError(error, "An error occurred while deleting the product.");
    }
};

// Fetch all categories
export const getCategories = async (token: string): Promise<Array<{ id: number; name: string }> | undefined> => {
    try {
        const response = await http.get<{ success: boolean; data: Array<{ id: number; name: string }> }>(
            "/categories",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return handleError(error, "An error occurred while fetching categories.");
    }
};