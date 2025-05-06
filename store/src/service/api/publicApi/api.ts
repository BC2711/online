import { PaginatedProductResponse, Product } from "../../../types";
import { http } from "../../api-client";


// export const getPublicProducts = async (): Promise<Product[]> => {
//     return http.get<Product[]>('/products');
// };

export const getProductDetails = async (id: number): Promise<Product> => {
    return http.get<Product>(`/products/${id}`);
};

// export const login = async (credentials: LoginData): Promise<User> => {
//     return http.post<User>('/login', credentials);
// };

// export const register = async (userData: RegisterData): Promise<User> => {
//     return http.post<User>('/register', userData);
// };
// In your publicApi.ts
export const getPublicProducts = async (params?: {
    type?: string;
    gender?: string;
    category?: string;
    page?: string;
}): Promise<PaginatedProductResponse> => {
    const queryString = new URLSearchParams();
    if (params?.type) queryString.append('type', params.type);
    if (params?.gender) queryString.append('gender', params.gender);
    if (params?.category) queryString.append('category', params.category);
    if (params?.page) queryString.append('page', params.page);

    const response = await http.get<PaginatedProductResponse>(`/products?${queryString}`);
    return response;
};