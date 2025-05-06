import { useState, useCallback } from 'react';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { FilterTiltShiftOutlined, RefreshOutlined } from '@mui/icons-material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { CSVLink } from 'react-csv';
import { motion, AnimatePresence } from 'framer-motion';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

// Types
interface ChartDataItem {
  name: string;
  value: number;
}

interface Metric {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
}

interface Product {
  name: string;
  sales: number;
  revenue: string;
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AnalyticsPage = () => {
  // State for filters
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data (same as original for consistency)
  const salesData: ChartDataItem[] = [
    { name: 'Jan', value: 5000 },
    { name: 'Feb', value: 8000 },
    { name: 'Mar', value: 12000 },
    { name: 'Apr', value: 6000 },
    { name: 'May', value: 9500 },
    { name: 'Jun', value: 15000 },
  ];

  const revenueData: ChartDataItem[] = [
    { name: 'Electronics', value: 12000 },
    { name: 'Clothing', value: 8500 },
    { name: 'Home Goods', value: 6200 },
    { name: 'Books', value: 3400 },
    { name: 'Other', value: 2900 },
  ];

  const customerData: ChartDataItem[] = [
    { name: 'New', value: 320 },
    { name: 'Returning', value: 180 },
    { name: 'Inactive', value: 75 },
  ];

  const metrics: Metric[] = [
    {
      name: 'Total Sales',
      value: '$45,231',
      change: '+12%',
      changeType: 'increase',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      changeType: 'increase',
      icon: ChartBarIcon,
    },
    {
      name: 'Avg. Order Value',
      value: '$89.54',
      change: '+5.4%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'New Customers',
      value: '328',
      change: '-3.2%',
      changeType: 'decrease',
      icon: UsersIcon,
    },
  ];

  const topProducts: Product[] = [
    { name: 'Wireless Headphones', sales: 245, revenue: '$12,250' },
    { name: 'Smart Watch', sales: 189, revenue: '$9,450' },
    { name: 'Bluetooth Speaker', sales: 156, revenue: '$7,800' },
    { name: 'Laptop Backpack', sales: 132, revenue: '$3,960' },
    { name: 'USB-C Cable', sales: 120, revenue: '$1,200' },
  ];

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#1F2937' } },
      tooltip: { backgroundColor: '#1F2937', titleColor: '#fff', bodyColor: '#fff' },
    },
    scales: {
      x: { ticks: { color: '#1F2937' } },
      y: { ticks: { color: '#1F2937' }, beginAtZero: true },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#1F2937' } },
      tooltip: { backgroundColor: '#1F2937', titleColor: '#fff', bodyColor: '#fff' },
    },
  };

  // Chart.js data configurations
  const salesChartData = {
    labels: salesData.map((item) => item.name),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((item) => item.value),
        backgroundColor: chartType === 'bar' ? '#3B82F6' : 'transparent',
        borderColor: '#3B82F6',
        borderWidth: chartType === 'line' ? 2 : 0,
        tension: chartType === 'line' ? 0.4 : 0,
        fill: chartType === 'line',
        pointBackgroundColor: '#3B82F6',
      },
    ],
  };

  const revenueChartData = {
    labels: revenueData.map((item) => item.name),
    datasets: [
      {
        data: revenueData.map((item) => item.value),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        hoverOffset: 20,
      },
    ],
  };

  const customerChartData = {
    labels: customerData.map((item) => item.name),
    datasets: [
      {
        data: customerData.map((item) => item.value),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        hoverOffset: 20,
      },
    ],
  };

  // CSV data for export
  const csvData = [
    ['Product', 'Units Sold', 'Revenue', '% of Total'],
    ...topProducts.map((product) => [
      product.name,
      product.sales,
      product.revenue,
      `${Math.round((product.sales / 842) * 100)}%`,
    ]),
  ];

  // Handlers
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate data fetch
  }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <motion.div
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time insights into your store's performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
              aria-label="Select time range"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
              aria-label="Select category"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home Goods</option>
              <option value="books">Books</option>
            </select>
            <FilterTiltShiftOutlined className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            aria-label="Refresh data"
          >
            <RefreshOutlined className={`h-5 w-5 mr-2 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <CSVLink
            data={csvData}
            filename="top-products.csv"
            className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            aria-label="Export top products to CSV"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export
          </CSVLink>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.name}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <metric.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div
              className={`mt-4 flex items-center text-sm ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.changeType === 'increase' ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="ml-1">{metric.change} vs previous period</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-1.5 text-sm rounded-lg ${
                  chartType === 'line'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100'
                } transition-all`}
                aria-label="Show line chart"
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-1.5 text-sm rounded-lg ${
                  chartType === 'bar'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100'
                } transition-all`}
                aria-label="Show bar chart"
              >
                Bar
              </button>
            </div>
          </div>
          <div className="h-80">
            {chartType === 'line' ? (
              <Line data={salesChartData} options={chartOptions} />
            ) : (
              <Bar data={salesChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h2>
          <div className="h-80">
            <Pie data={revenueChartData} options={pieChartOptions} />
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Customer Segmentation */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Segmentation</h2>
          <div className="h-64">
            <Pie data={customerChartData} options={pieChartOptions} />
          </div>
          <div className="mt-6 space-y-3">
            {customerData.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index] }}
                ></div>
                <span className="text-sm text-gray-700">
                  {item.name}: {item.value} ({Math.round((item.value / 575) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
            <CSVLink
              data={csvData}
              filename="top-products.csv"
              className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all"
              aria-label="Export table to CSV"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              Export
            </CSVLink>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => alert(`View details for ${product.name}`)} // Placeholder for row click action
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.sales}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.round((product.sales / 842) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;