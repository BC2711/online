import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Interfaces
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  danger?: boolean;
  confirmButtonColor?: string;
  closeOnConfirm?: boolean;
  icon?: 'warning' | 'info' | null;
}

// Main Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  danger = false,
  confirmButtonColor = 'bg-blue-600',
  closeOnConfirm = true,
  icon = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Set initial focus on confirm button when modal opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle confirm action with loading state
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      if (closeOnConfirm) {
        onClose();
      }
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render icon based on prop
  const renderIcon = () => {
    if (!icon) return null;
    const IconComponent = icon === 'warning' ? ExclamationTriangleIcon : InformationCircleIcon;
    const iconColor = danger ? 'text-red-500' : 'text-blue-500';
    return <IconComponent className={`h-6 w-6 ${iconColor} mb-2`} aria-hidden="true" />;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
        // Ensure focus trapping for accessibility
        initialFocus={confirmButtonRef}
        // ARIA attributes for screen readers
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        {/* Background overlay */}
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
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center text-center">
                  {renderIcon()}
                  <Dialog.Title
                    as="h3"
                    id="confirmation-modal-title"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p
                      id="confirmation-modal-description"
                      className="text-sm text-gray-500"
                    >
                      {description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    ref={confirmButtonRef}
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${danger
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : `${confirmButtonColor} hover:${confirmButtonColor.replace('bg-', 'bg-').replace('-600', '-700')} focus:ring-blue-500`
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleConfirm}
                    disabled={isLoading}
                    // Allow Enter key to trigger confirm
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        handleConfirm();
                      }
                    }}
                  >
                    {isLoading ? (
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : null}
                    {confirmText}
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

export default ConfirmationModal;