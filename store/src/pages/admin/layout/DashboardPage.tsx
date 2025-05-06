import React from 'react';
import {
    Card,
    Typography,
    Progress,
    Button,
    IconButton,
} from '@material-tailwind/react';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    ChartBarIcon,
} from '@heroicons/react/24/solid';

const stats = [
    {
        icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />,
        title: 'Total Revenue',
        value: '$34,245',
        change: '+12%',
        trend: 'up',
    },
    {
        icon: <ShoppingCartIcon className="h-6 w-6 text-green-500" />,
        title: 'Total Orders',
        value: '1,245',
        change: '+8%',
        trend: 'up',
    },
    {
        icon: <UserGroupIcon className="h-6 w-6 text-purple-500" />,
        title: 'New Customers',
        value: '124',
        change: '-2%',
        trend: 'down',
    },
    {
        icon: <ChartBarIcon className="h-6 w-6 text-amber-500" />,
        title: 'Conversion Rate',
        value: '3.42%',
        change: '+0.5%',
        trend: 'up',
    },
];

const recentOrders = [
    {
        id: '#12345',
        customer: 'John Smith',
        date: '2023-05-15',
        amount: '$125.00',
        status: 'Delivered',
    },
    {
        id: '#12346',
        customer: 'Sarah Johnson',
        date: '2023-05-14',
        amount: '$89.99',
        status: 'Shipped',
    },
    {
        id: '#12347',
        customer: 'Michael Brown',
        date: '2023-05-14',
        amount: '$245.50',
        status: 'Processing',
    },
    {
        id: '#12348',
        customer: 'Emily Davis',
        date: '2023-05-13',
        amount: '$67.30',
        status: 'Delivered',
    },
    {
        id: '#12349',
        customer: 'Robert Wilson',
        date: '2023-05-12',
        amount: '$199.99',
        status: 'Shipped',
    },
];

export const DashboardPage: React.FC = () => {
    return (

        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-blue-50">{stat.icon}</div>
                            <Typography
                                variant="small"
                                color={stat.trend === 'up' ? 'success' : 'warning'}
                                className="flex items-center"
                            >
                                {stat.change}
                                {stat.trend === 'up' ? (
                                    <ArrowUpIcon className="h-4 w-4 ml-1" />
                                ) : (
                                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </Typography>
                        </div>
                        <Typography variant="h5" className="mb-1">
                            {stat.value}
                        </Typography>
                        <Typography variant="small" color="primary">
                            {stat.title}
                        </Typography>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <Card className="p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <Typography variant="h6">Sales Overview</Typography>
                        <Button variant="outline" size="sm">
                            View Report
                        </Button>
                    </div>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Typography color="warning">Sales Chart Placeholder</Typography>
                    </div>
                </Card>

                {/* Progress */}
                <Card className="p-6 shadow-sm">
                    <Typography variant="h6" className="mb-6">
                        Goals Progress
                    </Typography>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Typography variant="small">Monthly Revenue</Typography>
                                <Typography variant="small">$12,345 / $15,000</Typography>
                            </div>
                            <Progress value={82.3} color="primary" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Typography variant="small">New Customers</Typography>
                                <Typography variant="small">82 / 100</Typography>
                            </div>
                            <Progress value={82} color="success" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Typography variant="small">Order Completion</Typography>
                                <Typography variant="small">245 / 300</Typography>
                            </div>
                            <Progress value={81.6} color="secondary" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <Typography variant="h6">Recent Orders</Typography>
                    <Button variant="gradient" size="sm">
                        View All
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto">
                        <thead>
                            <tr>
                                <th className="text-left p-4">
                                    <Typography variant="small" color="primary">
                                        Order ID
                                    </Typography>
                                </th>
                                <th className="text-left p-4">
                                    <Typography variant="small" color="primary">
                                        Customer
                                    </Typography>
                                </th>
                                <th className="text-left p-4">
                                    <Typography variant="small" color="primary">
                                        Date
                                    </Typography>
                                </th>
                                <th className="text-left p-4">
                                    <Typography variant="small" color="primary">
                                        Amount
                                    </Typography>
                                </th>
                                <th className="text-left p-4">
                                    <Typography variant="small" color="primary">
                                        Status
                                    </Typography>
                                </th>
                                <th className="text-left p-4">
                                    <Typography variant="small" color="primary">
                                        Action
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <Typography variant="small">{order.id}</Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small">{order.customer}</Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small">{order.date}</Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small">{order.amount}</Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            color={
                                                order.status === 'Delivered'
                                                    ? 'success'
                                                    : order.status === 'Shipped'
                                                        ? 'primary'
                                                        : 'infol'
                                            }
                                        >
                                            {order.status}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <IconButton variant="gradient" size="sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                                />
                                            </svg>
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>

    );
};