import React, { useState } from 'react';

interface TaxRate {
    id: string;
    country: string;
    state: string;
    postalCode?: string;
    rate: number;
    taxName: string;
    appliesToShipping: boolean;
}

const TaxSettings: React.FC = () => {
    const [taxRates, setTaxRates] = useState<TaxRate[]>([
        {
            id: '1',
            country: 'United States',
            state: 'California',
            rate: 7.25,
            taxName: 'CA Sales Tax',
            appliesToShipping: true
        },
        {
            id: '2',
            country: 'Canada',
            state: 'Ontario',
            rate: 13,
            taxName: 'HST',
            appliesToShipping: false
        }
    ]);

    const [newTaxRate, setNewTaxRate] = useState<Omit<TaxRate, 'id'>>({
        country: '',
        state: '',
        postalCode: '',
        rate: 0,
        taxName: '',
        appliesToShipping: false
    });

    const [showTaxForm, setShowTaxForm] = useState(false);
    const [taxCalculationMethod, setTaxCalculationMethod] = useState<'store' | 'customer'>('store');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        if (name in newTaxRate) {
            setNewTaxRate(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        } else if (name === 'taxCalculationMethod') {
            setTaxCalculationMethod(value as 'store' | 'customer');
        }
    };

    const handleAddTaxRate = (e: React.FormEvent) => {
        e.preventDefault();
        const rateToAdd = {
            ...newTaxRate,
            id: Date.now().toString(),
            rate: parseFloat(newTaxRate.rate.toString())
        };
        setTaxRates([...taxRates, rateToAdd]);
        setNewTaxRate({
            country: '',
            state: '',
            postalCode: '',
            rate: 0,
            taxName: '',
            appliesToShipping: false
        });
        setShowTaxForm(false);
    };

    const deleteTaxRate = (id: string) => {
        setTaxRates(taxRates.filter(rate => rate.id !== id));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tax Settings</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Tax Calculation</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Calculation Method</label>
                        <div className="mt-2 space-y-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="taxCalculationMethod"
                                    value="store"
                                    checked={taxCalculationMethod === 'store'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Calculate tax based on store address
                                </span>
                            </label>
                            <label className="inline-flex items-center block">
                                <input
                                    type="radio"
                                    name="taxCalculationMethod"
                                    value="customer"
                                    checked={taxCalculationMethod === 'customer'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Calculate tax based on customer shipping address
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Tax Rates</h3>
                            <button
                                onClick={() => setShowTaxForm(true)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                                Add Tax Rate
                            </button>
                        </div>

                        {taxRates.length > 0 ? (
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applies to Shipping</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {taxRates.map((rate) => (
                                            <tr key={rate.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate.taxName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rate.country}, {rate.state} {rate.postalCode && `(${rate.postalCode})`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.rate}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rate.appliesToShipping ? 'Yes' : 'No'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-red-600 hover:text-red-900" onClick={() => deleteTaxRate(rate.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-500">No tax rates configured yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Tax Rate Modal */}
            {showTaxForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add Tax Rate</h2>
                            <button onClick={() => setShowTaxForm(false)} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddTaxRate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                                    <input
                                        type="text"
                                        name="taxName"
                                        value={newTaxRate.taxName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={newTaxRate.country}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Australia">Australia</option>
                                            <option value="Germany">Germany</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={newTaxRate.state}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal/Zip Code (optional)</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={newTaxRate.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
                                    <input
                                        type="number"
                                        name="rate"
                                        value={newTaxRate.rate}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="appliesToShipping"
                                        name="appliesToShipping"
                                        checked={newTaxRate.appliesToShipping}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="appliesToShipping" className="ml-2 block text-sm text-gray-700">
                                        Apply this tax rate to shipping
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTaxForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Tax Rate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxSettings;