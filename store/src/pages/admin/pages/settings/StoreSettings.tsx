import React, { useEffect, useState } from 'react';
import { getStore, updateStore } from '../../../../service/api/admin/store/store';
import { useAuth } from '../../../../context/AuthContext';
import {
    CalendarIcon,
    TagIcon,
    CogIcon,
    CreditCardIcon,
    TruckIcon,
    PencilIcon,
    ReceiptRefundIcon,
    PhotoIcon,
    LinkIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    BuildingStorefrontIcon,
    CurrencyBangladeshiIcon
} from '@heroicons/react/24/outline';
import { FacebookOutlined, InstallDesktopOutlined, LinkedIn, LocationCityOutlined, Twitter, WhatsApp } from '@mui/icons-material';
import { Tiktok, TimeZone } from 'iconoir-react';
// import {
//     FacebookIcon,
//     InstagramIcon,
//     TwitterIcon,
//     LinkedinIcon,
//     TiktokIcon,
//     WhatsappIcon
// } from '../../../../components/SocialIcons';

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

const StoreSettings: React.FC = () => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('general');

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const tabs = [
        { id: 'general', label: 'General', icon: <CogIcon className="w-5 h-5" /> },
        { id: 'payment', label: 'Payment', icon: <CreditCardIcon className="w-5 h-5" /> },
        { id: 'shipping', label: 'Shipping', icon: <TruckIcon className="w-5 h-5" /> },
        { id: 'tax', label: 'Tax', icon: <ReceiptRefundIcon className="w-5 h-5" /> },
    ];
    const [formData, setFormData] = useState<any>({
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        logo: '',
        status: '',
        currency: '',
        timezone: '',
        city: '',
        facebook: '',
        twitter: '',
        instagram: '',
        tiktok: '',
        whatsapp: '',
    });
    const handleSubmit = async () => {

    }
    useEffect(() => {
        const fetchStoreData = async () => {
            setLoading(true);
            try {
                const data = await getStore(authToken as string);
                setStoreData(data);
                if (data.success) {
                    setLogoPreview(data.logoUrl);
                }
            } catch (error) {
                console.error('Failed to fetch store data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [authToken]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };



    const renderInputField = (label: string, value: string, type: string = 'text', id: string, icon?: React.ReactNode) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 m-2">
            <div className="flex items-center gap-2">
                {icon && <div className="text-gray-400">{icon}</div>}
                <h3 className="text-base font-medium text-gray-700">{label}</h3>
            </div>
            {isEditing ? (
                <input
                    type={type}
                    defaultValue={value}
                   onChange={(e)=>setFormData({...formData, ${id}: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
            ) : (
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {type === 'url' ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {value}
                    </a>
                ) : value}
            </span>
            )}
        </div>
    );

    const renderSocialMediaField = (platform: string, value: string, id: string, icon: React.ReactNode) => (
        <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="text-gray-500">{icon}</div>
                <span className="text-sm font-medium text-gray-700">{platform}</span>
            </div>
            {isEditing ? (
                <input
                    type="url"
                    defaultValue={value}
                    onChange={(e) => setFormData({ ...formData, ${ id }: e.target.value})}
            placeholder={`https://${platform.toLowerCase()}.com/yourstore`}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-1 max-w-[200px]"
                />
            ) : (
            value ? (
            <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate max-w-[180px]"
            >
                {value.replace(/^https?:\/\//, '')}
            </a>
            ) : (
            <span className="text-gray-400 text-sm">Not connected</span>
            )
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
                        <p className="text-gray-500 mt-2 text-sm md:text-base">
                            Configure your store preferences and operational settings
                        </p>
                    </div>

                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center max-w-sm">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Loading Settings</h3>
                            <p className="text-gray-500 text-center">Fetching your store configuration...</p>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 px-4">
                        <nav className="flex space-x-2 md:space-x-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsEditing(false);
                                    }}
                                    className={`px-3 py-3 md:px-4 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-500'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-200'
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 m-2">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold text-gray-800">Store Information</h2>
                                    </div>

                                    {activeTab === 'general' && (
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isEditing
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            <span>{isEditing ? 'Cancel Editing' : 'Edit Settings'}</span>
                                        </button>
                                    )}

                                </div>


                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <form onSubmit={handleSubmit}>
                                            {/* Logo Section */}
                                            <div className="mb-6">
                                                <h3 className="text-base font-medium text-gray-700 mb-3 flex text-center gap-2">
                                                    <PhotoIcon className="w-5 h-5 text-gray-400" />
                                                    Store Logo
                                                </h3>
                                                <div className="flex gap-4 text-center">
                                                    <div className="w-20 h-16 rounded-md bg-white border border-gray-200 flex justify-center overflow-hidden">
                                                        {logoPreview ? (
                                                            <img src={logoPreview} alt="Store Logo" className="w-full h-full object-contain" />
                                                        ) : (
                                                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                    {isEditing && (
                                                        <div>
                                                            <label className="cursor-pointer">
                                                                <span className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                                    Change Logo
                                                                </span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleLogoChange}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <p className="text-xs text-gray-500 mt-1">Recommended size: 300x300px</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Basic Information */}
                                            <div className="space-y-4 mb-6">
                                                <h3 className="text-base font-medium text-gray-700 flex items-center gap-2">
                                                    <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
                                                    Basic Information
                                                </h3>
                                                <div className="border-t">
                                                    {renderInputField('Store Name', 'romo', 'text', 'name')}
                                                    {renderInputField('Address', '123 Main St, City, Country', 'text', 'address', <MapPinIcon className="w-5 h-5" />)}
                                                    {renderInputField('Email', 'contact@example.com', 'email', 'email', <EnvelopeIcon className="w-5 h-5" />)}
                                                    {renderInputField('Phone', '+1 234 567 890', 'tel', 'phone', <PhoneIcon className="w-5 h-5" />)}
                                                    {renderInputField('Website', 'https://example.com', 'url', 'website', <GlobeAltIcon className="w-5 h-5" />)}
                                                    {renderInputField('Currency', 'ZMW', 'text', 'currency', <CurrencyBangladeshiIcon className="w-5 h-5" />)}
                                                    {renderInputField('City', 'Lusaka', 'text', 'city', <LocationCityOutlined className="w-5 h-5" />)}
                                                    {renderInputField('Timezone', 'Africa/Lusaka', 'text', 'timezone', <TimeZone className="w-5 h-5" />)}
                                                </div>

                                            </div>

                                            {/* Social Media Links */}
                                            <div className="mb-6 ">
                                                <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                    <LinkIcon className="w-5 h-5 text-gray-400" />
                                                    Social Media Links
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t">
                                                    {renderSocialMediaField('Facebook', 'https://facebook.com/yourstore', 'facebook', <FacebookOutlined className="w-5 h-5" />)}
                                                    {renderSocialMediaField('Instagram', 'https://instagram.com/yourstore', 'instagram', <InstallDesktopOutlined className="w-5 h-5" />)}
                                                    {renderSocialMediaField('Twitter', 'https://twitter.com/yourstore', 'twitter', <Twitter className="w-5 h-5" />)}
                                                    {renderSocialMediaField('TikTok', 'https://tiktok.com/@yourstore', 'tiktok', <Tiktok className="w-5 h-5" />)}
                                                    {renderSocialMediaField('WhatsApp', 'https://whatsapp.com/yourstore', 'whatsapp', <WhatsApp className="w-5 h-5" />)}
                                                </div>
                                            </div>

                                            {/* Additional Information */}
                                            <div className="pt-0 border-t border-gray-200">
                                                {isEditing && (
                                                    <div className="mt-6 flex justify-end gap-3">
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment, Shipping, and Tax tabs remain the same as in your original code */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <p className="text-gray-600">Configure your accepted payment methods and processing settings.</p>
                                    <div className="mt-6 space-y-4">
                                        <div className="p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                                                    <CreditCardIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Credit/Debit Cards</h4>
                                                    <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.5 6.5h-3.75v-3.75c0-.414-.336-.75-.75-.75h-7.5c-.414 0-.75.336-.75.75v3.75h-3.75c-.414 0-.75.336-.75.75v7.5c0 .414.336.75.75.75h3.75v3.75c0 .414.336.75.75.75h7.5c.414 0 .75-.336.75-.75v-3.75h3.75c.414 0 .75-.336.75-.75v-7.5c0-.414-.336-.75-.75-.75zm-12 1.5h6v-3h-6v3zm-3 6h-3v-6h3v6zm12 3h-6v-3h6v3zm3-3h-3v-6h3v6z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">PayPal</h4>
                                                    <p className="text-sm text-gray-500">Secure online payments</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-yellow-50 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-1-11v-6h2v6h3v2h-5v-2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Bank Transfer</h4>
                                                    <p className="text-sm text-gray-500">Direct bank payments</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Shipping Options</h2>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <p className="text-gray-600">Set up your shipping methods, rates, and delivery zones.</p>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                                                    <TruckIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <h4 className="font-medium">Standard Shipping</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">3-5 business days</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-medium">$5.99</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-medium">Express Shipping</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">1-2 business days</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-medium">$12.99</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-medium">Local Pickup</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">Pick up from our store</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-medium">Free</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-md bg-yellow-50 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-medium">International</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">7-14 business days</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-medium">$24.99</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tax' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Tax Settings</h2>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <p className="text-gray-600">Configure tax rates and rules for your store.</p>

                                    <div className="mt-6 space-y-6">
                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-medium">Default Tax Rate</h4>
                                                <span className="text-gray-900 font-medium">10%</span>
                                            </div>
                                            <p className="text-sm text-gray-500">Applied to all orders unless overridden by specific rules.</p>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <h4 className="font-medium mb-3">Regional Tax Rates</h4>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        <tr>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">United States</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">8.25%</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">European Union</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">20%</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Canada</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">13%</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                            <h4 className="font-medium mb-3">Tax Exemptions</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Digital products</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Non-profit organizations</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Wholesale customers</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSettings;