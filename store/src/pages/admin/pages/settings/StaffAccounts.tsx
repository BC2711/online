import React, { useState } from 'react';

interface StaffMember {
    id: number;
    name: string;
    email: string;
    role: string;
    lastActive: string;
    status: 'active' | 'inactive';
}

const StaffAccounts: React.FC = () => {
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', lastActive: '2 hours ago', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', lastActive: '1 day ago', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Staff', lastActive: '1 week ago', status: 'inactive' },
    ]);

    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        role: 'Staff'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewStaff(prev => ({ ...prev, [name]: value }));
    };

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        const newStaffMember: StaffMember = {
            id: staffMembers.length + 1,
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role,
            lastActive: 'Just now',
            status: 'active'
        };
        setStaffMembers([...staffMembers, newStaffMember]);
        setNewStaff({ name: '', email: '', role: 'Staff' });
        setShowAddStaffModal(false);
    };

    const toggleStaffStatus = (id: number) => {
        setStaffMembers(staffMembers.map(member =>
            member.id === id
                ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
                : member
        ));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Staff Accounts</h1>
                <button
                    onClick={() => setShowAddStaffModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Add Staff Member
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {staffMembers.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium">{member.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.lastActive}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => toggleStaffStatus(member.id)}
                                        className={`mr-2 ${member.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                    >
                                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Staff Modal */}
            {showAddStaffModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Staff Member</h2>
                            <button onClick={() => setShowAddStaffModal(false)} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddStaff}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newStaff.name}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={newStaff.email}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={newStaff.role}
                                    onChange={handleInputChange}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddStaffModal(false)}
                                    className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAccounts;