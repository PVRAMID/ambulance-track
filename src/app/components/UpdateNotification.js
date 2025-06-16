// src/app/components/UpdateNotification.js
'use client';
import { Rocket, X } from 'lucide-react';

const UpdateNotification = ({ isOpen, onClose, version }) => {
    if (!isOpen) {
        return null;
    }

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] bg-blue-600 text-white rounded-lg shadow-lg max-w-sm animate-pulse">
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    <Rocket className="h-6 w-6 flex-shrink-0" />
                    <div className="text-sm flex-1">
                        <p className="font-bold">Update Available!</p>
                        <p className="mt-1">
                            A new version ({version}) of ACTracker is available. Please refresh the page to get the latest features and fixes.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="mt-3 text-right">
                    <button onClick={handleRefresh} className="px-4 py-1.5 bg-white text-blue-600 font-semibold rounded-md text-xs hover:bg-gray-200 transition-colors">
                        Refresh Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotification;