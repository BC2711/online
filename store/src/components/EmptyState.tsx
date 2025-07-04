import React from 'react';
import { FiUsers } from 'react-icons/fi';

interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No Customers Found',
    description = 'There are no customers matching your criteria. Try adjusting your filters or add a new customer.',
    action,
}) => {
    return (
        <div className="text-center py-12 px-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            {action && (
                <div className="mt-6">
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
