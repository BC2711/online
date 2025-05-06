// src/types/index.ts
export interface ProductImage {
    id: number;
    url: string;
    alt_text?: string;
}

// types/product.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount_price?: number;
    sku: string;
    quantity_in_stock: number;
    rating?: number;
    review_count?: number;
    images: Array<{
        product_id: number;
        image_url: string;
    }>;
    // Add other product properties as needed
}

export interface PaginatedProductResponse {
    data: Product[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

