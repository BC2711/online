import React, { useState } from 'react';

type InventoryItem = {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock: number;
    status: 'in_stock' | 'out_of_stock' | 'low_stock';
};

const statusStyles: Record<InventoryItem['status'], string> = {
    in_stock: 'bg-green-100 text-green-800',
    out_of_stock: 'bg-red-100 text-red-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
};

const InventoryReports: React.FC = () => {
    const [inventory] = useState<InventoryItem[]>([
        {
            id: 1,
            name: 'Product A',
            sku: 'SKU-001',
            category: 'Category 1',
            stock: 50,
            status: 'in_stock',
        },
        {
            id: 2,
            name: 'Product B',
            sku: 'SKU-002',
            category: 'Category 2',
            stock: 0,
            status: 'out_of_stock',
        },
        {
            id: 3,
            name: 'Product C',
            sku: 'SKU-003',
            category: 'Category 1',
            stock: 5,
            status: 'low_stock',
        },
        {
            id: 4,
            name: 'Product D',
            sku: 'SKU-004',
            category: 'Category 3',
            stock: 100,
            status: 'in_stock',
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | InventoryItem['status']>('all');

    const filteredInventory = inventory.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Inventory Reports</h1>
                    <p className="text-sm text-gray-500">Monitor and manage your inventory effectively.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | InventoryItem['status'])}
                    >
                        <option value="all">All Statuses</option>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="low_stock">Low Stock</option>
                    </select>
                </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Total Items</h2>
                    <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">In Stock</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {inventory.filter((item) => item.status === 'in_stock').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-700">Out of Stock</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        {inventory.filter((item) => item.status === 'out_of_stock').length}
                    </p>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{item.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}
                                        >
                                            {item.status.replace('_', ' ').toUpperCase()}
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

export default InventoryReports;