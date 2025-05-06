// src/service/api/admin/customer/customer.ts

import { http, isApiError } from "../../../api-client";
import { getAuthHeaders } from "../../../commonMethods";
import { Links, Meta } from "../../../interface";

export interface Store {
    id: number;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    status: "active" | "inactive";
    currency: string;
    timezone: string;
    city?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
    created_at: string;
    updated_at: string;
}

export interface StoreResp {
    success: boolean;
    data: Store[];
    meta: Meta;
    links: Links;
    message: string;
}


   




/**
 * Fetch a list of stores with pagination
 * @param token - Authentication token
 * @param page - Page number for pagination
 * @throws ApiError - Detailed error information
 */
export const getStores = async (
    token: string,
    page: number = 1
): Promise<StoreResp> => {
    try {
        const response = await http.get<unknown>(
            `/stores?page=${page}`,
            { headers: getAuthHeaders(token) }
        );
    } catch (error) {
        throw error instanceof isApiError
          
    }
};

/**
 * Fetch a single store by ID
 * @param token - Authentication token
 * @param id - Store ID
 * @throws ApiError - Detailed error information
 */
export const getStoreById = async (
    token: string,
    id: number
): Promise<Store> => {
    try {
        const response = await http.get<unknown>(`/stores/${id}`, {
            headers: getAuthHeaders(token),
        });
        const parsed = SingleStoreSchema.safeParse(response);
        if (!parsed.success) {
            throw new ApiError("Invalid response format", { errors: parsed.error });
        }
        if (!parsed.data.success) {
            throw new ApiError(parsed.data.message || "Failed to fetch store");
        }
        return parsed.data.data;
    } catch (error) {
        throw error instanceof ApiError
            ? error
            : new ApiError("An error occurred while fetching store", { cause: error });
    }
};

/**
 * Create a new store
 * @param token - Authentication token
 * @param data - Store data
 * @throws ApiError - Detailed error information
 */
export const createStore = async (
    token: string,
    data: Partial<Omit<Store, "id" | "created_at" | "updated_at">>
): Promise<Store> => {
    try {
        const response = await http.post<unknown>(
            "/stores",
            data,
            { headers: getAuthHeaders(token) }
        );
        const parsed = SingleStoreSchema.safeParse(response);
        if (!parsed.success) {
            throw new ApiError("Invalid response format", { errors: parsed.error });
        }
        if (!parsed.data.success) {
            throw new ApiError(parsed.data.message || "Failed to create store");
        }
        return parsed.data.data;
    } catch (error) {
        throw error instanceof ApiError
            ? error
            : new ApiError("An error occurred while creating store", { cause: error });
    }
};

/**
 * Update an existing store
 * @param token - Authentication token
 * @param id - Store ID
 * @param data - Updated store data
 * @throws ApiError - Detailed error information
 */
export const updateStore = async (
    token: string,
    id: number,
    data: Partial<Omit<Store, "id" | "created_at" | "updated_at">>
): Promise<Store> => {
    try {
        const response = await http.put<unknown>(
            `/stores/${id}`,
            data,
            { headers: getAuthHeaders(token) }
        );
   
    } catch (error) {
        throw error instanceof ApiError
            ? error
            : new ApiError("An error occurred while updating store", { cause: error });
    }
};

/**
 * Delete a store
 * @param token - Authentication token
 * @param id - Store ID
 * @throws ApiError - Detailed error information
 */
export const deleteStore = async (
    token: string,
    id: number
): Promise<void> => {
    try {
        const response = await http.delete<unknown>(`/stores/${id}`, {
            headers: getAuthHeaders(token),
        });
        const parsed = z.object({ success: z.boolean(), message: z.string() }).safeParse(response);
        if (!parsed.success) {
            throw new ApiError("Invalid response format", { errors: parsed.error });
        }
        if (!parsed.data.success) {
            throw new ApiError(parsed.data.message || "Failed to delete store");
        }
    } catch (error) {
        throw error instanceof ApiError
            ? error
            : new ApiError("An error occurred while deleting store", { cause: error });
    }
};