// src/app/components/SyncConfirmationModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X, AlertTriangle } from 'lucide-react';

const SyncConfirmationModal = ({ isOpen, onClose, onConfirm, isSyncEnabled }) => {
    if (!isOpen) return null;

    const actionText = isSyncEnabled ? "disable" : "enable";
    const title = isSyncEnabled ? "Disable Cloud Sync?" : "Enable Cloud Sync?";
    const description = isSyncEnabled 
        ? "Your data will no longer be automatically backed up to the server. You can re-enable this at any time."
        : "Your data will be automatically backed up to the server, allowing you to restore it using your recovery code.";

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-start space-x-3">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-0 ml-4 text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                        onClick={onConfirm}
                    >
                        Yes, {actionText}
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SyncConfirmationModal;