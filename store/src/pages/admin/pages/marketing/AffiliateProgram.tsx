import React from 'react';
import { FaUserFriends, FaDollarSign, FaChartLine, FaClipboardList, FaRegCreditCard } from 'react-icons/fa';

const AffiliateProgram: React.FC = () => {
    const stats = [
        { title: "Total Affiliates", value: "1,248", icon: <FaUserFriends className="text-blue-500" />, change: "+12% this month" },
        { title: "Total Earnings", value: "$48,760", icon: <FaDollarSign className="text-green-500" />, change: "+23% this month" },
        { title: "Conversion Rate", value: "3.2%", icon: <FaChartLine className="text-purple-500" />, change: "+0.4% this month" },
        { title: "Pending Payouts", value: "$12,430", icon: <FaRegCreditCard className="text-yellow-500" />, change: "Payments on 15th" },
    ];

    const topAffiliates = [
        { name: "Sarah Johnson", earnings: "$8,420", clicks: "2,145", conversion: "4.1%" },
        { name: "Michael Chen", earnings: "$6,730", clicks: "1,892", conversion: "3.8%" },
        { name: "Emma Williams", earnings: "$5,210", clicks: "1,450", conversion: "3.5%" },
        { name: "David Kim", earnings: "$4,980", clicks: "1,320", conversion: "3.2%" },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Affiliate Program</h1>
                    <p className="text-gray-600">Manage your affiliate partners and track program performance</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create New Campaign
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
                            </div>
                            <div className="text-3xl">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Program Overview */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Program Overview</h2>
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Program Status</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Commission Rate</span>
                            <span className="font-medium">15% per sale</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Cookie Duration</span>
                            <span className="font-medium">30 days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Payout</span>
                            <span className="font-medium">$50</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium mb-3 text-gray-800">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <FaClipboardList className="mr-2 text-blue-500" />
                            Generate Links
                        </button>
                        <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <FaUserFriends className="mr-2 text-green-500" />
                            Invite Affiliates
                        </button>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Affiliates</h2>
                    <div className="space-y-4">
                        {topAffiliates.map((affiliate, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                        {affiliate.name.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium">{affiliate.name}</p>
                                        <p className="text-xs text-gray-500">{affiliate.clicks} clicks</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-green-600">{affiliate.earnings}</p>
                                    <p className="text-xs text-gray-500">{affiliate.conversion} conv. rate</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All Affiliates →
                    </button>
                </div>
            </div>

            {/* Recent Payouts */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Payouts</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="pb-3 pr-6">Affiliate</th>
                                <th className="pb-3 pr-6">Date</th>
                                <th className="pb-3 pr-6">Amount</th>
                                <th className="pb-3 pr-6">Method</th>
                                <th className="pb-3 pr-6">Status</th>
                                <th className="pb-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-4 pr-6">Sarah Johnson</td>
                                <td className="py-4 pr-6">May 15, 2023</td>
                                <td className="py-4 pr-6 font-medium">$1,250.00</td>
                                <td className="py-4 pr-6">PayPal</td>
                                <td className="py-4 pr-6">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                                </td>
                                <td className="py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Details</button>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-4 pr-6">Michael Chen</td>
                                <td className="py-4 pr-6">May 15, 2023</td>
                                <td className="py-4 pr-6 font-medium">$980.00</td>
                                <td className="py-4 pr-6">Bank Transfer</td>
                                <td className="py-4 pr-6">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                                </td>
                                <td className="py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Details</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-4 pr-6">Emma Williams</td>
                                <td className="py-4 pr-6">May 14, 2023</td>
                                <td className="py-4 pr-6 font-medium">$750.00</td>
                                <td className="py-4 pr-6">PayPal</td>
                                <td className="py-4 pr-6">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                                </td>
                                <td className="py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Details</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AffiliateProgram;