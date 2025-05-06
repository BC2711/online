import React, { useCallback, useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { createCustomerGroup, getAllGroups, Group } from "../../../../service/api/admin/customer/customer";
import { useAuth } from "../../../../context/AuthContext";
import TableSkeleton from "../../../../components/TableSkeleton";
import EmptyState from "../../../../components/EmptyState";
import { Links, Meta } from "../../../../service/interface";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive" | "pending";
}

const CustomerGroups: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState<Links | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", status: "active" }); // Consolidated state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "pending">("all");

  // Fetch groups with proper error handling
  const fetchGroups = useCallback(async () => {
    if (!authToken) {
      setError("Authentication token is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getAllGroups(authToken, currentPage);
      if (response.success) {
        setGroups(response.data);
        setLinks(response.links);
        setMeta(response.meta);
      } else {
        setError("Failed to fetch groups. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching groups.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [authToken, currentPage]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Handle input changes for the modal form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating a new group
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      setError("Authentication token is missing.");
      return;
    }
    try {
      const newGroupId = await createCustomerGroup(authToken, { name: newGroup.name, status: newGroup.status, });
      if (newGroupId) {
        // setGroups((prevGroups) => [
        //   ...prevGroups,
        //   { id: newGroupId, name: newGroup.name, status: newGroup.status, description: newGroup.description },
        // ]);
        setNewGroup({ name: "", description: "", status: "active" });
        setIsModalOpen(false);
      } else {
        setError("Failed to create group. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while creating the group.");
      console.error(error);
    }
  };

  // Placeholder for delete API call
  const deleteGroup = async (id: number) => {
    if (!authToken) {
      setError("Authentication token is missing.");
      return;
    }
    try {
      // await deleteCustomerGroup(authToken, id);
      setGroups(groups.filter((group) => group.id !== id));
    } catch (error) {
      setError("An error occurred while deleting the group.");
      console.error(error);
    }
  };

  // Hardcoded customer data (replace with API call in production)
  const customers: Customer[] = [
    // ... (same as original)
  ];

  // Memoize filtered customers to avoid unnecessary re-computation
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination navigation
  const handlePageChange = (url: string | null) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      if (page) {
        setCurrentPage(Number(page));
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customer Groups</h1>
          <p className="text-gray-600">Create and manage customer groups for targeted campaigns.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create New Group
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
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
              onClick={fetchGroups}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              aria-label="Retry loading groups"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <TableSkeleton rows={3} columns={3} />
        ) : groups.length === 0 ? (
          <EmptyState
            title="No Groups Found"
            description="Try adjusting your filters or add a new group."
            action={{
              label: "Reset Filters",
              onClick: () => {
                setSearchTerm("");
                setStatusFilter("all");
              },
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr key={group.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{group.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{group.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button
                        onClick={() => deleteGroup(group.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && links && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {(meta.current_page - 1) * meta.per_page + 1} to{" "}
            {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(links.prev)}
              disabled={!links.prev}
              className="px-3 py-1 border rounded-md bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(links.next)}
              disabled={!links.next}
              className="px-3 py-1 border rounded-md bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Group</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newGroup.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newGroup.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div> */}
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newGroup.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customer List */}
      <div className="flex justify-between items-center mb-6 mt-12">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Add Customer
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-md ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-4 py-2 rounded-md ${statusFilter === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-4 py-2 rounded-md ${statusFilter === "inactive" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Inactive
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-md ${statusFilter === "pending" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroups;