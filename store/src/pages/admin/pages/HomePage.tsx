import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Metric {
    name: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface Order {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: 'Completed' | 'Processing' | 'Shipped' | 'Pending';
}

interface QuickAction {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    link: string;
}

interface Activity {
    id: number;
    action: string;
    time: string;
}

// SVG Icon Components
const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowTrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const HomePageAdmin: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    const metrics: Metric[] = [
        {
            name: 'Total Revenue',
            value: '$45,231',
            change: '+12%',
            changeType: 'increase',
            icon: CurrencyDollarIcon,
        },
        {
            name: 'Total Orders',
            value: '1,234',
            change: '+5.4%',
            changeType: 'increase',
            icon: ShoppingBagIcon,
        },
        {
            name: 'New Customers',
            value: '328',
            change: '-3.2%',
            changeType: 'decrease',
            icon: UserIcon,
        },
        {
            name: 'Conversion Rate',
            value: '3.2%',
            change: '+0.8%',
            changeType: 'increase',
            icon: ChartBarIcon,
        },
    ];

    const recentOrders: Order[] = [
        { id: '#1001', customer: 'John Smith', date: '2023-06-12', amount: '$125.00', status: 'Completed' },
        { id: '#1002', customer: 'Sarah Johnson', date: '2023-06-11', amount: '$89.99', status: 'Processing' },
        { id: '#1003', customer: 'Michael Brown', date: '2023-06-10', amount: '$234.50', status: 'Shipped' },
        { id: '#1004', customer: 'Emily Davis', date: '2023-06-09', amount: '$65.25', status: 'Completed' },
        { id: '#1005', customer: 'Robert Wilson', date: '2023-06-08', amount: '$189.99', status: 'Pending' },
    ];

    const quickActions: QuickAction[] = [
        { name: 'Add Product', icon: ShoppingBagIcon, link: '/admin/product/create' },
        { name: 'Process Orders', icon: ClockIcon, link: '/admin/orders/pending' },
        { name: 'View Analytics', icon: ArrowTrendingUpIcon, link: '/admin/analytics' },
        { name: 'Manage Inventory', icon: ChartBarIcon, link: '/admin/product/inventory' },
    ];

    const activities: Activity[] = [
        { id: 1, action: 'New order #1005 received', time: '5 min ago' },
        { id: 2, action: 'Product "Wireless Headphones" stock low', time: '1 hour ago' },
        { id: 3, action: 'Customer review received', time: '3 hours ago' },
        { id: 4, action: 'New customer registration', time: '1 day ago' },
        { id: 5, action: 'Order #1002 shipped', time: '2 days ago' },
    ];

    useEffect(() => {
        const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Sales Trend' },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    },
                    x: {
                        grid: { display: false },
                    },
                },
            },
        });

        return () => chart.destroy();
    }, [timeRange]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <div className="text-sm text-gray-500">
                        Updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric) => (
                    <div
                        key={metric.name}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                                <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-full">
                                <metric.icon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className={`mt-4 flex items-center text-sm ${metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.changeType === 'increase' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                            <span className="ml-2">{metric.change} vs last period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart and Recent Orders */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
                        <canvas id="salesChart" className="w-full h-64"></canvas>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">{order.id}</a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 text-right">
                            <a href="/admin/orders/all-orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                View all orders →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-6">
                            {quickActions.map((action) => (
                                <a
                                    key={action.name}
                                    href={action.link}
                                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                >
                                    <action.icon className="h-8 w-8 text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 text-center">{action.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {activities.map((activity) => (
                                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 text-right">
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                View all activity →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageAdmin;