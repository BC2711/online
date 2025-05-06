import { Product } from "../../../types";
import { http } from "../../api-client";

export const getProducts = async (): Promise<Product[]> => {
  return http.get<Product[]>('/products');
};

export const getProduct = async (id: number): Promise<Product> => {
  return http.get<Product>(`/products/${id}`);
};

export const createProduct = async (product: FormData): Promise<Product> => {
  return http.post<Product>('/products', product);
};

export const updateProduct = async (id: number, product: FormData): Promise<Product> => {
  return http.post<Product>(`/products/${id}`, product, {
    headers: {
      'X-HTTP-Method-Override': 'PUT'
    }
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  return http.delete(`/products/${id}`);
};