import { ApiError, http } from "../../../api-client";

export interface loginFormData {
    email: string;
    password: string;
}

export interface successfullLoginData {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        is_active: boolean;
    };
}

export interface loginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        is_active: boolean;
    };
}

interface logoutResp {
    id: number;
    is_active: number;
    username: string;
}

let LOGIN_ENDPOINT = "/login";
let LOGOUT_ENDPOINT = "/logout";

// Helper function to create auth headers
const getAuthHeaders = (token: string) => ({
    Authorization: `Bearer ${token} `,
});

export const login = async (data: loginFormData): Promise<loginResponse> => {
    try {
        const response = await http.post<loginResponse>(LOGIN_ENDPOINT, data);
        return response;
    } catch (error) {
        throw error as ApiError;
    }
};

export const logout = async (token: string): Promise<logoutResp> => {
    try {
        const response = await http.post<logoutResp>(LOGOUT_ENDPOINT, {}, { headers: getAuthHeaders(token) });
        return response;
    } catch (error: any) {
        return error;
    }
};