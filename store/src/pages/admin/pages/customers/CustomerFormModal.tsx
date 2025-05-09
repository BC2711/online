import React, { useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Customer, createCustomer, getCustomerGroups, updateCustomer } from "../../../../service/api/admin/customer/customer";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";

// Interfaces
interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: Customer | null;
    onSuccess: () => void;
}

interface FormData {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    group_id: number;
}

interface FormErrors {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    group_id?: string;
    api?: string;
}

// Success Modal Component
interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditMode: boolean;
    onSuccess: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, isEditMode, onSuccess }) => {
    const handleCloseSuccess = () => {
        onSuccess();
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleCloseSuccess}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex flex-col items-center">
                                    <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                        {isEditMode ? "Customer Updated" : "Customer Created"}
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-gray-500 text-center">
                                        The customer has been {isEditMode ? "updated" : "created"} successfully.
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleCloseSuccess}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// ErrorMessages Component
interface ErrorMessagesProps {
    errors?: string[] | string;
    id?: string;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors, id }) => {
    if (!errors) return null;
    const errorList = Array.isArray(errors) ? errors : [errors];
    if (errorList.length === 0) return null;

    return (
        <div id={id} className="mt-1 space-y-1">
            {errorList.map((error, index) => (
                <p key={index} className="text-sm font-medium text-red-600">
                    {error}
                </p>
            ))}
        </div>
    );
};

