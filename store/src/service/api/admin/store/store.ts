import { http } from "../../../api-client";
import { getAuthHeaders } from "../../../commonMethods";
import { Links, Meta } from "../../../interface";

// Generic API response interface
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta: Meta;
    links: Links;
}

// Store data structure
interface Store {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    status: string;
    currency: string;
    timezone: string;
    city: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
}

// Form data for creating/updating stores (excludes backend-managed fields)
interface StoreFormData {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    status?: string;
    currency?: string;
    timezone?: string;
    city?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
}

// Response types
type GetStoreResponse = ApiResponse<Store[]>;
type StoreResponse = ApiResponse<Store>;
type DeleteStoreResponse = ApiResponse<null>;

// Constants
const STORE_ENDPOINT = '/store';

// Error handling utility
class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'ApiError';
    }
}

// Validate token
const validateToken = (token: string): void => {
    if (!token?.trim()) {
        throw new ApiError('Authentication token is required');
    }
};

// CRUD Operations
export const getStore = async (
    token: string,
    page: number = 1,
    perPage: number = 10
): Promise<GetStoreResponse> => {
    validateToken(token);
    try {
        const response = await http.get<GetStoreResponse>(
            `${STORE_ENDPOINT}?page=${page}&per_page=${perPage}`,
            { headers: getAuthHeaders(token) }
        );
        return response; 
    } catch (error: any) {
        throw new ApiError(
            error.response?.data?.message || 'Failed to fetch stores',
            error.response?.status
        );
    }
};

export const createStore = async (
    token: string,
    formData: StoreFormData
): Promise<StoreResponse> => {
    validateToken(token);
    try {
        const response = await http.post<StoreResponse>(
            STORE_ENDPOINT,
            formData,
            { headers: getAuthHeaders(token) }
        );
        return response;
    } catch (error: any) {
        throw new ApiError(
            error.response?.data?.message || 'Failed to create store',
            error.response?.status
        );
    }
};

export const updateStore = async (
    token: string,
    id: number,
    formData: StoreFormData
): Promise<StoreResponse> => {
    if (id <= 0) {
        throw new ApiError('Invalid store ID');
    }
    validateToken(token);
    try {
        const response = await http.put<StoreResponse>(
            `${STORE_ENDPOINT}/${id}`,
            formData,
            { headers: getAuthHeaders(token) }
        );
        return response;
    } catch (error: any) {
        throw new ApiError(
            error.response?.data?.message || 'Failed to update store',
            error.response?.status
        );
    }
};

export const deleteStore = async (
    token: string,
    id: number
): Promise<DeleteStoreResponse> => {
    if (id <= 0) {
        throw new ApiError('Invalid store ID');
    }
    validateToken(token);
    try {
        const response = await http.delete<DeleteStoreResponse>(
            `${STORE_ENDPOINT}/${id}`,
            { headers: getAuthHeaders(token) }
        );
        return response;
    } catch (error: any) {
        throw new ApiError(
            error.response?.data?.message || 'Failed to delete store',
            error.response?.status
        );
    }
};