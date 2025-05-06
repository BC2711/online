import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface Feedback {
    id: string;
    customerName: string;
    email: string;
    rating: number;
    comment: string;
    date: string;
    status: "pending" | "resolved" | "archived";
    tags: string[];
}

const CustomerFeedback: React.FC = () => {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([
        {
            id: "1",
            customerName: "Sarah Johnson",
            email: "sarah@example.com",
            rating: 5,
            comment: "Absolutely love the product! The quality exceeded my expectations and customer service was excellent.",
            date: "2023-06-15",
            status: "resolved",
            tags: ["product", "service"],
        },
        {
            id: "2",
            customerName: "Michael Chen",
            email: "michael@example.com",
            rating: 3,
            comment: "The product is good but delivery took longer than expected. Packaging could be better.",
            date: "2023-06-18",
            status: "pending",
            tags: ["delivery", "packaging"],
        },
        {
            id: "3",
            customerName: "Emma Williams",
            email: "emma@example.com",
            rating: 1,
            comment: "Very disappointed with my purchase. The item arrived damaged and customer support hasn't responded to my emails.",
            date: "2023-06-20",
            status: "pending",
            tags: ["damaged", "support"],
        },
        {
            id: "4",
            customerName: "David Kim",
            email: "david@example.com",
            rating: 4,
            comment: "Great value for money. Would recommend to friends. Minor issue with instructions not being clear.",
            date: "2023-06-22",
            status: "resolved",
            tags: ["value", "instructions"],
        },
    ]);

    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [activeTab, setActiveTab] = useState<"all" | Feedback["status"]>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [responseText, setResponseText] = useState("");
    const [isResponding, setIsResponding] = useState(false);

    const filteredFeedback = feedbackList.filter((feedback) => {
        const matchesStatus = activeTab === "all" || feedback.status === activeTab;
        const matchesSearch =
            feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = (id: string, newStatus: Feedback["status"]) => {
        setFeedbackList(
            feedbackList.map((feedback) =>
                feedback.id === id ? { ...feedback, status: newStatus } : feedback
            )
        );
        if (selectedFeedback?.id === id) {
            setSelectedFeedback({ ...selectedFeedback, status: newStatus });
        }
    };

    const sendResponse = () => {
        if (!selectedFeedback || !responseText.trim()) return;

        // In a real app, you would send this to your backend
        console.log(`Response sent to ${selectedFeedback.email}:`, responseText);

        // Mark as resolved if not already
        if (selectedFeedback.status !== "resolved") {
            handleStatusChange(selectedFeedback.id, "resolved");
        }

        setResponseText("");
        setIsResponding(false);
        alert("Response has been sent to the customer");
    };

    const getStatusColor = (status: Feedback["status"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            case "archived":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Customer Feedback</h1>
                    <p className="text-gray-600">Collect and review feedback from your customers.</p>
                </div>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                >
                    All Feedback
                </button>
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setActiveTab("resolved")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "resolved" ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Resolved
                </button>
                <button
                    onClick={() => setActiveTab("archived")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "archived" ? "bg-gray-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Archived
                </button>
            </div>

            {/* Feedback Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
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
                                    {filteredFeedback.length > 0 ? (
                                        filteredFeedback.map((feedback) => (
                                            <tr
                                                key={feedback.id}
                                                className={`hover:bg-gray-50 cursor-pointer ${
                                                    selectedFeedback?.id === feedback.id
                                                        ? "bg-blue-50"
                                                        : ""
                                                }`}
                                                onClick={() => setSelectedFeedback(feedback)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {feedback.customerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {feedback.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon
                                                                key={i}
                                                                className={`h-5 w-5 ${
                                                                    i < feedback.rating
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(feedback.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                            feedback.status
                                                        )}`}
                                                    >
                                                        {feedback.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            feedback.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 mr-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFeedback(feedback);
                                                            setIsResponding(true);
                                                        }}
                                                    >
                                                        Respond
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No feedback found matching your criteria
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Feedback Details Panel */}
                <div className="lg:col-span-1">
                    {selectedFeedback ? (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {selectedFeedback.customerName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedFeedback.email}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleStatusChange(selectedFeedback.id, "archived")
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                            title="Archive"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    selectedFeedback.id,
                                                    selectedFeedback.status === "resolved"
                                                        ? "pending"
                                                        : "resolved"
                                                )
                                            }
                                            className={
                                                selectedFeedback.status === "resolved"
                                                    ? "text-yellow-500 hover:text-yellow-700"
                                                    : "text-green-500 hover:text-green-700"
                                            }
                                            title={
                                                selectedFeedback.status === "resolved"
                                                    ? "Mark as pending"
                                                    : "Mark as resolved"
                                            }
                                        >
                                            {selectedFeedback.status === "resolved" ? (
                                                <ExclamationCircleIcon className="h-5 w-5" />
                                            ) : (
                                                <CheckCircleIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="flex mr-2">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${
                                                        i < selectedFeedback.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(selectedFeedback.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-gray-800">{selectedFeedback.comment}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">Tags:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFeedback.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {isResponding ? (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Your Response:</h4>
                                        <textarea
                                            value={responseText}
                                            onChange={(e) => setResponseText(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                                            rows={4}
                                            placeholder="Type your response here..."
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setIsResponding(false)}
                                                className="px-3 py-1 border border-gray-300 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={sendResponse}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Send Response
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsResponding(true)}
                                        className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                        Respond to Customer
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex items-center justify-center">
                            <div className="p-6 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No feedback selected
                                </h3>
                                <p className="mt-1 text-gray-500">
                                    Select a feedback entry from the list to view details
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerFeedback;