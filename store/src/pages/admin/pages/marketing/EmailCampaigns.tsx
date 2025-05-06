import React, { useState } from 'react';
import { FiMail, FiSearch, FiPlus, FiEdit2, FiTrash2, FiBarChart2, FiClock, FiCheck, FiSend, FiX } from 'react-icons/fi';

interface Campaign {
    id: string;
    name: string;
    status: 'draft' | 'scheduled' | 'sent' | 'failed';
    subject: string;
    recipients: number;
    opened: number;
    clicked: number;
    scheduledDate?: string;
    sentDate?: string;
}

const EmailCampaigns: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        {
            id: '1',
            name: 'Summer Sale 2023',
            status: 'sent',
            subject: 'Get 20% off on all summer items!',
            recipients: 1250,
            opened: 842,
            clicked: 312,
            sentDate: '2023-06-15'
        },
        {
            id: '2',
            name: 'New Product Launch',
            status: 'scheduled',
            subject: 'Introducing our new product line',
            recipients: 0,
            opened: 0,
            clicked: 0,
            scheduledDate: '2023-07-01'
        },
        {
            id: '3',
            name: 'Customer Feedback',
            status: 'draft',
            subject: 'We value your opinion',
            recipients: 0,
            opened: 0,
            clicked: 0
        },
        {
            id: '4',
            name: 'Black Friday Preview',
            status: 'failed',
            subject: 'Early access to Black Friday deals',
            recipients: 980,
            opened: 0,
            clicked: 0,
            sentDate: '2023-05-20'
        }
    ]);

    const handleDeleteCampaign = (id: string) => {
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    };

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center"><FiClock className="mr-1" /> Draft</span>;
            case 'scheduled':
                return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"><FiClock className="mr-1" /> Scheduled</span>;
            case 'sent':
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center"><FiCheck className="mr-1" /> Sent</span>;
            case 'failed':
                return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center"><FiSend className="mr-1" /> Failed</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
        }
    };

    const getPerformanceColor = (rate: number) => {
        if (rate > 0.3) return 'text-green-600';
        if (rate > 0.15) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <FiMail className="text-2xl text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold">Email Campaigns</h1>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                    <FiPlus className="mr-2" /> Create Campaign
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="pl-10 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <FiX
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => setSearchTerm('')}
                            />
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium">{campaign.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {campaign.status === 'sent' && `Sent on ${new Date(campaign.sentDate || '').toLocaleDateString()}`}
                                            {campaign.status === 'scheduled' && `Scheduled for ${new Date(campaign.scheduledDate || '').toLocaleDateString()}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{campaign.subject}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(campaign.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {campaign.status === 'sent' || campaign.status === 'failed' ? (
                                            <div className="flex items-center">
                                                <FiBarChart2 className="mr-2 text-gray-400" />
                                                <div>
                                                    <div className="text-sm">
                                                        <span className={getPerformanceColor(campaign.opened / campaign.recipients)}>
                                                            {Math.round((campaign.opened / campaign.recipients) * 100)}%
                                                        </span> open rate
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className={getPerformanceColor(campaign.clicked / campaign.recipients)}>
                                                            {Math.round((campaign.clicked / campaign.recipients) * 100)}%
                                                        </span> click rate
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Not sent yet</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-800 mr-4" title="Edit Campaign">
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800" title="Delete Campaign"
                                            onClick={() => handleDeleteCampaign(campaign.id)}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <FiBarChart2 className="mr-2 text-blue-600" /> Campaign Stats
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm text-gray-500">Total Campaigns</div>
                            <div className="text-2xl font-bold">{campaigns.length}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Successful Sends</div>
                            <div className="text-2xl font-bold">
                                {campaigns.filter(c => c.status === 'sent').length}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Average Open Rate</div>
                            <div className="text-2xl font-bold">
                                {campaigns.filter(c => c.status === 'sent').length > 0
                                    ? Math.round(campaigns.filter(c => c.status === 'sent')
                                        .reduce((sum, c) => sum + (c.opened / c.recipients), 0) /
                                        campaigns.filter(c => c.status === 'sent').length * 100) + '%'
                                    : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <FiClock className="mr-2 text-blue-600" /> Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {campaigns
                            .filter(c => c.status === 'sent' || c.status === 'failed')
                            .sort((a, b) => new Date(b.sentDate || '').getTime() - new Date(a.sentDate || '').getTime())
                            .slice(0, 3)
                            .map(campaign => (
                                <div key={campaign.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between">
                                        <div className="font-medium">{campaign.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(campaign.sentDate || '').toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">{campaign.subject}</div>
                                    <div className="flex justify-between mt-2">
                                        <div className="text-sm">
                                            <span className="font-medium">{campaign.recipients}</span> recipients
                                        </div>
                                        <div className={`text-sm ${campaign.status === 'sent' ? 'text-green-600' : 'text-red-600'}`}>
                                            {campaign.status === 'sent' ? 'Delivered' : 'Failed'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailCampaigns;