import { ApiError, http } from "../../../api-client";
import { getAuthHeaders } from "../../../commonMethods";
import { Links, Meta } from "../../../interface";

interface Errors{
    name: [];
    description: [];
}
// Represents a single category
export interface Category {
    id: number;
    name: string;
    description: string;
    message: string;
    success: boolean;
    errors: Errors;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'message' | 'success'| 'errors'>;


// Represents the API response for fetching categories
export interface CategoryResponse {
    success: boolean;
    errors: string[];
    data: Category[];
    links: Links;
    meta: Meta;
}

export interface CategoryById {
    data: {
        id: number;
        name: string;
        description: string;
    };
    message: string;
    success: boolean;
}

const CATEGORY_END_POINT = '/categories';

/**
 * Fetch all categories from the backend.
 * @param token - The authentication token for the API request.
 * @param page - The page number to fetch (optional, defaults to 1).
 * @returns A promise resolving to the API response.
 * 
 */

export const getCategories = async (token: string, page: number = 1): Promise<CategoryResponse> => {
    try {
        const response = await http.get<CategoryResponse>(`${CATEGORY_END_POINT}?page=${page}`, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error: any) {
        throw error as ApiError;
    }
};

export const categoryDropDown = async (token: string): Promise<CategoryResponse> => {
    try {
        const response = await http.get<CategoryResponse>(`${CATEGORY_END_POINT}`, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error: any) {
        throw error as ApiError;
    }
}

export const getCategoryById = async (token: string, id: number): Promise<CategoryById> => {
    try {
        const response = await http.get<CategoryById>(`${CATEGORY_END_POINT}/${id}`, {
            headers: getAuthHeaders(token)
        });
        return response;
    } catch (error: any) {
        throw error as ApiError;
    }
}

/**
 * Create a new category in the backend.
 * @param token - The authentication token for the API request.
 * @param category - The category data to create.
 * @returns A promise resolving to the created category.
 */
export const createCategory = async (token: string, category: CreateCategoryInput): Promise<Category> => {
    try {
        const response = await http.post<Category>(`${CATEGORY_END_POINT}`, category, {
            headers: getAuthHeaders(token)
        });
        
        return response;
    } catch (error: any) {
       return  error;
    }
}


/**
 * Update an existing category in the backend.
 * @param token - The authentication token for the API request.
 * @param id - The ID of the category to update.
 * @param category - The updated category data.
 * @returns A promise resolving to the updated category.
 */
export const updateCategory = async (token: string, id: number, category: CreateCategoryInput): Promise<Category> => {
    try {
        const response = await http.put<Category>(`${CATEGORY_END_POINT}/${id}`, category, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error: any) {
        throw error as ApiError;
    }
}

/**
 * Delete a category from the backend.
 * @param token - The authentication token for the API request.
 * @param id - The ID of the category to delete.
 * @returns A promise resolving to the deletion status.
 */
export const deleteCategory = async (token: string, id: number): Promise<{ success: boolean }> => {
    try {
        const response = await http.delete<Category>(`${CATEGORY_END_POINT}/${id}`, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error: any) {
        throw error as ApiError;
    }
}