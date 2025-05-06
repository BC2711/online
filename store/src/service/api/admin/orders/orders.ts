import { handleError, http } from "../../../api-client";
import { Links, Meta } from "../../../interface";

// Define the types for the API responses
export interface Order {
    id: number;
    status: string;
    total_amount: number;
    shipping_amount: string;
    tax_amount: string;
    discount_amount: number;
    tracking_number: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    shipping_info: ShippingInfo;
    payment_method: string;
    payments: Payment;
    user: User;
    order_items: OrderItem[];
}

export interface ShippingInfo {
    id: number;
    address_type: string;
    street_address1: string;
    street_address2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface Payment {
    id: number;
    payment_method: string;
    amount: string | null;
    status: string;
    transaction_id: string | null;
    created_at: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface OrderItem {
    id: number;
    quantity: number;
    unit_price: string;
    discount_price: string;
    total_price: string;
    product: Product;
}

export interface Product {
    id: number;
    name: string;
}

export interface OrderResponse {
    success: boolean;
    data: Order | Order[];
    links: Links;
    meta: Meta;
}

// Fetch all orders with optional pagination and search
export const getOrders = async (
    token: string,
    page: number = 1,
    search: string = ''
): Promise<OrderResponse | undefined> => {
    try {
        const response = await http.get<OrderResponse>(
            `/orders?page=${page}&search=${encodeURIComponent(search)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error: any) {
        handleError(error, 'An error occurred while fetching orders.');
    }
};

// Fetch a single order by ID
export const getOrderById = async (
    token: string,
    id: number
): Promise<OrderResponse | undefined> => {
    try {
        const response = await http.get<OrderResponse>(`/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error: any) {
        handleError(error, 'An error occurred while fetching the order.');
    }
};

// Create a new order
export const createOrder = async (
    token: string,
    orderData: Partial<Order>
): Promise<OrderResponse | undefined> => {
    try {
        const response = await http.post<OrderResponse>('/orders', orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error: any) {
        handleError(error, 'An error occurred while creating the order.');
    }
};

// Update an existing order
export const updateOrder = async (
    token: string,
    id: number,
    orderData: Partial<Order>
): Promise<OrderResponse | undefined> => {
    try {
        const response = await http.put<OrderResponse>(`/orders/${id}`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error: any) {
        handleError(error, 'An error occurred while updating the order.');
    }
};

// Delete an order
export const deleteOrder = async (
    token: string,
    id: number
): Promise<OrderResponse | undefined> => {
    try {
        const response = await http.delete<OrderResponse>(`/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error: any) {
        handleError(error, 'An error occurred while deleting the order.');
    }
};

export const approveOrder = async (token: string, orderId: number): Promise<void> => {
    try {
        await http.post(
            `/orders/${orderId}/approve`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error: any) {
        handleError(error, 'An error occurred while approving the order.');
    }
};

export const cancelOrder = async (token: string, orderId: number): Promise<void> => {
    try {
        await http.post(
            `/orders/${orderId}/cancel`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error: any) {
        handleError(error, 'An error occurred while canceling the order.');
    }
};