import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {  Customer, createCustomer, getAllGroups, updateCustomer } from "../../../../service/api/admin/customer/customer";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";

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
    phone: string ;
    is_active: boolean;
    group_id: [];
}

interface FormErrors {
    username?: string;
    first_name?: string;
    last_name?: string;
    group_id?:number ;
    email?: string;
    phone?: string;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, onClose, customer, onSuccess }) => {
    const { authToken } = useAuth();
    const isEditMode = !!customer;

    const [formData, setFormData] = useState<FormData>({
        username: customer?.username || "",
        first_name: customer?.first_name || "",
        last_name: customer?.last_name || "",
        group_id: customer?.group_id ,
        email: customer?.email || "",
        phone: customer?.phone,
        is_active: customer?.is_active ?? true,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);

    const fetchGroups = async () => {
        try {
            const response = await getAllGroups(authToken as string);
            if (!response.success) {
                throw new Error("Failed to fetch groups");
            }
            setGroups(response.data);

        } catch (error) {
            toast.error("Failed to fetch groups");
        }
    }
    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone: customer.phone,
                is_active: customer.is_active,
                group_id: customer.group_id,
            });
            setErrors({});
        } else {
            setFormData({ username: "", first_name: "", last_name: "", email: "", phone: "", is_active: true, group_id: 0 });
            setErrors({});
        }
        // fetchGroups();
    }, [customer, authToken]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        } else if (formData.first_name.length < 3) {
            newErrors.first_name = "First name must be at least 3 characters";
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        } else if (formData.last_name.length < 3) {
            newErrors.last_name = "Last name must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (formData.phone && !/^\+?[\d\s-]{7,15}$/.test(formData.phone)) {
            newErrors.phone = "Invalid phone number format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (isEditMode && customer) {
                await updateCustomer(authToken as string, customer.id, formData);
                toast.success("Customer updated successfully");
            } else {
                await createCustomer(authToken as string, formData);
                toast.success("Customer created successfully");
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save customer");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
        // Clear error for the field being edited
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                                        onClick={onClose}
                                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                        aria-label="Close modal"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-lg border ${errors.username ? "border-red-500" : "border-gray-200"
                                                    } py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter username"
                                                aria-invalid={!!errors.username}
                                                aria-describedby={errors.username ? "username-error" : undefined}
                                            />
                                            {errors.username && (
                                                <p id="username-error" className="mt-1 text-sm text-red-600">
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-lg border ${errors.first_name ? "border-red-500" : "border-gray-200"
                                                    } py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter first name"
                                                aria-invalid={!!errors.first_name}
                                                aria-describedby={errors.first_name ? "first_name-error" : undefined}
                                            />
                                            {errors.first_name && (
                                                <p id="first_name-error" className="mt-1 text-sm text-red-600">
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-lg border ${errors.last_name ? "border-red-500" : "border-gray-200"
                                                    } py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter last name"
                                                aria-invalid={!!errors.last_name}
                                                aria-describedby={errors.last_name ? "last_name-error" : undefined}
                                            />
                                            {errors.last_name && (
                                                <p id="last_name-error" className="mt-1 text-sm text-red-600">
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-200"
                                                    } py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter email"
                                                aria-invalid={!!errors.email}
                                                aria-describedby={errors.email ? "email-error" : undefined}
                                            />
                                            {errors.email && (
                                                <p id="email-error" className="mt-1 text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone (Optional)
                                            </label>
                                            <input
                                                type="number"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-200"
                                                    } py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter phone number"
                                                aria-invalid={!!errors.phone}
                                                aria-describedby={errors.phone ? "phone-error" : undefined}
                                            />
                                            {errors.phone && (
                                                <p id="phone-error" className="mt-1 text-sm text-red-600">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="group_id" className="block text-sm font-medium text-gray-700">
                                                Group (Optional)
                                            </label>
                                            <select
                                                name="group_id" id="group_id"
                                                value={formData.group_id}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-lg border ${errors.group_id ? "border-red-500" : "border-gray-200"
                                                    } py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}

                                                aria-invalid={!!errors.phone}
                                                aria-describedby={errors.phone ? "phone-error" : undefined}
                                            >
                                                <option value="0">Select Group</option>
                                                {groups.length > 0 ? (
                                                    groups.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="0">No Groups Available</option>
                                                )}
                                            </select>
                                            {errors.phone && (
                                                <p id="phone-error" className="mt-1 text-sm text-red-600">
                                                    {errors.group_id}
                                                </p>
                                            )}
                                        </div>

                                        <div>
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
                                            onClick={onClose}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
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
    );
};

export default CustomerFormModal;
