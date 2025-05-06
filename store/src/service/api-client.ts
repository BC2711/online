import axios, { AxiosError, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const CSRF_COOKIE_ENDPOINT = `${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`;
const CSRF_TOKEN_NAME = 'XSRF-TOKEN';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    timeout: REQUEST_TIMEOUT,
});

// CSRF token management
let isFetchingCsrf = false;
let cachedCsrfToken: string | null = null;

/**
 * Interface for API errors
 */
export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
    code?: string;
    originalError?: unknown;
}

/**
 * Interface for API response data
 */
interface ApiResponseData<T> {
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
    code?: string;
}



/**
 * CSRF token management
 */
const getCsrfTokenFromCookie = (): string | null => {
    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${CSRF_TOKEN_NAME}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

/**
 * Fetch CSRF token with timeout
 */
const fetchCsrfToken = async (): Promise<void> => {
    try {
        await axios.get(CSRF_COOKIE_ENDPOINT, {
            withCredentials: true,
            timeout: 5000,
        });
        cachedCsrfToken = getCsrfTokenFromCookie();
    } catch (error) {
        throw new Error('Failed to fetch CSRF token');
    }
};

/**
 * Ensure CSRF token is available
 */
const ensureCsrfToken = async (): Promise<void> => {
    if (cachedCsrfToken) return;

    if (!isFetchingCsrf) {
        isFetchingCsrf = true;
        try {
            await fetchCsrfToken();
        } finally {
            isFetchingCsrf = false;
        }
    } else {
        // Wait for ongoing fetch to complete
        while (isFetchingCsrf) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
};

/**
 * Request interceptor for CSRF token and headers
 */
apiClient.interceptors.request.use(async (config) => {
    // Skip for GET requests or external URLs
    if (config.method?.toUpperCase() === 'GET' || !config.url?.startsWith('/')) {
        return config;
    }

    const isFileUpload = config.data instanceof FormData;

    try {
        await ensureCsrfToken();

        if (cachedCsrfToken) {
            config.headers['X-XSRF-TOKEN'] = cachedCsrfToken;
        }

        if (!isFileUpload && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
    } catch (error) {
        throw new Error('Failed to set CSRF token');
    }

    return config;
});

/**
 * Response interceptor for error handling and retries
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiResponseData<unknown>>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retryCount: number };

        // Initialize retry count
        if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && originalRequest._retryCount < MAX_RETRIES) {
            if (!originalRequest.url?.includes('/login')) {
                window.location.href = '/login?session_expired=true';
                return Promise.reject(error);
            }
        }

        // Handle 419 CSRF token mismatch
        if (error.response?.status === 419 && originalRequest._retryCount < MAX_RETRIES) {
            originalRequest._retryCount += 1;
            try {
                // Clear cached token
                cachedCsrfToken = null;
                document.cookie = `${CSRF_TOKEN_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
                await ensureCsrfToken();
                return apiClient(originalRequest);
            } catch (csrfError) {
                window.location.href = '/login?csrf_error=true';
                return Promise.reject(csrfError);
            }
        }

        // Handle transient errors (e.g., 503, 504)
        if ([503, 504].includes(error.response?.status || 0) && originalRequest._retryCount < MAX_RETRIES) {
            originalRequest._retryCount += 1;
            await new Promise((resolve) => setTimeout(resolve, 1000 * originalRequest._retryCount));
            return apiClient(originalRequest);
        }

        return Promise.reject(error);
    }
);

/**
 * Handle API errors with detailed information
 */
function handleApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponseData<unknown>>;

        if (error.code === 'ERR_NETWORK') {
            return {
                message: 'Network error - please check your connection',
                code: 'network_error',
                originalError: error,
            };
        }

        if (error.code === 'ECONNABORTED') {
            return {
                message: 'Request timeout - please try again',
                code: 'timeout_error',
                originalError: error,
            };
        }

        const responseData = axiosError.response?.data;
        return {
            message: responseData?.message || axiosError.message || 'An unexpected error occurred',
            status: axiosError.response?.status,
            errors: responseData?.errors || {},
            code: responseData?.code || axiosError.code || 'unknown_error',
            originalError: error,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            code: 'error_instance',
            originalError: error,
        };
    }

    return {
        message: 'An unknown error occurred',
        code: 'unknown_error',
        originalError: error,
    };
}

/**
 * HTTP client methods
 */
export const http = {
    /**
     * Perform a GET request
     * @param url - API endpoint
     * @param config - Axios request configuration
     */
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.get<ApiResponseData<T>>(url, config);
            return response.data as T;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Perform a POST request
     * @param url - API endpoint
     * @param data - Request payload
     * @param config - Axios request configuration
     */
    post: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.post<ApiResponseData<T>>(url, data, config);
            return response.data.data as T;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Perform a PUT request
     * @param url - API endpoint
     * @param data - Request payload
     * @param config - Axios request configuration
     */
    put: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.put<ApiResponseData<T>>(url, data, config);
            return response.data.data as T;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Perform a PATCH request
     * @param url - API endpoint
     * @param data - Request payload
     * @param config - Axios request configuration
     */
    patch: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.patch<ApiResponseData<T>>(url, data, config);
            return response.data.data as T;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Perform a DELETE request
     * @param url - API endpoint
     * @param config - Axios request configuration
     */
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.delete<ApiResponseData<T>>(url, config);
            return response.data.data as T;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Perform a file upload request
     * @param url - API endpoint
     * @param file - File to upload
     * @param fieldName - Form field name for the file
     * @param extraData - Additional form data
     * @param onUploadProgress - Progress callback
     */
    upload: async <T>(
        url: string,
        file: File,
        fieldName = 'file',
        extraData: Record<string, any> = {},
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<T> => {
        const formData = new FormData();
        formData.append(fieldName, file);

        Object.entries(extraData).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
        });

        try {
            const response = await apiClient.post<ApiResponseData<T>>(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress,
            });
            return response.data.data as T;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Cancel a specific request
     * @param cancel - Canceler function from Axios
     */
    cancel: (cancel: Canceler) => {
        cancel('Request cancelled');
    },
};

/**
 * Initialize CSRF token on app startup
 * @returns Promise resolving to true if successful, false otherwise
 */
export const initializeCsrfToken = async (): Promise<boolean> => {
    try {
        await ensureCsrfToken();
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Check if error is an API error
 * @param error - Error to check
 */
export const isApiError = (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && 'message' in error;
};

/**
 * Handle errors with a default message
 * @param error - Error to handle
 * @param defaultMessage - Default error message
 */
export const handleError = (error: unknown, defaultMessage: string): never => {
    const apiError = handleApiError(error);
    throw new Error(apiError.message || defaultMessage);
};