// Main Component
const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, onClose, customer, onSuccess }) => {
    const { authToken } = useAuth();
    const isEditMode = !!customer;
    const [formData, setFormData] = useState<FormData>({
        username: customer?.username || "",
        first_name: customer?.first_name || "",
        last_name: customer?.last_name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        is_active: customer?.is_active ?? true,
        group_id: customer?.group_id ?? 0,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Fetch groups
    const fetchGroups = useCallback(async () => {
        if (!authToken) {
            setErrors({ api: "Authentication token is missing" });
            toast.error("Authentication token is missing");
            return;
        }
        setIsLoadingGroups(true);
        try {
            const response = await getCustomerGroups(authToken);
            if (response.success) {
                setGroups(response.data);
            } else {
                setErrors({ api: response.message || "Failed to fetch groups" });
                toast.error("Failed to fetch groups");
            }
        } catch (error) {
            setErrors({ api: "Failed to fetch groups" });
            toast.error("Failed to fetch groups");
        } finally {
            setIsLoadingGroups(false);
        }
    }, [authToken]);

    // Initialize form and fetch groups
    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone: customer.phone || "",
                is_active: customer.is_active,
                group_id: customer.group_id ?? 0,
            });
        } else {
            setFormData({
                username: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                is_active: true,
                group_id: 0,
            });
        }
        setErrors({});
        fetchGroups();
    }, [fetchGroups, customer]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authToken) return;

        setIsSubmitting(true);
        try {
            if (isEditMode && customer) {
                const response = await updateCustomer(authToken, customer.id, formData);
                if (response.id) {
                    setIsSuccessModalOpen(true);
                    onClose(); // Close CustomerFormModal immediately
                } else {
                    setErrors({
                        username: response.errors?.username,
                        first_name: response.errors?.first_name,
                        last_name: response.errors?.last_name,
                        email: response.errors?.email,
                        phone: response.errors?.phone,
                        api: response.message || "Failed to update customer",
                    });
                    toast.error(response.message || "Failed to update customer");
                    return;
                }
            } else {
                const response = await createCustomer(authToken, formData);
                if (response.id) {
                    setIsSuccessModalOpen(true);
                    onClose(); // Close CustomerFormModal immediately
                } else {
                    setErrors({
                        username: response.errors?.username,
                        first_name: response.errors?.first_name,
                        last_name: response.errors?.last_name,
                        email: response.errors?.email,
                        phone: response.errors?.phone,
                        api: response.message || "Failed to create customer",
                    });
                    toast.error(response.message || "Failed to create customer");
                    return;
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save customer";
            setErrors({ api: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : name === "group_id" ? Number(value) : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined, api: undefined }));
    };

    // Handle form reset
    const handleReset = () => {
        if (isEditMode && customer) {
            setFormData({
                username: customer.username,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone: customer.phone || "",
                is_active: customer.is_active,
                group_id: customer.group_id ?? 0,
            });
        } else {
            setFormData({
                username: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                is_active: true,
                group_id: 0,
            });
        }
        setErrors({});
    };

    // Prevent closing during submission
    const handleClose = () => {
        if (!isSubmitting) onClose();
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            {isEditMode ? "Edit Customer" : "Add New Customer"}
                                        </Dialog.Title>
                                        <button
                                            onClick={handleClose}
                                            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                            aria-label="Close modal"
                                            disabled={isSubmitting}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {errors.api && (
                                            <div className="mb-4 rounded-md bg-red-50 p-3">
                                                <p className="text-sm font-medium text-red-800">{errors.api}</p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                    Username <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full rounded-lg border ${errors.username?.length ? "border-red-500" : "border-gray-200"} py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Enter username"
                                                    aria-invalid={!!errors.username}
                                                    aria-describedby={errors.username ? "username-error" : undefined}
                                                />
                                                <ErrorMessages id="username-error" errors={errors.username} />
                                            </div>
                                            <div>
                                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                                    First Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="first_name"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full rounded-lg border ${errors.first_name?.length ? "border-red-500" : "border-gray-200"} py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Enter first name"
                                                    aria-invalid={!!errors.first_name}
                                                    aria-describedby={errors.first_name ? "first_name-error" : undefined}
                                                />
                                                <ErrorMessages id="first_name-error" errors={errors.first_name} />
                                            </div>
                                            <div>
                                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                                    Last Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="last_name"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full rounded-lg border ${errors.last_name?.length ? "border-red-500" : "border-gray-200"} py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Enter last name"
                                                    aria-invalid={!!errors.last_name}
                                                    aria-describedby={errors.last_name ? "last_name-error" : undefined}
                                                />
                                                <ErrorMessages id="last_name-error" errors={errors.last_name} />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full rounded-lg border ${errors.email?.length ? "border-red-500" : "border-gray-200"} py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Enter email"
                                                    aria-invalid={!!errors.email}
                                                    aria-describedby={errors.email ? "email-error" : undefined}
                                                />
                                                <ErrorMessages id="email-error" errors={errors.email} />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone <span className="text-gray-500">(Optional)</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full rounded-lg border ${errors.phone?.length ? "border-red-500" : "border-gray-200"} py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="e.g., +1234567890"
                                                    aria-invalid={!!errors.phone}
                                                    aria-describedby={errors.phone ? "phone-error" : undefined}
                                                />
                                                <ErrorMessages id="phone-error" errors={errors.phone} />
                                            </div>
                                            <div>
                                                <label htmlFor="group_id" className="block text-sm font-medium text-gray-700">
                                                    Group <span className="text-gray-500">(Optional)</span>
                                                </label>
                                                <select
                                                    name="group_id"
                                                    id="group_id"
                                                    value={formData.group_id}
                                                    onChange={handleChange}
                                                    disabled={isLoadingGroups}
                                                    className={`mt-1 block w-full rounded-lg border ${errors.group_id?.length ? "border-red-500" : "border-gray-200"} py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50`}
                                                    aria-invalid={!!errors.group_id}
                                                    aria-describedby={errors.group_id ? "group_id-error" : undefined}
                                                >
                                                    <option value={0}>{isLoadingGroups ? "Loading Groups..." : "Select Group"}</option>
                                                    {!isLoadingGroups &&
                                                        groups.length > 0 &&
                                                        groups.map((group) => (
                                                            <option key={group.id} value={group.id}>
                                                                {group.name}
                                                            </option>
                                                        ))}
                                                    {!isLoadingGroups && groups.length === 0 && (
                                                        <option value={0} disabled>
                                                            No Groups Available
                                                        </option>
                                                    )}
                                                </select>
                                                <ErrorMessages id="group_id-error" errors={errors.group_id} />
                                            </div>
                                            <div className="flex items-center">
                                                <label htmlFor="is_active" className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="is_active"
                                                        name="is_active"
                                                        checked={formData.is_active}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-gray-700">Active Status</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={isSubmitting}
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting && (
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        />
                                                    </svg>
                                                )}
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : isEditMode
                                                        ? "Update Customer"
                                                        : "Create Customer"}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                isEditMode={isEditMode}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default CustomerFormModal;