import React, { useState } from 'react';
import {
    // DownloadIcon,
    // FilterIcon,
    CalendarIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { DownloadIcon, FilterIcon } from 'lucide-react';
// import { TaxReportData, TaxReportFilters } from '@/types/reports';

export interface TaxReportData {
    id: string;
    period: string;
    filingDate: string;
    status: 'Filed' | 'Pending' | 'Overdue';
    amount: number;
    taxType: string;
}

export interface TaxReportFilters {
    taxType: string;
    status: string;
    year: string;
}
// Mock data - replace with API calls in a real application
const mockTaxReports: TaxReportData[] = [
    {
        id: '1',
        period: 'Q1 2023',
        filingDate: '2023-04-15',
        status: 'Filed',
        amount: 12500.75,
        taxType: 'Income Tax'
    },
    {
        id: '2',
        period: 'Q2 2023',
        filingDate: '2023-07-20',
        status: 'Filed',
        amount: 14320.5,
        taxType: 'Income Tax'
    },
    {
        id: '3',
        period: 'Q3 2023',
        filingDate: '2023-10-15',
        status: 'Pending',
        amount: 11875.25,
        taxType: 'Sales Tax'
    },
    {
        id: '4',
        period: 'Q4 2023',
        filingDate: '2024-01-18',
        status: 'Overdue',
        amount: 16200.0,
        taxType: 'Income Tax'
    },
];

const TaxReports: React.FC = () => {
    const [filters, setFilters] = useState<TaxReportFilters>({
        taxType: '',
        status: '',
        year: new Date().getFullYear().toString(),
    });
    const [selectedReport, setSelectedReport] = useState<TaxReportData | null>(null);

    const filteredReports = mockTaxReports.filter(report => {
        return (
            (!filters.taxType || report.taxType === filters.taxType) &&
            (!filters.status || report.status === filters.status) &&
            report.period.includes(filters.year)
        );
    });

    const totalAmount = filteredReports.reduce((sum, report) => sum + report.amount, 0);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const downloadReport = (reportId: string) => {
        // In a real app, this would trigger an API call or file download
        console.log(`Downloading report ${reportId}`);
        alert(`Downloading report ${reportId}`);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tax Reports</h1>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <ChartBarIcon className="h-5 w-5 mr-2" />
                        Generate Summary
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-600">Filters:</span>
                    </div>
                    <select
                        name="taxType"
                        value={filters.taxType}
                        onChange={handleFilterChange}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">All Tax Types</option>
                        <option value="Income Tax">Income Tax</option>
                        <option value="Sales Tax">Sales Tax</option>
                        <option value="Property Tax">Property Tax</option>
                    </select>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="Filed">Filed</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <select
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="border rounded-md px-3 py-2 text-sm"
                        >
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total Reports</h3>
                    <p className="text-2xl font-bold">{filteredReports.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total Amount</h3>
                    <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium">Last Filed</h3>
                    <p className="text-2xl font-bold">
                        {filteredReports[0]?.filingDate || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Period
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tax Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Filing Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReports.length > 0 ? (
                                filteredReports.map(report => (
                                    <tr
                                        key={report.id}
                                        className={`hover:bg-gray-50 cursor-pointer ${selectedReport?.id === report.id ? 'bg-blue-50' : ''}`}
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {report.period}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.taxType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${report.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${report.status === 'Filed' ? 'bg-green-100 text-green-800' :
                                                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.filingDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadReport(report.id);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                <DownloadIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No reports found matching your filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Report Detail View - would show when a report is selected */}
            {selectedReport && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Report Details: {selectedReport.period}
                        </h2>
                        <button
                            onClick={() => setSelectedReport(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            × Close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Tax Type</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.taxType}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.status}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                            <p className="mt-1 text-sm text-gray-900">
                                ${selectedReport.amount.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Filing Date</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.filingDate}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxReports;