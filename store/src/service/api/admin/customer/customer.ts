import { http } from "../../../api-client";
import { Links, Meta } from "../../../interface";
import { ApiError } from "../../../api-client";

export interface Customer {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
    group_id: number;
    errors: FormErrors;
    success: boolean;
    message: string;
}
interface FormErrors {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    group_id?: string;
    api?: string;
}

export interface CustomerCreate {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    group_id: number;
}
export interface Group {
    id: number;
    name: string;
    status: string;
    success: boolean;
    message: string;
    errors: Error;
}

interface Error {
    name: string[];
    status: string[];
}

export interface GroupResp {
    success: boolean;
    errors: string[];
    data: Group[];
    links: Links;
    meta: Meta;
    message: string;
}
export interface CustomerFormData {
    username: string;
    email: string;
    phone?: string;
    is_active: boolean;
    group_ids?: number[]; // For associating groups
}

export interface CustomerResp {
    success: boolean;
    data: Customer[];
    meta: Meta;
    links: Links;
    message: string;
}

interface CustomerQueryParams {
    page?: number;
    username?: string;
    email?: string;
    phone?: string; // Changed from number to optional string
    is_active?: true | false;
    sort?: string;
}

// API endpoints
const CUSTOMERS_ENDPOINT = "/customers";
const GROUPS_ENDPOINT = "/groups";

// Helper function to create auth headers
const getAuthHeaders = (token: string) => ({
    Authorization: `Bearer ${token} `,
});

/**
 * Fetch a list of customers with optional filtering and sorting
 * @param token - Authentication token
 * @param params - Query parameters for pagination, search, status, and sorting
 * @throws ApiError - Detailed error information
 */
export const getCustomers = async (
    token: string, page: number, name: string, email: string, phone: string, status: any
): Promise<CustomerResp> => {
    try {
        let response;
        if (email) {
            response = await http.get<CustomerResp>(`${CUSTOMERS_ENDPOINT}?page=${page}&username=${name}&email=${email}&phone=${phone}&status=${status}`, {
                headers: getAuthHeaders(token),
            });
        } else {
            response = await http.get<CustomerResp>(`${CUSTOMERS_ENDPOINT}?page=${page}`, {
                headers: getAuthHeaders(token),
            })
        }
        return response;
    } catch (error) {
        throw error as ApiError;
    }
};

/**
 * Fetch a single customer by ID
 * @param token - Authentication token
 * @param id - Customer ID
 * @throws ApiError - Detailed error information
 */
export const getCustomerById = async (
    token: string,
    id: number
): Promise<Customer> => {
    try {
        const response = await http.get<Customer>(`${CUSTOMERS_ENDPOINT}/${id}`, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error) {
        throw error as ApiError;
    }
};

/**
 * Create a new customer
 * @param token - Authentication token
 * @param data - Customer data
 * @throws ApiError - Detailed error information
 */
export const createCustomer = async (token: string, data: CustomerFormData): Promise<Customer> => {
    try {
        const response = await http.post<Customer>(CUSTOMERS_ENDPOINT, data, { headers: getAuthHeaders(token) });
        return response;
    } catch (error: any) {
        return error;
    }
};

/**
 * Update an existing customer
 * @param token - Authentication token
 * @param id - Customer ID
 * @param data - Updated customer data
 * @throws ApiError - Detailed error information
 */
export const updateCustomer = async (
    token: string,
    id: number,
    data: CustomerFormData
): Promise<Customer> => {
    try {
        const response = await http.put<Customer>(
            `${CUSTOMERS_ENDPOINT}/${id}`,
            data,
            {
                headers: getAuthHeaders(token),
            }
        );
        return response;
    } catch (error) {
        throw error as ApiError;
    }
};

/**
 * Delete a customer
 * @param token - Authentication token
 * @param id - Customer ID
 * @throws ApiError - Detailed error information
 */
export const deleteCustomer = async (token: string, id: number): Promise<Customer> => {
    try {
        const response = await http.delete<Customer>(`${CUSTOMERS_ENDPOINT}/${id}`, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error: any) {
        return error;
    }
};

/**
 * Fetch all customer groups
 * @param token - Authentication token
 * @throws ApiError - Detailed error information
 */
export const getCustomerGroups = async (token: string): Promise<GroupResp> => {
    try {
        const response = await http.get<GroupResp>('groupsdrop', { headers: getAuthHeaders(token), });
        return response;
    } catch (error: any) { return error; }
};

export const getAllGroups = async (token: string, page: number, name: string, status: any): Promise<GroupResp> => {
    try {
        let response;
        if (name || status) {
            response = await http.get<GroupResp>(`${GROUPS_ENDPOINT}?page=${page}&name=${name}&status=${status}`, {
                headers: getAuthHeaders(token),
            });
        } else {
            response = await http.get<GroupResp>(`${GROUPS_ENDPOINT}?page=${page}`, {
                headers: getAuthHeaders(token),
            });
        }
        return response;
    } catch (error: any) {
        return error;
    }
};

/**
 * Fetch a single customer group by ID
 * @param token - Authentication token
 * @param id - Group ID
 * @throws ApiError - Detailed error information
 */
export const getCustomerGroupById = async (
    token: string,
    id: number
): Promise<Group> => {
    try {
        const response = await http.get<Group>(
            `${GROUPS_ENDPOINT}/${id}`,
            {
                headers: getAuthHeaders(token),
            }
        );
        return response;
    } catch (error) {
        throw error as ApiError;
    }
};

/**
 * Create a new customer group
 * @param token - Authentication token
 * @param data - Group data
 * @throws ApiError - Detailed error information
 */
export const createCustomerGroup = async (token: string, data: Partial<Group>): Promise<Group> => {
    try {
        const response = await http.post<Group>(
            GROUPS_ENDPOINT,
            data,
            {
                headers: getAuthHeaders(token),
            }
        );
        return response;
    } catch (error: any) {
        return error;
    }
};

/**
 * Update an existing customer group
 * @param token - Authentication token
 * @param id - Group ID
 * @param data - Updated group data
 * @throws ApiError - Detailed error information
 */
export const updateCustomerGroup = async (
    token: string,
    id: number,
    data: Partial<Group>
): Promise<Group> => {
    try {
        const response = await http.put<Group>(
            `${GROUPS_ENDPOINT}/${id}`,
            data,
            {
                headers: getAuthHeaders(token),
            }
        );
        return response;
    } catch (error: any) {
        return error;
    }
};

/**
 * Delete a customer group
 * @param token - Authentication token
 * @param id - Group ID
 * @throws ApiError - Detailed error information
 */
export const deleteCustomerGroup = async (token: string, id: number): Promise<Group> => {
    try {
        const response = await http.delete<Group>(`${GROUPS_ENDPOINT}/${id}`, {
            headers: getAuthHeaders(token),
        });
        return response;
    } catch (error: any) {
        return error;
    }
};