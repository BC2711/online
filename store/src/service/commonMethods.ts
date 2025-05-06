import { format } from 'date-fns';

/**
 * Formats a number as currency in ZMW (Zambian Kwacha).
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZMW',
  }).format(amount);
};

/**
 * Formats a date string into a readable format (e.g., "Apr 22, 2025").
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return 'Invalid Date';
  }
};

/**
 * Extracts the page number from a URL and returns it as a number.
 * @param url - The URL containing the page query parameter.
 * @returns The page number or null if the URL is invalid.
 */
export const extractPageNumber = (url: string | null): number | null => {
  if (url) {
    const page = new URL(url).searchParams.get('page');
    return page ? Number(page) : null;
  }
  return null;
};

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token} `,
});