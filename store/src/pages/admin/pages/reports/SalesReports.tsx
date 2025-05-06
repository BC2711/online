import React, { useState } from 'react';

type Sale = {
    id: number;
    orderNumber: string;
    customerName: string;
    date: string;
    total: number;
    status: 'completed' | 'pending' | 'cancelled';
};

const statusStyles: Record<Sale['status'], string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
};

const SalesReports: React.FC = () => {
    const [sales] = useState<Sale[]>([
        {
            id: 1,
            orderNumber: 'ORD-2023-001',
            customerName: 'Alex Johnson',
            date: '2023-05-15',
            total: 125.99,
            status: 'completed',
        },
        {
            id: 2,
            orderNumber: 'ORD-2023-002',
            customerName: 'Sarah Williams',
            date: '2023-05-14',
            total: 89.5,
            status: 'pending',
        },
        {
            id: 3,
            orderNumber: 'ORD-2023-003',
            customerName: 'Michael Brown',
            date: '2023-05-13',
            total: 45.25,
            status: 'cancelled',
        },
        {
            id: 4,
            orderNumber: 'ORD-2023-004',
            customerName: 'Emily Davis',
            date: '2023-05-12',
            total: 210.75,
            status: 'completed',
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Sale['status']>('all');

    const filteredSales = sales.filter((sale) => {
        const matchesSearch =
            sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Sales Reports</h1>
                    <p className="text-sm text-gray-500">Analyze and manage your sales data effectively.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | Sale['status'])}
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Total Sales</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(
                            sales.reduce((total, sale) => (sale.status === 'completed' ? total + sale.total : total), 0)
                        )}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Pending Orders</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {sales.filter((sale) => sale.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Cancelled Orders</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {sales.filter((sale) => sale.status === 'cancelled').length}
                    </p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                                        {sale.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sale.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sale.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        {formatCurrency(sale.total)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[sale.status]}`}
                                        >
                                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesReports;