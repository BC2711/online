import React, { useEffect, useState } from 'react';
import { getStore, updateStore } from '../../../../service/api/admin/store/store';
import { useAuth } from '../../../../context/AuthContext';

const StoreSettings: React.FC = () => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('general');
    const [storeData, setStoreData] = useState<any>(null);

    // Mock tabs data - replace with your actual settings categories
    const tabs = [
        { id: 'general', label: 'General Settings' },
        { id: 'payment', label: 'Payment Methods' },
        { id: 'shipping', label: 'Shipping Options' },
        { id: 'tax', label: 'Tax Settings' },
    ];

    useEffect(() => {
        const fetchStoreData = async () => {
            setLoading(true);
            try {
                const data = await getStore(authToken);
                setStoreData(data);
            } catch (error) {
                console.error('Failed to fetch store data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [authToken]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your store configuration and preferences
                    </p>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-gray-700">Loading store settings...</p>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">General Store Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            defaultValue={storeData?.name || ''}
                                            placeholder="Enter store name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            defaultValue={storeData?.email || ''}
                                            placeholder="Enter contact email"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Store Description
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                            defaultValue={storeData?.description || ''}
                                            placeholder="Enter store description"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
                                <p className="text-gray-600">Payment settings content goes here...</p>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Shipping Options</h2>
                                <p className="text-gray-600">Shipping settings content goes here...</p>
                            </div>
                        )}

                        {activeTab === 'tax' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Tax Settings</h2>
                                <p className="text-gray-600">Tax settings content goes here...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSettings;