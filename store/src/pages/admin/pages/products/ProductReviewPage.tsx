import React, { useState, useMemo, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Review = {
    id: number;
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
};

const ITEMS_PER_PAGE = 5;

const ProductReviewPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            reviewer: 'Jane Doe',
            rating: 5,
            comment: 'Great quality product, arrived on time!',
            date: '2025-04-10',
            status: 'approved',
        },
        {
            id: 2,
            reviewer: 'John Smith',
            rating: 3,
            comment: 'Okay product, but shipping took too long.',
            date: '2025-04-09',
            status: 'pending',
        },
        {
            id: 3,
            reviewer: 'Alice Lee',
            rating: 4,
            comment: 'Loved it, would buy again.',
            date: '2025-04-08',
            status: 'approved',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<keyof Review>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleApprove = useCallback((id: number) => {
        setReviews((prev) =>
            prev.map((review) =>
                review.id === id ? { ...review, status: 'approved' } : review
            )
        );
        toast.success('Review approved');
    }, []);

    const handleReject = useCallback((id: number) => {
        setReviews((prev) =>
            prev.map((review) =>
                review.id === id ? { ...review, status: 'rejected' } : review
            )
        );
        toast.success('Review rejected');
    }, []);

    const handleDelete = useCallback((id: number) => {
        setReviews((prev) => prev.filter((review) => review.id !== id));
        toast.success('Review deleted');
    }, []);

    const toggleSort = (field: keyof Review) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1); // Reset to first page on sort change
    };

    const filteredAndSortedReviews = useMemo(() => {
        return reviews
            .filter(
                (review) =>
                    (statusFilter === 'all' || review.status === statusFilter) &&
                    (review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        review.comment.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            });
    }, [reviews, searchTerm, sortField, sortDirection, statusFilter]);

    const paginatedReviews = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedReviews.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAndSortedReviews, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedReviews.length / ITEMS_PER_PAGE);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Product Reviews</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by reviewer or comment..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Search reviews"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Filter by status"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    { key: 'reviewer', label: 'Reviewer' },
                                    { key: 'rating', label: 'Rating' },
                                    { key: 'comment', label: 'Comment' },
                                    { key: 'date', label: 'Date' },
                                    { key: 'status', label: 'Status' },
                                ].map((header) => (
                                    <th
                                        key={header.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => toggleSort(header.key as keyof Review)}
                                    >
                                        {header.label}
                                        {sortField === header.key && (
                                            <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                                        )}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {paginatedReviews.length > 0 ? (
                                    paginatedReviews.map((review) => (
                                        <motion.tr
                                            key={review.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {review.reviewer}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-yellow-400">
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </span>
                                                    <span className="ml-2 text-gray-500 text-sm">
                                                        ({review.rating}/5)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p
                                                    className="text-gray-700 truncate hover:text-clip hover:whitespace-normal"
                                                    title={review.comment}
                                                >
                                                    {review.comment}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {formatDate(review.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold leading-4 ${review.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : review.status === 'rejected'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {review.status.charAt(0).toUpperCase() +
                                                        review.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                                {review.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(review.id)}
                                                            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                            aria-label={`Approve review by ${review.reviewer}`}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(review.id)}
                                                            className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                                            aria-label={`Reject review by ${review.reviewer}`}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    aria-label={`Delete review by ${review.reviewer}`}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No reviews found
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedReviews.length)}{' '}
                        of {filteredAndSortedReviews.length} reviews
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            aria-label="Previous page"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 text-sm rounded-lg ${currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                aria-label={`Page ${page}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductReviewPage;