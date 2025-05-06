import { Product } from "../../../types";
import { http } from "../../api-client";

export const logout = async (): Promise<void> => {
    return http.post('/logout');
};

// export const getCurrentUser = async (): Promise<User> => {
//     return http.get('/user');
// };

export const createProduct = async (productData: FormData): Promise<Product> => {
    return http.post('/products', productData);
};