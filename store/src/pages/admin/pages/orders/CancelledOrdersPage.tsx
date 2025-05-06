import React, { useState } from 'react';
import { format } from 'date-fns';

type Order = {
    id: number;
    orderNumber: string;
    customerName: string;
    date: string;
    cancelledDate: string;
    total: number;
    items: number;
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
    cancelledBy: 'customer' | 'admin' | 'system';
    reason?: string;
};

const paymentMethodIcons = {
    credit_card: '💳',
    paypal: '🔵',
    bank_transfer: '🏦',
};

const paymentMethodLabels = {
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer',
};

const cancelledByStyles = {
    customer: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
    system: 'bg-gray-100 text-gray-800',
};

const CancelledOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 1,
            orderNumber: 'ORD-2023-201',
            customerName: 'Alex Johnson',
            date: '2023-05-15',
            cancelledDate: '2023-05-16',
            total: 125.99,
            items: 3,
            paymentMethod: 'credit_card',
            cancelledBy: 'customer',
            reason: 'Changed mind',
        },
        {
            id: 2,
            orderNumber: 'ORD-2023-202',
            customerName: 'Sarah Williams',
            date: '2023-05-14',
            cancelledDate: '2023-05-14',
            total: 89.5,
            items: 2,
            paymentMethod: 'paypal',
            cancelledBy: 'admin',
            reason: 'Fraud detected',
        },
        {
            id: 3,
            orderNumber: 'ORD-2023-203',
            customerName: 'Michael Brown',
            date: '2023-05-13',
            cancelledDate: '2023-05-15',
            total: 45.25,
            items: 1,
            paymentMethod: 'bank_transfer',
            cancelledBy: 'system',
            reason: 'Payment failed',
        },
        {
            id: 4,
            orderNumber: 'ORD-2023-204',
            customerName: 'Emily Davis',
            date: '2023-05-12',
            cancelledDate: '2023-05-12',
            total: 210.75,
            items: 5,
            paymentMethod: 'credit_card',
            cancelledBy: 'customer',
            reason: 'Found better price',
        },
        // Add more mock orders for testing pagination
    ]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cancelledByFilter, setCancelledByFilter] = useState<'all' | Order['cancelledBy']>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCancelledBy = cancelledByFilter === 'all' || order.cancelledBy === cancelledByFilter;
        return matchesSearch && matchesCancelledBy;
    });

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

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

    const handleRestoreOrder = (orderId: number) => {
        setOrders(orders.filter(order => order.id !== orderId));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cancelled Orders</h1>
                    <p className="text-gray-600">Review orders that were cancelled by customers, admin, or system</p>
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
                        value={cancelledByFilter}
                        onChange={(e) => setCancelledByFilter(e.target.value as 'all' | Order['cancelledBy'])}
                    >
                        <option value="all">All Types</option>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="system">System</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {currentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled By</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-left hover:underline"
                                            >
                                                {order.orderNumber}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(order.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(order.cancelledDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="mr-2">{paymentMethodIcons[order.paymentMethod]}</span>
                                            {paymentMethodLabels[order.paymentMethod]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">{formatCurrency(order.total)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${cancelledByStyles[order.cancelledBy]}`}
                                            >
                                                {order.cancelledBy.charAt(0).toUpperCase() + order.cancelledBy.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Details
                                            </button>
                                            {order.cancelledBy !== 'customer' && (
                                                <button
                                                    onClick={() => handleRestoreOrder(order.id)}
                                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                                >
                                                    Restore
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-500 font-medium">No matching orders found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of{' '}
                    {filteredOrders.length} orders
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

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold mb-4">Order Details: {selectedOrder.orderNumber}</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">{selectedOrder.customerName}</p>
                                        <p className="text-gray-500">Customer ID: CUST-{selectedOrder.id.toString().padStart(4, '0')}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Cancellation Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Order Date:</span>
                                            <span>{formatDate(selectedOrder.date)}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Cancelled Date:</span>
                                            <span>{formatDate(selectedOrder.cancelledDate)}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Cancelled By:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cancelledByStyles[selectedOrder.cancelledBy]}`}>
                                                {selectedOrder.cancelledBy.charAt(0).toUpperCase() + selectedOrder.cancelledBy.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Payment Method:</span>
                                            <span>
                                                {paymentMethodIcons[selectedOrder.paymentMethod]}
                                                {paymentMethodLabels[selectedOrder.paymentMethod]}
                                            </span>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <p className="text-gray-500">Reason:</p>
                                            <p className="font-medium">{selectedOrder.reason || 'No reason provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500">Items:</span>
                                        <span>{selectedOrder.items}</span>
                                    </div>
                                    <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                                        <span>Total Amount:</span>
                                        <span>{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {selectedOrder.cancelledBy !== 'customer' && (
                                    <button
                                        onClick={() => {
                                            handleRestoreOrder(selectedOrder.id);
                                            setSelectedOrder(null);
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                        Restore Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancelledOrdersPage;