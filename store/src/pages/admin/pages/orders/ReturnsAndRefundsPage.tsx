import React, { useState } from 'react';
import { format } from 'date-fns';

type ReturnRefund = {
    id: number;
    orderNumber: string;
    customerName: string;
    date: string;
    returnReason: string;
    refundAmount: number;
    returnStatus: 'pending' | 'approved' | 'rejected';
    refundStatus: 'pending' | 'processed' | 'rejected';
};

const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    processed: 'bg-blue-100 text-blue-800',
};

const ReturnsAndRefundsPage: React.FC = () => {
    const [returnsRefunds, setReturnsRefunds] = useState<ReturnRefund[]>([
        {
            id: 1,
            orderNumber: 'ORD-2023-301',
            customerName: 'Alex Johnson',
            date: '2023-05-15',
            returnReason: 'Damaged item',
            refundAmount: 125.99,
            returnStatus: 'pending',
            refundStatus: 'pending',
        },
        {
            id: 2,
            orderNumber: 'ORD-2023-302',
            customerName: 'Sarah Williams',
            date: '2023-05-14',
            returnReason: 'Wrong item delivered',
            refundAmount: 89.5,
            returnStatus: 'approved',
            refundStatus: 'processed',
        },
        {
            id: 3,
            orderNumber: 'ORD-2023-303',
            customerName: 'Michael Brown',
            date: '2023-05-13',
            returnReason: 'Not satisfied with the product',
            refundAmount: 45.25,
            returnStatus: 'rejected',
            refundStatus: 'rejected',
        },
        {
            id: 4,
            orderNumber: 'ORD-2023-304',
            customerName: 'Emily Davis',
            date: '2023-05-12',
            returnReason: 'Item arrived late',
            refundAmount: 210.75,
            returnStatus: 'approved',
            refundStatus: 'processed',
        },
        // Add more mock data for testing pagination
    ]);

    const [selectedReturnRefund, setSelectedReturnRefund] = useState<ReturnRefund | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [returnStatusFilter, setReturnStatusFilter] = useState<'all' | ReturnRefund['returnStatus']>('all');
    const [refundStatusFilter, setRefundStatusFilter] = useState<'all' | ReturnRefund['refundStatus']>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const filteredReturnsRefunds = returnsRefunds.filter((item) => {
        const matchesSearch =
            item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesReturnStatus = returnStatusFilter === 'all' || item.returnStatus === returnStatusFilter;
        const matchesRefundStatus = refundStatusFilter === 'all' || item.refundStatus === refundStatusFilter;
        return matchesSearch && matchesReturnStatus && matchesRefundStatus;
    });

    const totalPages = Math.ceil(filteredReturnsRefunds.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredReturnsRefunds.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleApproveReturn = (id: number) => {
        setReturnsRefunds((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, returnStatus: 'approved', refundStatus: 'processed' } : item
            )
        );
    };

    const handleRejectReturn = (id: number) => {
        setReturnsRefunds((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, returnStatus: 'rejected', refundStatus: 'rejected' } : item
            )
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Returns & Refunds</h1>
                    <p className="text-gray-600">Manage orders that have been returned or requested for refunds.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={returnStatusFilter}
                        onChange={(e) => setReturnStatusFilter(e.target.value as 'all' | ReturnRefund['returnStatus'])}
                    >
                        <option value="all">All Return Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={refundStatusFilter}
                        onChange={(e) => setRefundStatusFilter(e.target.value as 'all' | ReturnRefund['refundStatus'])}
                    >
                        <option value="all">All Refund Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processed">Processed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Returns & Refunds Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {currentItems.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Refund</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Return Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                                            <button
                                                onClick={() => setSelectedReturnRefund(item)}
                                                className="text-left hover:underline"
                                            >
                                                {item.orderNumber}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(item.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.returnReason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">{formatCurrency(item.refundAmount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[item.returnStatus]}`}
                                            >
                                                {item.returnStatus.charAt(0).toUpperCase() + item.returnStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[item.refundStatus]}`}
                                            >
                                                {item.refundStatus.charAt(0).toUpperCase() + item.refundStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                            {item.returnStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveReturn(item.id)}
                                                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectReturn(item.id)}
                                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-500 font-medium">No matching returns or refunds found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReturnsRefunds.length)} of{' '}
                    {filteredReturnsRefunds.length} returns/refunds
                </p>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded-md ${
                            currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'
                        }`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 border rounded-md ${
                                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded-md ${
                            currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            {selectedReturnRefund && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold mb-4">Return/Refund Details: {selectedReturnRefund.orderNumber}</h2>
                                <button
                                    onClick={() => setSelectedReturnRefund(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">{selectedReturnRefund.customerName}</p>
                                        <p className="text-gray-500">Order Date: {formatDate(selectedReturnRefund.date)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Return/Refund Summary</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Return Reason:</span>
                                            <span>{selectedReturnRefund.returnReason}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Refund Amount:</span>
                                            <span>{formatCurrency(selectedReturnRefund.refundAmount)}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Return Status:</span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedReturnRefund.returnStatus]}`}
                                            >
                                                {selectedReturnRefund.returnStatus.charAt(0).toUpperCase() +
                                                    selectedReturnRefund.returnStatus.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Refund Status:</span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedReturnRefund.refundStatus]}`}
                                            >
                                                {selectedReturnRefund.refundStatus.charAt(0).toUpperCase() +
                                                    selectedReturnRefund.refundStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedReturnRefund(null)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsAndRefundsPage;
