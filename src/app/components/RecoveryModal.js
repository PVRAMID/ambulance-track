// src/app/components/RecoveryModal.js
'use client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { X, ShieldCheck, Copy, AlertTriangle, CloudDownload, Trash2 } from 'lucide-react';

const RecoveryModal = ({ isOpen, onClose, recoveryId, onRecover, onDelete, onForceUpdateFromServer }) => {
    const [inputCode, setInputCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // null, 'forceUpdate', 'delete'
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(recoveryId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRecovery = () => {
        if (inputCode.trim()) {
            onRecover(inputCode.trim());
        }
    };
    
    const handleConfirm = async () => {
        setIsProcessing(true);
        let success = false;
        if (confirmAction === 'forceUpdate') {
            success = await onForceUpdateFromServer();
        } else if (confirmAction === 'delete') {
            success = await onDelete();
        }
        setIsProcessing(false);
        setConfirmAction(null);
        if (success) {
            onClose(); // Close the modal only on success
        }
    };
    
    // Reset confirmation state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setConfirmAction(null);
            setIsProcessing(false);
            setInputCode('');
        }
    }, [isOpen]);

    const renderDefaultView = () => (
        <>
            {/* Your Recovery Code section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Your Recovery Code</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">This code is your key to restoring your data on a new device. Keep it safe and do not share it.</p>
                <div className="flex items-center space-x-2">
                    <input type="text" readOnly value={recoveryId} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 font-mono text-sm" />
                    <button onClick={handleCopy} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                        {isCopied ? <ShieldCheck className="w-5 h-5"/> : <Copy className="w-5 h-5"/>}
                    </button>
                </div>
            </div>
            
            {/* Restore from Code section */}
            <div className="border-t border-gray-200 dark:border-gray-700/60 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Restore from another device</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Enter a recovery code to restore its data. This will overwrite any data currently on this device.</p>
                <div className="flex items-center space-x-2">
                    <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Enter recovery code..." className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100" />
                    <button onClick={handleRecovery} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Restore</button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 dark:border-gray-700/60 pt-6 space-y-3">
                 <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                 <button onClick={() => setConfirmAction('forceUpdate')} className="w-full px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 dark:text-orange-400 transition-colors flex items-center justify-center space-x-2">
                    <CloudDownload className="w-4 h-4" />
                    <span>Force Update from Server</span>
                </button>
                <button onClick={() => setConfirmAction('delete')} className="w-full px-4 py-2 text-sm font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors flex items-center justify-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Server Backup</span>
                </button>
            </div>
        </>
    );

    const renderConfirmationView = () => {
        const isForceUpdate = confirmAction === 'forceUpdate';
        const title = isForceUpdate ? 'Confirm Force Update' : 'Confirm Deletion';
        const message = isForceUpdate 
            ? 'Are you sure? This will permanently delete all local data on this device and replace it with the data from the server. This action cannot be undone.'
            : 'Are you absolutely sure? This will permanently delete all your backed-up data from our servers. This action cannot be undone.';
        const buttonText = isForceUpdate ? 'Yes, Force Update' : 'Yes, Delete';
        const buttonColor = isForceUpdate ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400';

        return (
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{title}</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">{message}</p>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button onClick={() => setConfirmAction(null)} className="px-3 py-1.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                            <button onClick={handleConfirm} disabled={isProcessing} className={`px-3 py-1.5 text-sm font-semibold text-white rounded-lg ${buttonColor}`}>
                                {isProcessing ? 'Processing...' : buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recovery & Sync</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6">
                    {confirmAction ? renderConfirmationView() : renderDefaultView()}
                </div>
            </div>
        </Modal>
    );
};

export default RecoveryModal;
