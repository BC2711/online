import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import {Tooltip} from 'react-tooltip';

const SocialMedia: React.FC = () => {
    const platforms = [
        { name: 'Facebook', icon: <FaFacebook className="text-blue-600" />, stats: '245K followers', engagement: '12.5%' },
        { name: 'Twitter', icon: <FaTwitter className="text-blue-400" />, stats: '112K followers', engagement: '8.3%' },
        { name: 'Instagram', icon: <FaInstagram className="text-pink-600" />, stats: '189K followers', engagement: '15.2%' },
        { name: 'LinkedIn', icon: <FaLinkedin className="text-blue-700" />, stats: '87K followers', engagement: '6.7%' },
        { name: 'YouTube', icon: <FaYoutube className="text-red-600" />, stats: '156K subscribers', engagement: '18.4%' },
        { name: 'TikTok', icon: <FaTiktok className="text-black" />, stats: '321K followers', engagement: '22.1%' },
    ];

    const campaigns = [
        {
            name: 'Summer Sale',
            platforms: ['Facebook', 'Instagram'],
            status: 'Active',
            engagement: '24.5%',
        },
        {
            name: 'Product Launch',
            platforms: ['Twitter', 'LinkedIn'],
            status: 'Pending',
            engagement: '-',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold">Social Media Management</h1>
                <p className="text-lg mt-2">
                    Manage all your social media platforms from one dashboard. Track performance, schedule posts, and engage with your audience.
                </p>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {platforms.map((platform, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                    >
                        <div className="flex items-center mb-4">
                            <span className="text-3xl mr-4">{platform.icon}</span>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">{platform.name}</h2>
                                <p className="text-sm text-gray-500">{platform.stats}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm px-1 text-gray-600">
                                Engagement: <span className="font-bold">{platform.engagement}</span>
                            </p>
                            <div className="flex space-x-3">
                                <button className="px-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    View Analytics
                                </button>
                                <button className="px-1 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors">
                                    Schedule Post
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Campaigns Table */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Campaigns</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr className="border-b">
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Campaign</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Platform</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Engagement</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{campaign.name}</td>
                                    <td className="py-3 px-4">
                                        {campaign.platforms.map((platform, i) => (
                                            <span
                                                key={i}
                                                className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mr-2"
                                            >
                                                {platform}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${getStatusColor(campaign.status)}`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {campaign.engagement !== '-' ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {campaign.engagement}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            data-tip="View Details"
                                            className="text-blue-500 hover:text-blue-700 mr-3"
                                        >
                                            View
                                        </button>
                                        <button
                                            data-tip="Edit Campaign"
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            Edit
                                        </button>
                                        <Tooltip place="top"  />
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

export default SocialMedia;