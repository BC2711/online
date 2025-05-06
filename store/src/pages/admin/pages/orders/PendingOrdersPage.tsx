import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { approveOrder, cancelOrder, getOrders, Order } from '../../../../service/api/admin/orders/orders';
import { Links, Meta } from '../../../../service/interface';
import Pagination from '../../../../components/Pagination';
import {
    MagnifyingGlassIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    CreditCardIcon,
    UserCircleIcon,
    CalendarIcon,
    ArrowPathIcon,
    ShoppingBagIcon,
    FunnelIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '../../../../service/commonMethods';
import { useAuth } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';

const PendingOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [links, setLinks] = useState<Links | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);
    const { authToken } = useAuth();
    const token = authToken;
    const paymentMethodIcons = {
        credit_card: <CreditCardIcon className="h-5 w-5 text-blue-500" />,
        paypal: <div className="text-blue-500">🔵</div>,
        bank_transfer: <div className="text-green-500">🏦</div>,
    };

    const paymentMethodLabels = {
        credit_card: 'Credit Card',
        paypal: 'PayPal',
        bank_transfer: 'Bank Transfer',
    };

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const response = await getOrders(token as string, currentPage, searchTerm);
            setOrders(response.data as Order[]);
            setLinks(response.links);
            setMeta(response.meta);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleApprove = async (orderId: number) => {
        try {
            await approveOrder(token as string, orderId);
            showToast('Order approved successfully!', 'success');
            loadOrders();
        } catch (error) {
            showToast('Failed to approve order', 'error');
        }
    };

    const handleReject = async (orderId: number) => {
        try {
            await cancelOrder(token as string, orderId);
            showToast('Order rejected successfully!', 'success');
            loadOrders();
        } catch (error) {
            showToast('Failed to reject order', 'error');
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadOrders();
    };

    useEffect(() => {
        loadOrders();
    }, [searchTerm, currentPage]);


    const handlePageChange = (url: string | null) => {
        if (url) {
            const page = new URL(url).searchParams.get('page');
            setCurrentPage(Number(page));
        }
    };

    // Removed toast.configure() as it is not required

    const showToast = (message: string, type: 'success' | 'error') => {
        if (type === 'success') {
            toast.success(message, {
                position: 'top-right',
                duration: 3000,
            });
        } else if (type === 'error') {
            toast.error(message, {
                position: 'top-right',
                duration: 3000,
            });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
                        Pending Orders
                        <button
                            onClick={handleRefresh}
                            className={`p-1 text-gray-500 hover:text-gray-700 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                            disabled={isRefreshing}
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                        </button>
                    </h1>
                    <p className="text-sm text-gray-500">Review and process orders awaiting approval</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by order ID, customer..."
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-blue-600 hover:text-blue-800">
                                                #{order.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.user?.first_name} {order.user?.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(order.created_at)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {format(new Date(order.created_at), 'h:mm a')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    {order.payment_method ? (
                                                        paymentMethodIcons[order.payment_method]
                                                    ) : (
                                                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.payment_method ? paymentMethodLabels[order.payment_method] : 'N/A'}
                                                    </div>
                                                    {order.status && (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(order.total_amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(order.id)}
                                                    className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(order.id)}
                                                    className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                                                >
                                                    <XCircleIcon className="h-4 w-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <ShoppingBagIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No pending orders found</h3>
                            <p className="text-gray-500 max-w-md">
                                {searchTerm
                                    ? 'No orders match your search criteria'
                                    : 'There are currently no pending orders to review'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {orders.length > 0 && (
                <div className="mt-6">
                    <Pagination links={links} meta={meta} handlePageChange={handlePageChange} />
                </div>
            )}
        </div>
    );
};

export default PendingOrdersPage;

