import React from 'react';

const ShippingOptions: React.FC = () => {
    // Mock data for shipping options
    const shippingOptions = [
        { id: 1, name: 'Standard Shipping', price: '$5.99', deliveryTime: '3-5 business days' },
        { id: 2, name: 'Express Shipping', price: '$12.99', deliveryTime: '1-2 business days' },
        { id: 3, name: 'Free Shipping', price: 'Free', deliveryTime: '5-7 business days', minOrder: '$50+' },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Shipping Options</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Available Shipping Methods</h2>

                <div className="space-y-4">
                    {shippingOptions.map((option) => (
                        <div key={option.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">{option.name}</h3>
                                    <p className="text-gray-600">{option.deliveryTime}</p>
                                    {option.minOrder && (
                                        <p className="text-sm text-gray-500">Minimum order: {option.minOrder}</p>
                                    )}
                                </div>
                                <span className="font-bold text-blue-600">{option.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium">Enable free shipping threshold</label>
                        <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="font-medium">Allow international shipping</label>
                        <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingOptions;