import React, { useState } from 'react';
import { CreditCardIcon, BanknotesIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

type PaymentMethod = {
    id: string;
    type: 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto';
    details: {
        cardNumber?: string;
        bankName?: string;
        accountName?: string;
        email?: string;
        walletAddress?: string;
    };
    isDefault: boolean;
    addedDate: string;
};

const PaymentMethods: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'credit_card',
            details: {
                cardNumber: '•••• •••• •••• 4242',
                accountName: 'John Doe'
            },
            isDefault: true,
            addedDate: '2023-01-15'
        },
        {
            id: '2',
            type: 'bank_transfer',
            details: {
                bankName: 'Chase Bank',
                accountName: 'John Doe'
            },
            isDefault: false,
            addedDate: '2023-03-22'
        },
        {
            id: '3',
            type: 'paypal',
            details: {
                email: 'john.doe@example.com'
            },
            isDefault: false,
            addedDate: '2023-05-10'
        }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const setAsDefault = (id: string) => {
        setPaymentMethods(prev =>
            prev.map(method => ({
                ...method,
                isDefault: method.id === id
            }))
        );
    };

    const deleteMethod = (id: string) => {
        setPaymentMethods(prev => prev.filter(method => method.id !== id));
        setIsDeleteModalOpen(false);
    };

    const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
        switch (type) {
            case 'credit_card':
                return <CreditCardIcon className="h-6 w-6 text-blue-500" />;
            case 'bank_transfer':
                return <BanknotesIcon className="h-6 w-6 text-green-500" />;
            case 'paypal':
                return <span className="text-blue-700 font-bold">PayPal</span>;
            case 'crypto':
                return <span className="font-mono">Ξ</span>;
            default:
                return null;
        }
    };

    const getPaymentMethodLabel = (type: PaymentMethod['type']) => {
        switch (type) {
            case 'credit_card':
                return 'Credit Card';
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'paypal':
                return 'PayPal';
            case 'crypto':
                return 'Crypto Wallet';
            default:
                return 'Payment Method';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
                    <p className="text-gray-600">Manage your payment options</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Payment Method
                </button>
            </div>

            <div className="space-y-4">
                {paymentMethods.length > 0 ? (
                    paymentMethods.map(method => (
                        <div
                            key={method.id}
                            className={`bg-white p-4 rounded-lg shadow-sm border ${method.isDefault ? 'border-blue-500' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        {getPaymentMethodIcon(method.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {getPaymentMethodLabel(method.type)}
                                            {method.isDefault && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {method.type === 'credit_card' && method.details.cardNumber}
                                            {method.type === 'bank_transfer' && `${method.details.bankName} • ${method.details.accountName}`}
                                            {method.type === 'paypal' && method.details.email}
                                            {method.type === 'crypto' && method.details.walletAddress?.slice(0, 12) + '...'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Added on {new Date(method.addedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {!method.isDefault && (
                                        <button
                                            onClick={() => setAsDefault(method.id)}
                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Set as default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsEditing(method.id)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                        title="Edit"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMethodToDelete(method.id);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="p-1 text-red-500 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                        <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No payment methods</h3>
                        <p className="mt-1 text-gray-500">Add a payment method to get started</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Payment Method
                        </button>
                    </div>
                )}
            </div>

            {/* Add Payment Method Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Add Payment Method</h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method Type
                                </label>
                                <select className="w-full border rounded-md px-3 py-2">
                                    <option value="credit_card">Credit Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="crypto">Crypto Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="setAsDefault"
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <label htmlFor="setAsDefault" className="ml-2 text-sm text-gray-700">
                                    Set as default payment method
                                </label>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // In a real app, this would validate and save the payment method
                                    setIsAddModalOpen(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save Payment Method
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Delete Payment Method</h3>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete this payment method? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => methodToDelete && deleteMethod(methodToDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;