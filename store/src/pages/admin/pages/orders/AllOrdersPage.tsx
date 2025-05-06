import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
// import { getOrders, Links, Meta, Order } from '../../../../service/api/admin/orders/orders';
import { useAuth } from '../../../../context/AuthContext';
import Modal from 'react-modal';
import Pagination from '../../../../components/Pagination';
import { formatCurrency, formatDate } from '../../../../service/commonMethods';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  PhotoIcon,
  PrinterIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { RefreshCwIcon } from 'lucide-react';
import { getOrders, Order } from '../../../../service/api/admin/orders/orders';
import { Links, Meta } from '../../../../service/interface';

// Status styles configuration
const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AllOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { authToken } = useAuth();
  const [links, setLinks] = useState<Links | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (page: number, search: string, status: string) => {
    setLoading(true);
    try {
      const token = authToken;
      const response = await getOrders(token as string, page, search);
      if (response) {
        const filteredData =
          status === 'all'
            ? (response.data as Order[])
            : (response.data as Order[]).filter((order: Order) => order.status === status);
        setOrders(filteredData);
        setLinks(response.links);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handlePageChange = (url: string | null) => {
    if (url) {
      const page = new URL(url).searchParams.get('page');
      setCurrentPage(Number(page));
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(currentPage, searchTerm, statusFilter);
  };

  const handleOrderAction = (orderId: number) => {
    // Handle order action (e.g., update, cancel, etc.)
    console.log(`Order action for order ID: ${orderId}`);
  }

  const totalBalance = (
    total_amount: number = 0,
    shipping_amount: number = 0,
    tax_amount: number = 0
  ): string => {
    const total = formatCurrency(total_amount + shipping_amount + tax_amount);
    return total;
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            Order Management
            <button
              onClick={handleRefresh}
              className={`p-1 text-gray-500 hover:text-gray-700 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
              disabled={isRefreshing}
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </h1>
          <p className="text-sm text-gray-500">Manage and track all customer orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID, customer..."
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

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
            >
              <option value="all">All Statuses</option>
              {Object.keys(statusStyles).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-blue-600 hover:text-blue-800">
                        #{order.tracking_number || order.id}
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
                          <div className="text-sm text-gray-500 truncate max-w-xs">
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
                        {format(order.created_at, 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[order.status]}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <span>Details</span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBagIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                      <p className="text-gray-500 max-w-md">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your search or filter criteria'
                          : 'There are currently no orders in the system'}
                      </p>
                      {(searchTerm || statusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                          }}
                          className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {links && meta  && (
        <div className="mt-6">
          <Pagination links={links} meta={meta} handlePageChange={handlePageChange} />
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onRequestClose={closeModal}
        className="modal-content bg-white p-0 rounded-xl shadow-2xl w-full max-w-5xl mx-4 sm:mx-auto my-8 sm:my-20 border border-gray-200 overflow-hidden"
        overlayClassName="fixed inset-0 bg-black/30 flex justify-center items-center backdrop-blur-sm transition-all duration-300 ease-out z-50"
        closeTimeoutMS={300}
        ariaHideApp={true}
        shouldCloseOnOverlayClick={true}
        appElement={document.getElementById('root') as HTMLElement}
      >
        {selectedOrder && (
          <div className="divide-y divide-gray-200 h-full flex flex-col max-h-[90vh]">
            {/* Header Section */}
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
                      Order #{selectedOrder.tracking_number || selectedOrder.id}
                    </h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedOrder.status]} shadow-sm`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Placed on {formatDate(selectedOrder.created_at)}
                    </p>
                    {selectedOrder.updated_at !== selectedOrder.created_at && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <RefreshCwIcon className="h-4 w-4" />
                        Updated {formatDate(selectedOrder.updated_at)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors p-1 rounded-full"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Main Content - Scrollable Area */}
            <div className="overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                {/* Left Column - Customer Info */}
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <UserCircleIcon className="h-4 w-4" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {selectedOrder.user?.first_name} {selectedOrder.user?.last_name}
                        </p>
                      </div>
                      {selectedOrder.user?.email && (
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <a
                            href={`mailto:${selectedOrder.user.email}`}
                            className="font-medium text-indigo-600 hover:text-indigo-800 mt-1 block"
                          >
                            {selectedOrder.user.email}
                          </a>
                        </div>
                      )}
                      {selectedOrder.user?.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <a
                            href={`tel:${selectedOrder.user.phone}`}
                            className="font-medium text-gray-900 mt-1 block"
                          >
                            {selectedOrder.user.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${selectedOrder.payment_method === 'credit_card'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-green-50 text-green-600'
                          }`}>
                          {selectedOrder.payments.payment_method === 'credit_card' ? (
                            <CreditCardIcon className="h-5 w-5" />
                          ) : (
                            <BanknotesIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 capitalize">
                            {selectedOrder.payment_method?.replace('_', ' ') || 'Not specified'}
                          </p>
                          {selectedOrder.payments.status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedOrder.payments.payment_method === 'credit_card'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {selectedOrder.payments.status}
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedOrder.payments.created_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paid on {formatDate(selectedOrder.payments.created_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <TruckIcon className="h-4 w-4" />
                      Shipping Information
                    </h3>
                    {selectedOrder.shipping_info.address_type ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900 font-medium">{selectedOrder.shipping_info.street_address1}</p>
                        <p className="text-sm text-gray-700">{selectedOrder.shipping_info.street_address1}</p>
                        {selectedOrder.shipping_info.street_address1 && (
                          <p className="text-sm text-gray-700">{selectedOrder.shipping_info.street_address1}</p>
                        )}
                        <p className="text-sm text-gray-700">
                          {selectedOrder.shipping_info.city}, {selectedOrder.shipping_info.state} {selectedOrder.shipping_info.postal_code}
                        </p>
                        <p className="text-sm text-gray-700">{selectedOrder.shipping_info.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No shipping information available</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                      Order Notes
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {selectedOrder.notes ? (
                        <p className="text-sm text-gray-700 whitespace-pre-line">{selectedOrder.notes}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No special instructions</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Items & Summary */}
                <div className="p-6 lg:col-span-2 bg-gray-50">
                  {/* Order Items */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                      <RectangleStackIcon className="h-4 w-4" />
                      Order Items ({selectedOrder.order_items?.length || 0})
                    </h3>
                    <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                      {selectedOrder.order_items?.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                  <PhotoIcon className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {item.product?.name || 'Unknown Product'}
                                </h4>
                                <p className="font-medium text-gray-900 ml-2 whitespace-nowrap">
                                  {formatCurrency(item.unit_price)}
                                </p>
                              </div>
                              {item.product?.sku && (
                                <p className="text-xs text-gray-500 mt-1">SKU: {item.product.sku}</p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">Qty: {item.quantity}</span>
                                  {/* {item.variant && (
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                      {item.variant}
                                    </span>
                                  )} */}
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(item.unit_price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                      <ClipboardDocumentListIcon className="h-4 w-4" />
                      Order Summary
                    </h3>
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm text-gray-900">{formatCurrency(selectedOrder.subtotal || selectedOrder.total_amount)}</span>
                      </div>

                      {selectedOrder.discount_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Discount</span>
                          <span className="text-sm text-red-600">-{formatCurrency(selectedOrder.discount_amount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm text-gray-900">
                          {selectedOrder.shipping_amount > 0
                            ? formatCurrency(selectedOrder.shipping_amount)
                            : <span className="text-green-600">Free</span>}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax</span>
                        <span className="text-sm text-gray-900">{formatCurrency(selectedOrder.tax_amount)}</span>
                      </div>

                      <div className="pt-3 border-t border-gray-200 mt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Total</span>
                          <span className="font-medium text-gray-900">
                            {
                              totalBalance(Number(selectedOrder.total_amount), Number(selectedOrder.shipping_amount), Number(selectedOrder.tax_amount))
                            }</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <InformationCircleIcon className="h-4 w-4" />
                <span>Order ID: {selectedOrder.id}</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center gap-2 text-sm"
                >
                  <PrinterIcon className="h-4 w-4" />
                  Print Receipt
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center gap-2 text-sm"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to Orders
                </button>
                {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                  <button
                    // onClick={() => handleOrderAction(selectedOrder.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2 text-sm"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Update Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllOrdersPage;