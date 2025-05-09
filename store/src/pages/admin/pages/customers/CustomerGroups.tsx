import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import {
  createCustomerGroup,
  getAllGroups,
  deleteCustomerGroup,
  Group,
  updateCustomerGroup,
} from "../../../../service/api/admin/customer/customer";
import { useAuth } from "../../../../context/AuthContext";
import TableSkeleton from "../../../../components/TableSkeleton";
import EmptyState from "../../../../components/EmptyState";
import { Links, Meta } from "../../../../service/interface";
import Pagination from "../../../../components/Pagination";
import { ArrowPathIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "../../../../components/ConfirmationModal";

interface GroupError {
  name?: string[];
  status?: string[];
  message?: string;
}

interface CreateGroupInput {
  name: string;
  status: string;
  errors: {
    name: string[];
    status: string[];
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

const CustomerGroups: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<GroupError | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { authToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState<Links | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newGroup, setNewGroup] = useState<CreateGroupInput>({
    name: "",
    status: "ACTIVE",
    errors: { name: [], status: [] },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<null | "ACTIVE" | "INACTIVE">(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group>();


  // Fetch groups with proper error handling
  const fetchGroups = useCallback(async () => {
    if (!authToken) setError({ message: "Authentication token is missing." });
    setLoading(true);
    setError(null);
    try {
      const response = await getAllGroups(authToken as string, currentPage, searchTerm, statusFilter);
      if (response.success) {
        setGroups(response.data)
        setMeta(response.meta)
        setLinks(response.links)
      } else {
        setError({ message: "Failed to Fetch Groups. Try again latter." })
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }, [authToken, currentPage, searchTerm, statusFilter])

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Handle input changes for the modal form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating a new group
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      setError({ message: "Authentication token is missing." });
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      const response = await (
        editGroupId ? updateCustomerGroup(authToken, editGroupId, { name: newGroup.name, status: newGroup.status })
          : createCustomerGroup(authToken, { name: newGroup.name, status: newGroup.status }));

      if (response.id) {
        setMessage(editGroupId ? "Group updated successfully!" : "Group created successfully!");
        await fetchGroups();
        setNewGroup({ name: "", status: '', errors: { name: [], status: [] } });
        setEditGroupId(null);
        setIsModalOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        messageRef.current?.focus();
      } else {
        setError({
          message: response.message || "Failed to save group.",
          name: response.errors?.name || [],
          status: response.errors?.status || [],
        });
      }
    } catch (err: any) {
      setError({ message: err.message || "An error occurred while saving the group." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditGroup = (group: Group) => {
    setNewGroup({ name: group.name, status: group.status, errors: { name: [], status: [] } });
    setEditGroupId(group.id);
    setIsModalOpen(true);
  };
  // Handle group deletion
  const deleteGroup = async () => {
    setIsDeleting(groupToDelete?.id);
    if (!authToken) setError({ message: "Authentication token is missing." });

    // if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

    try {
      const response = await deleteCustomerGroup(authToken as string, groupToDelete.id);
      if (response.id) {
        setMessage("Group deleted successfully!");
        await fetchGroups();
        window.scrollTo({ top: 0, behavior: "smooth" });
        messageRef.current?.focus();
      } else {
        setError({ message: "Failed to delete group." });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setIsDeleting(null);
      setError({ message: err.message || "An error occurred while deleting the group." });
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Auto-focus modal input
  useEffect(() => {
    if (isModalOpen) {
      const input = document.getElementById("name");
      input?.focus();
    }
  }, [isModalOpen]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customer Groups</h1>
          <p className="text-gray-600">Create and manage customer groups for targeted campaigns.</p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setNewGroup({ name: "", status: "ACTIVE", errors: { name: [], status: [] } });
            setError(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create New Group
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by group name..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-md ${statusFilter === null ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>All</button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-4 py-2 rounded-md ${statusFilter === "ACTIVE" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("INACTIVE")}
              className={`px-4 py-2 rounded-md ${statusFilter === "INACTIVE" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div
          ref={messageRef}
          tabIndex={-1}
          className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-green-700">{message}</p>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
              aria-label="Dismiss success message"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error?.message && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-700">{error.message}</p>
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
                setStatusFilter(null);
              },
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200  hover:border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
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
                {groups.map((group, index) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{group.name}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${group.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditGroup(group)}
                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50 transition-all"
                        title="Edit" disabled={isDeleting === group.id}
                      > <PencilIcon className="h-5 w-5" /> </button>
                      <button
                        onClick={() => {
                          setGroupToDelete(group);
                          setIsDeleteModalOpen(true);
                        }}

                        // onClick={() => deleteGroup(group.id)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-all"
                        title="Delete" disabled={isDeleting === group.id} >
                        {isDeleting === group.id ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (

                          <TrashIcon className="h-5 w-5" />
                        )}
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
      {meta && links && meta.total > 0 && (
        <Pagination links={links} meta={meta} handlePageChange={handlePageChange} />
      )}

      {/* Create Group Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          onKeyDown={(e) => {
            if (e.key === "Escape" && !formLoading) {
              setIsModalOpen(false);
              setNewGroup({ name: "", status: "ACTIVE", errors: { name: [], status: [] } });
              setError(null);
            }
          }}
          tabIndex={-1}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 id="modal-title" className="text-xl font-bold">
                  {editGroupId ? `Update ${newGroup.name}` : 'Create New Group'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewGroup({ name: "", status: "ACTIVE", errors: { name: [], status: [] } });
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                  disabled={formLoading}
                >
                  ✕
                </button>
              </div>
              {error?.message && (
                <div className="mb-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">{error.message}</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newGroup.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md transition-colors ${error?.name?.length
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    placeholder="Enter group name"
                    disabled={formLoading}
                    aria-invalid={error?.name?.length ? "true" : "false"}
                    aria-describedby={error?.name?.length ? "group-name-error" : undefined}
                  />
                  <ErrorMessages id="group-name-error" errors={error?.name} />
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newGroup.status}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md transition-colors ${error?.status?.length
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    disabled={formLoading}
                    aria-invalid={error?.status?.length ? "true" : "false"}
                    aria-describedby={error?.status?.length ? "group-status-error" : undefined}
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <ErrorMessages id="group-status-error" errors={error?.status} />
                </div>
                <div className="flex justify-end space-x-3">

                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewGroup({ name: "", status: "ACTIVE", errors: { name: [], status: [] } });
                      setError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 ${formLoading ? "cursor-not-allowed" : ""
                      }`}
                  >
                    {formLoading && (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {editGroupId ? 'Update Group' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteGroup}
        title="Delete Group"
        description={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger
      />
    </div>
  );
};

export default CustomerGroups;