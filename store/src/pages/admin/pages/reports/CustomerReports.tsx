import React, { useState } from 'react';

type Customer = {
    id: number;
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
    lastPurchase: string;
    status: 'active' | 'inactive' | 'new';
};

const statusStyles: Record<Customer['status'], string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    new: 'bg-blue-100 text-blue-800',
};

const CustomerReports: React.FC = () => {
    const [customers] = useState<Customer[]>([
        {
            id: 1,
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            orders: 5,
            totalSpent: 1250.99,
            lastPurchase: '2023-05-15',
            status: 'active',
        },
        {
            id: 2,
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            orders: 3,
            totalSpent: 899.5,
            lastPurchase: '2023-05-14',
            status: 'inactive',
        },
        {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            orders: 1,
            totalSpent: 199.99,
            lastPurchase: '2023-05-13',
            status: 'new',
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            orders: 0,
            totalSpent: 0,
            lastPurchase: '',
            status: 'inactive',
        },
        // Add more mock customers for testing pagination
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Customer['status']>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 2;

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    const startIndex = (currentPage - 1) * customersPerPage;
    const currentCustomers = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customer Reports</h1>
                    <p className="text-sm text-gray-500">Analyze and manage customer data effectively.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | Customer['status'])}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="new">New</option>
                    </select>
                </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Total Customers</h2>
                    <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Active Customers</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {customers.filter((customer) => customer.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">New Customers</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {customers.filter((customer) => customer.status === 'new').length}
                    </p>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orders
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Spent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Purchase
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{customer.orders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        ${customer.totalSpent.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {customer.lastPurchase || 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[customer.status]}`}
                                        >
                                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + customersPerPage, filteredCustomers.length)} of{' '}
                    {filteredCustomers.length} customers
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
        </div>
    );
};

export default CustomerReports;