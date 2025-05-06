import React, { useState } from 'react';
import { PlusIcon, CalendarIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Promotion {
    id: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed' | 'buyXgetY';
    discountValue: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'upcoming' | 'expired' | 'draft';
    targetGroups: string[];
    couponCode?: string;
}

const Promotions: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([
        {
            id: '1',
            name: 'Summer Sale',
            description: 'Seasonal discount for all summer products',
            discountType: 'percentage',
            discountValue: 20,
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            status: 'active',
            targetGroups: ['all-customers'],
            couponCode: 'SUMMER20',
        },
        {
            id: '2',
            name: 'New Customer Offer',
            description: 'Discount for first-time buyers',
            discountType: 'fixed',
            discountValue: 15,
            startDate: '2023-07-15',
            endDate: '2023-09-15',
            status: 'upcoming',
            targetGroups: ['new-customers'],
            couponCode: 'WELCOME15',
        },
        {
            id: '3',
            name: 'Buy 1 Get 1 Free',
            description: 'Special offer on selected items',
            discountType: 'buyXgetY',
            discountValue: 1,
            startDate: '2023-05-01',
            endDate: '2023-05-31',
            status: 'expired',
            targetGroups: ['premium-members'],
        },
        {
            id: '4',
            name: 'Holiday Special',
            description: 'Year-end holiday promotion',
            discountType: 'percentage',
            discountValue: 25,
            startDate: '2023-12-15',
            endDate: '2023-12-31',
            status: 'draft',
            targetGroups: ['all-customers', 'loyalty-members'],
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPromotion, setNewPromotion] = useState<Omit<Promotion, 'id'>>({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        targetGroups: [],
    });
    const [activeTab, setActiveTab] = useState<'all' | Promotion['status']>('all');
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

    const filteredPromotions = promotions.filter(promo =>
        activeTab === 'all' || promo.status === activeTab
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPromotion(prev => ({
            ...prev,
            [name]: name === 'discountValue' ? Number(value) : value,
        }));
    };

    const handleTargetGroupChange = (group: string) => {
        setNewPromotion(prev => {
            const groups = prev.targetGroups.includes(group)
                ? prev.targetGroups.filter(g => g !== group)
                : [...prev.targetGroups, group];
            return { ...prev, targetGroups: groups };
        });
    };

    const createPromotion = () => {
        const promotion: Promotion = {
            ...newPromotion,
            id: Date.now().toString(),
        };
        setPromotions([...promotions, promotion]);
        setIsModalOpen(false);
        setNewPromotion({
            name: '',
            description: '',
            discountType: 'percentage',
            discountValue: 10,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'draft',
            targetGroups: [],
        });
    };

    const getStatusColor = (status: Promotion['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-purple-100 text-purple-800';
        }
    };

    const getDiscountText = (promo: Promotion) => {
        switch (promo.discountType) {
            case 'percentage': return `${promo.discountValue}% off`;
            case 'fixed': return `$${promo.discountValue} off`;
            case 'buyXgetY': return `Buy 1 Get ${promo.discountValue} Free`;
            default: return '';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Promotions</h1>
                    <p className="text-gray-600">Manage your marketing promotions and special offers</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Promotion
                </button>
            </div>

            <div className="flex space-x-4 border-b border-gray-200 mb-6">
                {['all', 'active', 'upcoming', 'expired', 'draft'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === tab
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromotions.map(promo => (
                    <div
                        key={promo.id}
                        className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${promo.status === 'active' ? 'border-green-500' :
                            promo.status === 'upcoming' ? 'border-blue-500' :
                                promo.status === 'expired' ? 'border-gray-500' : 'border-yellow-500'
                            }`}
                        onClick={() => setSelectedPromotion(promo)}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold">{promo.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(promo.status)}`}>
                                    {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mt-1">{promo.description}</p>

                            <div className="mt-3 flex items-center">
                                <TagIcon className="h-5 w-5 text-gray-400 mr-1" />
                                <span className="font-medium">{getDiscountText(promo)}</span>
                            </div>

                            {promo.couponCode && (
                                <div className="mt-2 bg-gray-100 p-2 rounded inline-block">
                                    <code className="font-mono text-sm">{promo.couponCode}</code>
                                </div>
                            )}

                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                <span>
                                    {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="mt-3">
                                <div className="text-xs text-gray-500 mb-1">Target Groups:</div>
                                <div className="flex flex-wrap gap-1">
                                    {promo.targetGroups.map(group => (
                                        <span key={group} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                            {group.replace('-', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Promotion Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Create New Promotion</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newPromotion.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={newPromotion.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                        <select
                                            name="discountType"
                                            value={newPromotion.discountType}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="percentage">Percentage Off</option>
                                            <option value="fixed">Fixed Amount Off</option>
                                            <option value="buyXgetY">Buy X Get Y Free</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {newPromotion.discountType === 'percentage' ? 'Percentage Value' :
                                                newPromotion.discountType === 'fixed' ? 'Fixed Amount' : 'Get Y Value'}
                                        </label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={newPromotion.discountValue}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                            min={0}
                                            max={newPromotion.discountType === 'percentage' ? 100 : undefined}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={newPromotion.startDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={newPromotion.endDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={newPromotion.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="upcoming">Upcoming</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code (optional)</label>
                                    <input
                                        type="text"
                                        name="couponCode"
                                        value={newPromotion.couponCode || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Groups</label>
                                    <div className="space-y-2">
                                        {['all-customers', 'new-customers', 'loyalty-members', 'premium-members'].map(group => (
                                            <div key={group} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={group}
                                                    checked={newPromotion.targetGroups.includes(group)}
                                                    onChange={() => handleTargetGroupChange(group)}
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                />
                                                <label htmlFor={group} className="ml-2 text-sm text-gray-700">
                                                    {group.replace('-', ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={createPromotion}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Create Promotion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Promotion Detail Modal */}
            {selectedPromotion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{selectedPromotion.name}</h2>
                                <button
                                    onClick={() => setSelectedPromotion(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedPromotion.status)}`}>
                                        {selectedPromotion.status.charAt(0).toUpperCase() + selectedPromotion.status.slice(1)}
                                    </span>
                                    <div className="text-sm text-gray-500">
                                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                                        {new Date(selectedPromotion.startDate).toLocaleDateString()} - {new Date(selectedPromotion.endDate).toLocaleDateString()}
                                    </div>
                                </div>

                                <p className="text-gray-600">{selectedPromotion.description}</p>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="font-medium mb-2">Promotion Details:</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Discount Type</div>
                                            <div>{selectedPromotion.discountType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Discount Value</div>
                                            <div>{getDiscountText(selectedPromotion)}</div>
                                        </div>
                                        {selectedPromotion.couponCode && (
                                            <div className="col-span-2">
                                                <div className="text-sm text-gray-500">Coupon Code</div>
                                                <code className="font-mono bg-gray-100 p-1 rounded">{selectedPromotion.couponCode}</code>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium mb-2">Target Groups:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPromotion.targetGroups.map(group => (
                                            <span key={group} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                                {group.replace('-', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => {
                                            // In a real app, you would implement edit functionality
                                            alert('Edit functionality would be implemented here');
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Edit Promotion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotions;