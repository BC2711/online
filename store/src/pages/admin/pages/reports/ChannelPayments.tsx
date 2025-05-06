import React from 'react';
import { FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChannelPayments: React.FC = () => {
    // Sample data for the chart
    const paymentData = [
        { name: 'Jan', total: 4000, processed: 2400 },
        { name: 'Feb', total: 3000, processed: 1398 },
        { name: 'Mar', total: 2000, processed: 9800 },
        { name: 'Apr', total: 2780, processed: 3908 },
        { name: 'May', total: 1890, processed: 4800 },
        { name: 'Jun', total: 2390, processed: 3800 },
    ];

    // Recent transactions data
    const transactions = [
        { id: '#PAY-2841', channel: 'Amazon', amount: '$1,250.00', date: 'Jun 15, 2023', status: 'completed', icon: <FiCheckCircle className="text-green-500" /> },
        { id: '#PAY-2840', channel: 'eBay', amount: '$980.50', date: 'Jun 14, 2023', status: 'completed', icon: <FiCheckCircle className="text-green-500" /> },
        { id: '#PAY-2839', channel: 'Walmart', amount: '$2,450.00', date: 'Jun 12, 2023', status: 'processing', icon: <FiClock className="text-yellow-500" /> },
        { id: '#PAY-2838', channel: 'Shopify', amount: '$1,780.25', date: 'Jun 10, 2023', status: 'completed', icon: <FiCheckCircle className="text-green-500" /> },
        { id: '#PAY-2837', channel: 'Etsy', amount: '$850.75', date: 'Jun 8, 2023', status: 'failed', icon: <FiAlertCircle className="text-red-500" /> },
    ];

    // Payment summary stats
    const stats = [
        { title: "Total Processed", value: "$48,760", change: "+12% from last month", icon: <FiDollarSign className="text-blue-500" /> },
        { title: "Pending Payments", value: "$12,430", change: "5 payments waiting", icon: <FiClock className="text-yellow-500" /> },
        { title: "Avg. Processing Time", value: "2.4 days", change: "Faster than last month", icon: <FiTrendingUp className="text-green-500" /> },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Channel Payments</h1>
                    <p className="text-gray-600">Track and manage all your marketplace channel payments</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <FiDollarSign className="mr-2" />
                    Process Payout
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

            {/* Payment Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Payment Trends</h2>
                    <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                        <option>Last Quarter</option>
                    </select>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={paymentData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#3B82F6" name="Total Payments" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="processed" fill="#10B981" name="Processed" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.channel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {transaction.icon}
                                            <span className="ml-2 text-sm capitalize">{transaction.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                        <button className="text-gray-600 hover:text-gray-900">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> transactions
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border rounded-md text-sm font-medium">Previous</button>
                        <button className="px-3 py-1 border rounded-md bg-blue-600 text-white text-sm font-medium">Next</button>
                    </div>
                </div>
            </div>

            {/* Channel Performance */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Channel Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Amazon', 'eBay', 'Walmart', 'Shopify'].map((channel, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-gray-800 mb-3">{channel}</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 text-sm">Total Revenue</span>
                                <span className="font-medium">${(Math.random() * 10000).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 text-sm">Fees</span>
                                <span className="text-red-500">-${(Math.random() * 1000).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Net Payout</span>
                                <span className="font-medium text-green-600">${(Math.random() * 9000).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChannelPayments;