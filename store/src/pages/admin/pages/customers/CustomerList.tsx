import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FiSearch, FiFilter, FiPlus, FiRefreshCw } from "react-icons/fi";
import { Customer, getCustomers, deleteCustomer } from "../../../../service/api/admin/customer/customer";
import { useAuth } from "../../../../context/AuthContext";
import { formatDate } from "../../../../service/commonMethods";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Pagination from "../../../../components/Pagination";
import { Links, Meta, SortDirection } from "../../../../service/interface";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import TableSkeleton from "../../../../components/TableSkeleton";
import EmptyState from "../../../../components/EmptyState";
import StatusBadge from "./StatusBadge";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import CustomerFormModal from "./CustomerFormModal";

type StatusFilter = "all" | true | false;

const CustomerList: React.FC = () => {
  const { authToken } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [links, setLinks] = useState<Links | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: SortDirection } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setError(null);

      const response = await getCustomers(authToken as string, {
        page: currentPage,
        username: searchTerm,
        email: searchTerm,
        phone: searchTerm,
        is_active: statusFilter === "all" ? undefined : statusFilter,
        sort: sortConfig ? `${sortConfig.key}:${sortConfig.direction}` : undefined,
      });

      console.log('errors:', response);
      if (!response.success) {
        throw new Error("Failed to fetch customers");
      }

      setCustomers(response.data);
      setLinks(response.links);
      setMeta(response.meta);
    } catch (err) {
      // console.log("Customer response:", err); 
      setError(err instanceof Error ? err.message : "An error occurred: ");
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [authToken, currentPage, searchTerm, statusFilter, sortConfig]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      await deleteCustomer(authToken as string, customerToDelete.id);
      toast.success("Customer deleted successfully");
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete customer");
    }
  };

  const handleSort = (key: keyof Customer) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const handlePageChange = (url: string | null) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };

  const handleRefresh = () => {
    fetchCustomers();
  };

  const openFormModal = (customer: Customer | null = null) => {
    setSelectedCustomer(customer);
    setIsFormModalOpen(true);
  };

  const statusFilters = [
    { value: "all", label: "All" },
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  const tableHeaders = [
    { label: "Customer", key: "username", sortable: true },
    { label: "Email", key: "email", sortable: true },
    { label: "Phone", key: "phone", sortable: false },
    { label: "Join Date", key: "created_at", sortable: true },
    { label: "Status", key: "is_active", sortable: true },
    { label: "Actions", key: null, sortable: false },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="mt-2 text-sm text-gray-600">
            {meta?.total
              ? `Showing ${customers.length} of ${meta.total} customers`
              : "Manage your customer database"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            aria-label="Refresh customer list"
          >
            <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => openFormModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            aria-label="Add new customer"
          >
            <FiPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={(e) => debouncedSearch(e.target.value)}
              defaultValue={searchTerm}
              aria-label="Search customers"
            />

          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as StatusFilter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${statusFilter === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                aria-label={`Filter by ${filter.label} status`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all"
            onClick={() => toast.info("Advanced filters coming soon!")}
            aria-label="Open advanced filters"
          >
            <FiFilter className="h-4 w-4" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchCustomers}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              aria-label="Retry loading customers"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : customers.length === 0 ? (
          <EmptyState
            title="No Customers Found"
            description="Try adjusting your search or filter criteria, or add a new customer."
            action={{
              label: "Reset Filters",
              onClick: () => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortConfig(null);
              },
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header.label}
                      className={`px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${header.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                        }`}
                      onClick={() => header.sortable && header.key && handleSort(header.key as keyof Customer)}
                      aria-sort={
                        sortConfig?.key === header.key
                          ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.label}
                        {sortConfig?.key === header.key && (
                          <span className="text-gray-400">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-700 font-medium text-lg">
                            {customer.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.username}</div>
                          <div className="text-xs text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || "—"}</td>
                    <td className="px-6 underscoring py-4 text-sm text-gray-600">{formatDate(customer.created_at)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={customer.is_active ? "active" : "inactive"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openFormModal(customer)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label={`Edit ${customer.username}`}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setCustomerToDelete(customer);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
                          aria-label={`Delete ${customer.username}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {links && meta && meta.total > 0 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl shadow-sm">
          <Pagination
            links={links}
            meta={meta}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete "${customerToDelete?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger
      />

      {/* Create/Update Customer Modal */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={fetchCustomers}
      />
    </div>
  );
};

export default CustomerList;
