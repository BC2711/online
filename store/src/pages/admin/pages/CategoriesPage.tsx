import React, { useEffect, useState, useCallback } from 'react';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowPathIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { SearchIcon, FrownIcon } from 'lucide-react';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory,
} from '../../../service/api/admin/category/category';
import { useAuth } from '../../../context/AuthContext';
import Pagination from '../../../components/Pagination';
import { debounce } from 'lodash';
import TableSkeleton from '../../../components/TableSkeleton';
import { Links, Meta } from '../../../service/interface';

// Define interfaces
interface CategoryError {
    name?: string[];
    description?: string[];
    message?: string;
}

interface Category {
    id: number;
    name: string;
    description: string; // Changed to required string to match CreateCategoryInput
    errors: {
        name: string[];
        description: string[];
    };
}

interface CreateCategoryInput {
    name: string;
    description: string;
    errors: {
        name: string[];
        description: string[];
    };
}

// Reusable ErrorMessages component
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

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [links, setLinks] = useState<Links | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Category;
        direction: 'ascending' | 'descending';
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const { authToken } = useAuth();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [error, setError] = useState<CategoryError | null>(null);
    const [newCategory, setNewCategory] = useState<CreateCategoryInput>({
        name: '',
        description: '',
        errors: { name: [], description: [] },
    });

    // Debounced search
    const debouncedFetchCategories = useCallback(
        debounce(() => {
            fetchCategories();
        }, 500),
        [authToken, currentPage, searchTerm, sortConfig]
    );

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!authToken) throw new Error('Authentication token is missing.');

            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            if (searchTerm) params.append('search', searchTerm);
            if (sortConfig) {
                params.append('sort_by', sortConfig.key);
                params.append('sort_dir', sortConfig.direction === 'ascending' ? 'asc' : 'desc');
            }

            const response = await getCategories(authToken, currentPage);
            if (response.success) {
                setCategories(response.data);
                setLinks(response.links);
                setMeta(response.meta);
            } else {
                throw new Error('Failed to fetch categories.');
            }
        } catch (err: any) {
            setError({ message: err.message || 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        debouncedFetchCategories();
        return () => debouncedFetchCategories.cancel();
    }, [debouncedFetchCategories]);

    // Handle Add/Edit Category Submission
    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);

        try {
            if (!authToken) throw new Error('Authentication token is missing.');

            if (editMode) {
                const updatedCategory = await updateCategory(authToken, editMode, newCategory);
                if (updatedCategory.id) {
                    setMessage('Category updated successfully!');
                } else {
                    setError({
                        message: updatedCategory.message || 'Failed to update category.',
                        name: updatedCategory.errors?.name || [],
                        description: updatedCategory.errors?.description || [],
                    });
                    return;
                }
            } else {
                const createdCategory = await createCategory(authToken, newCategory);
                if (createdCategory.id) {
                    setMessage('Category created successfully!');
                } else {
                    setError({
                        message: createdCategory.message || 'Failed to create category.',
                        name: createdCategory.errors?.name || [],
                        description: createdCategory.errors?.description || [],
                    });
                    return;
                }
            }

            await fetchCategories();
            setIsModalOpen(false);
            setNewCategory({ name: '', description: '', errors: { name: [], description: [] } });
            setEditMode(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError({ message: err.message || 'An unexpected error occurred while submitting the category.' });
        } finally {
            setFormLoading(false);
        }
    };

    // Handle Edit Category
    const handleEditCategory = async (id: number) => {
        try {
            if (!authToken) throw new Error('Authentication token is missing.');

            const category = await getCategoryById(authToken, id);
            if (category.success) {
                setNewCategory({
                    name: category.data.name,
                    description: category.data.description || '',
                    errors: { name: [], description: [] },
                });
                setEditMode(id);
                setIsModalOpen(true);
            } else {
                setError({ message: category.message || 'Failed to fetch category.' });
            }
        } catch (err: any) {
            setError({ message: err.message || 'An unexpected error occurred while fetching the category.' });
        }
    };

    // Handle Delete Category
    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

        setIsDeleting(id);
        setError(null);

        try {
            if (!authToken) throw new Error('Authentication token is missing.');

            const response = await deleteCategory(authToken, id);
            console.log('delete',response);
            if (!response.id) {
                throw new Error('Failed to delete category.');
            }
            setMessage(`Category ${response.name} deleted successfully !`);
            await fetchCategories();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError({ message: err.message || 'An unexpected error occurred while deleting the category.' });
        } finally {
            setIsDeleting(null);
        }
    };

    // Handle Pagination
    const handlePageChange = (url: string | null) => {
        if (url) {
            const page = new URL(url).searchParams.get('page');
            setCurrentPage(Number(page));
        }
    };

    // Dismiss Alerts
    const dismissMessage = () => setMessage(null);
    const dismissError = () => setError(null);

    // Reset search
    const resetSearch = () => {
        setSearchTerm('');
    };

    // Sorted categories
    const sortedCategories = [...categories].sort((a, b) => {
        if (!sortConfig) return 0;

        const key = sortConfig.key;
        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // Filtered categories
    const filteredCategories = sortedCategories.filter((category) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            category.name.toLowerCase().includes(term) ||
            (category.description && category.description.toLowerCase().includes(term))
        );
    });

    // Auto-focus input when modal opens
    useEffect(() => {
        if (isModalOpen) {
            const input = document.getElementById('category-name');
            input?.focus();
        }
    }, [isModalOpen]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Category Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {meta?.total ? `Total ${meta.total} categories` : 'Manage your product categories'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 min-w-[200px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={resetSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setEditMode(null);
                                setNewCategory({ name: '', description: '', errors: { name: [], description: [] } });
                                setError(null);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Alerts */}
                {message && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{message}</p>
                                </div>
                            </div>
                            <button
                                onClick={dismissMessage}
                                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
                {error?.message && !isModalOpen && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error.message}</p>
                                </div>
                            </div>
                            <button
                                onClick={dismissError}
                                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading/Error States */}
                {loading ? (
                    <TableSkeleton rows={10} columns={3} />
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {(['id', 'name', 'description'] as Array<keyof Category>).map((key) => (
                                            <th
                                                key={key}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => {
                                                    const direction =
                                                        sortConfig?.key === key && sortConfig.direction === 'ascending'
                                                            ? 'descending'
                                                            : 'ascending';
                                                    setSortConfig({ key, direction });
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="whitespace-nowrap">
                                                        {key === 'id' ? 'ID' : key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </span>
                                                    {sortConfig?.key === key ? (
                                                        sortConfig.direction === 'ascending' ? (
                                                            <ChevronUpIcon className="h-4 w-4 ml-1 text-gray-700" />
                                                        ) : (
                                                            <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-700" />
                                                        )
                                                    ) : (
                                                        <span className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-50 transition-opacity">
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {category.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="font-medium">{category.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {category.description || (
                                                        <span className="text-gray-300 italic">No description</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEditCategory(category.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50 transition-all"
                                                            title="Edit"
                                                            disabled={isDeleting === category.id}
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                            className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-all"
                                                            title="Delete"
                                                            disabled={isDeleting === category.id}
                                                        >
                                                            {isDeleting === category.id ? (
                                                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <TrashIcon className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <FrownIcon className="h-10 w-10 text-gray-400" />
                                                    <p className="text-gray-500">
                                                        {searchTerm ? (
                                                            <>
                                                                No categories match "<span className="font-medium">{searchTerm}</span>"
                                                            </>
                                                        ) : (
                                                            'No categories found'
                                                        )}
                                                    </p>
                                                    {searchTerm && (
                                                        <button
                                                            onClick={resetSearch}
                                                            className="text-sm text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Clear search
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {links && meta && meta.total > 0 && (
                    <div className="bg-gray-50">
                        <Pagination links={links} meta={meta} handlePageChange={handlePageChange} />
                    </div>
                )}

                {/* Add/Edit Category Modal */}
                {isModalOpen && (
                    <div
                        className="fixed z-50 inset-0 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                aria-hidden="true"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setNewCategory({ name: '', description: '', errors: { name: [], description: [] } });
                                    setEditMode(null);
                                    setError(null);
                                }}
                            ></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">

                            </span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                        <h3 id="modal-title" className="text-lg leading-6 font-medium text-gray-900">
                                            {editMode ? 'Edit Category' : 'Create New Category'}
                                        </h3>
                                        <div className="mt-4">
                                            {error?.message && (
                                                <div className="mb-4 rounded-md bg-red-50 p-3">
                                                    <p className="text-sm font-medium text-red-800">{error.message}</p>
                                                </div>
                                            )}
                                            <form onSubmit={handleSubmitCategory}>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="category-name"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        id="category-name"
                                                        type="text"
                                                        //    focus:ring-2 focus:ring-indigo-500 transition-colors
                                                        className={`block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors ${error?.name?.length
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 focus:outline-red-500'
                                                            : 'focus:ring-indigo-500 focus:border-indigo-500 focus:outline-blue-500'
                                                            }`}
                                                        value={newCategory.name}
                                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                                        placeholder="Enter category name"

                                                        disabled={formLoading}
                                                        aria-invalid={error?.name?.length ? 'true' : 'false'}
                                                        aria-describedby={error?.name?.length ? 'category-name-error' : undefined}
                                                    />
                                                    <ErrorMessages id="category-name-error" errors={error?.name} />
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="category-description"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="category-description"
                                                        rows={3}
                                                        className={`block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors ${error?.description?.length
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'focus:ring-indigo-500 focus:border-indigo-500 focus:outline-blue-500'
                                                            }`}
                                                        value={newCategory.description}
                                                        onChange={(e) =>
                                                            setNewCategory({ ...newCategory, description: e.target.value })
                                                        }
                                                        placeholder="Enter category description (optional)"
                                                        disabled={formLoading}
                                                        aria-describedby={
                                                            error?.description?.length ? 'category-description-error' : undefined
                                                        }
                                                    />
                                                    <ErrorMessages id="category-description-error" errors={error?.description} />
                                                </div>
                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        disabled={formLoading}
                                                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-opacity ${formLoading ? 'opacity-75 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        {formLoading ? (
                                                            <>
                                                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                                                {editMode ? 'Updating...' : 'Creating...'}
                                                            </>
                                                        ) : editMode ? 'Update Category' : 'Create Category'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsModalOpen(false);
                                                            setNewCategory({
                                                                name: '',
                                                                description: '',
                                                                errors: { name: [], description: [] },
                                                            });
                                                            setEditMode(null);
                                                            setError(null);
                                                        }}
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                                                        disabled={formLoading}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;