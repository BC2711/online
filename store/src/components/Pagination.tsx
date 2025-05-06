import React from 'react';

interface PaginationProps {
    links: {
        prev: string | null;
        next: string | null;
    };
    meta: {
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
    handlePageChange: (url: string | null) => void;
}

const Pagination: React.FC<PaginationProps> = ({ links, meta, handlePageChange }) => {
    if (!links || !meta) return null;

    return (
        <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
                Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} orders
            </p>
            <div className="flex space-x-2">
                <button
                    onClick={() => handlePageChange(links.prev)}
                    disabled={!links.prev}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${links.prev ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Previous
                </button>
                <button className="px-3 py-1 border rounded-md bg-white text-gray-700">
                    <span className="text-sm text-gray-600">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                </button>
                <button
                    onClick={() => handlePageChange(links.next)}
                    disabled={!links.next}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${links.next ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;