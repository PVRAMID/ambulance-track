// src/app/components/StorageWarning.js
'use client';
import { AlertTriangle, X } from 'lucide-react';

const StorageWarning = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white shadow-lg animate-pulse">
            <div className="max-w-7xl mx-auto p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-bold">Storage Access Warning</p>
                            <p className="mt-1">
                                This application cannot access your browser&apos;s local storage, which may be due to using a private or incognito window. Your data <strong>will not be saved</strong> when you close this tab. To save your data, please use a standard browser window. You can still use the app, but remember to use the <strong>Download button</strong> to export your records before you leave.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StorageWarning;