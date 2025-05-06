import React, { useState } from 'react';
import { format } from 'date-fns';

type Order = {
    id: number;
    orderNumber: string;
    customerName: string;
    date: string;
    deliveryDate: string;
    total: number;
    items: number;
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
    status: 'delivered' | 'returned' | 'refunded';
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

const statusStyles = {
    delivered: 'bg-green-100 text-green-800',
    returned: 'bg-yellow-100 text-yellow-800',
    refunded: 'bg-red-100 text-red-800',
};

const CompletedOrdersPage: React.FC = () => {
    const [orders] = useState<Order[]>([
        {
            id: 1,
            orderNumber: 'ORD-2023-105',
            customerName: 'Alex Johnson',
            date: '2023-05-10',
            deliveryDate: '2023-05-15',
            total: 125.99,
            items: 3,
            paymentMethod: 'credit_card',
            status: 'delivered',
        },
        {
            id: 2,
            orderNumber: 'ORD-2023-106',
            customerName: 'Sarah Williams',
            date: '2023-05-09',
            deliveryDate: '2023-05-14',
            total: 89.5,
            items: 2,
            paymentMethod: 'paypal',
            status: 'delivered',
        },
        {
            id: 3,
            orderNumber: 'ORD-2023-107',
            customerName: 'Michael Brown',
            date: '2023-05-08',
            deliveryDate: '2023-05-12',
            total: 45.25,
            items: 1,
            paymentMethod: 'bank_transfer',
            status: 'returned',
        },
        {
            id: 4,
            orderNumber: 'ORD-2023-108',
            customerName: 'Emily Davis',
            date: '2023-05-07',
            deliveryDate: '2023-05-11',
            total: 210.75,
            items: 5,
            paymentMethod: 'credit_card',
            status: 'refunded',
        },
        // Add more mock orders for testing pagination
    ]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
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

    const getStatusLabel = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'Delivered';
            case 'returned': return 'Returned';
            case 'refunded': return 'Refunded';
            default: return '';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Completed Orders</h1>
                    <p className="text-gray-600">View all fulfilled orders and their status</p>
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
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | Order['status'])}
                    >
                        <option value="all">All Statuses</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                        <option value="refunded">Refunded</option>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.customerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(order.deliveryDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="mr-2">{paymentMethodIcons[order.paymentMethod]}</span>
                                            {paymentMethodLabels[order.paymentMethod]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Details
                                            </button>
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
                                    <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Order Date:</span>
                                            <span>{formatDate(selectedOrder.date)}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Delivery Date:</span>
                                            <span>{formatDate(selectedOrder.deliveryDate)}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Payment Method:</span>
                                            <span>
                                                {paymentMethodIcons[selectedOrder.paymentMethod]}
                                                {paymentMethodLabels[selectedOrder.paymentMethod]}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedOrder.status]}`}>
                                                {getStatusLabel(selectedOrder.status)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                                            <span>Total Amount:</span>
                                            <span>{formatCurrency(selectedOrder.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedOrder(null)}
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

export default CompletedOrdersPage;