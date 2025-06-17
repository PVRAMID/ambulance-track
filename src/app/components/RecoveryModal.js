// src/app/components/RecoveryModal.js
'use client';
import React, { useState } from 'react';
import Modal from './Modal';
import { X, ShieldCheck, Copy, AlertTriangle } from 'lucide-react';

const RecoveryModal = ({ isOpen, onClose, recoveryId, onRecover, onDelete }) => {
    const [inputCode, setInputCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    
    const handleDeleteRequest = () => {
        setShowDeleteConfirm(true);
    };
    
    const confirmDelete = () => {
        onDelete();
        setShowDeleteConfirm(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Account Recovery</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Your Recovery Code</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">This code is your key to restoring your data on a new device. Keep it safe and do not share it.</p>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text"
                                readOnly
                                value={recoveryId}
                                className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 font-mono text-sm"
                            />
                            <button onClick={handleCopy} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                {isCopied ? <ShieldCheck className="w-5 h-5"/> : <Copy className="w-5 h-5"/>}
                            </button>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700/60 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Restore from Code</h3>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Enter a recovery code to restore your backed-up data. This will overwrite any data currently on this device.</p>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="Enter recovery code..."
                                className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"
                            />
                            <button onClick={handleRecovery} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Restore</button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700/60 pt-6">
                         <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                         {showDeleteConfirm ? (
                             <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 rounded-lg">
                                <p className="text-sm font-bold text-red-800 dark:text-red-200">Are you absolutely sure?</p>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">This will permanently delete all your backed-up data from our servers. This action cannot be undone.</p>
                                <div className="mt-4 flex justify-end space-x-3">
                                    <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                                    <button onClick={confirmDelete} className="px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Yes, Delete</button>
                                </div>
                            </div>
                         ) : (
                            <button onClick={handleDeleteRequest} className="w-full px-4 py-2 text-sm font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors flex items-center justify-center space-x-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Delete Server Backup</span>
                            </button>
                         )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RecoveryModal;