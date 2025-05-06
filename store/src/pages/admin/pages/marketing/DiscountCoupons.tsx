import React, { useState } from 'react';
import { FiCopy, FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    validFrom: string;
    validUntil: string;
    minOrder?: number;
    usageLimit?: number;
    used: number;
}

const DiscountCoupons: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [coupons, setCoupons] = useState<Coupon[]>([
        {
            id: '1',
            code: 'SUMMER20',
            discount: 20,
            type: 'percentage',
            validFrom: '2023-06-01',
            validUntil: '2023-08-31',
            minOrder: 50,
            used: 42,
            usageLimit: 100,
        },
        {
            id: '2',
            code: 'FREESHIP',
            discount: 5,
            type: 'fixed',
            validFrom: '2023-05-01',
            validUntil: '2023-12-31',
            used: 128,
        },
        {
            id: '3',
            code: 'WELCOME10',
            discount: 10,
            type: 'percentage',
            validFrom: '2023-01-01',
            validUntil: '2023-12-31',
            used: 89,
            usageLimit: 200,
        },
    ]);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Coupon code "${code}" copied to clipboard!`);
    };

    const handleDeleteCoupon = (id: string) => {
        setCoupons(coupons.filter((coupon) => coupon.id !== id));
    };

    const filteredCoupons = coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Discount Coupons</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                    <FiPlus className="mr-2" /> Create Coupon
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {filteredCoupons.length} of {coupons.length} coupons
                    </div>
                </div>

                {/* Coupon Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Validity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="font-medium">{coupon.code}</span>
                                            <button
                                                onClick={() => handleCopyCode(coupon.code)}
                                                className="ml-2 text-gray-400 hover:text-gray-600"
                                                title="Copy code"
                                            >
                                                <FiCopy />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {coupon.type === 'percentage' ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {coupon.discount}% OFF
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                                ${coupon.discount} OFF
                                            </span>
                                        )}
                                        {coupon.minOrder && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Min. order ${coupon.minOrder}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(coupon.validFrom).toLocaleDateString()} -{' '}
                                            {new Date(coupon.validUntil).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date() > new Date(coupon.validUntil) ? (
                                                <span className="text-red-500">Expired</span>
                                            ) : new Date() < new Date(coupon.validFrom) ? (
                                                <span className="text-yellow-500">Upcoming</span>
                                            ) : (
                                                <span className="text-green-500">Active</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{
                                                    width: `${coupon.usageLimit
                                                            ? (coupon.used / coupon.usageLimit) * 100
                                                            : 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {coupon.used}
                                            {coupon.usageLimit ? `/${coupon.usageLimit}` : ''} uses
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 mr-4"
                                            title="Edit Coupon"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete Coupon"
                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Coupon Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Coupon Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800">Active Coupons</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {
                                coupons.filter(
                                    (c) =>
                                        new Date() >= new Date(c.validFrom) &&
                                        new Date() <= new Date(c.validUntil)
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800">Total Redemptions</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {coupons.reduce((sum, coupon) => sum + coupon.used, 0)}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-purple-800">Average Discount</h3>
                        <p className="text-2xl font-bold text-purple-600">
                            {coupons.length > 0
                                ? (
                                    coupons.reduce((sum, coupon) => sum + coupon.discount, 0) /
                                    coupons.length
                                ).toFixed(1)
                                : 0}
                            %
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountCoupons;