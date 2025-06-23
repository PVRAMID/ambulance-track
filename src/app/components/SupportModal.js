// src/app/components/SupportModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X, MessageSquare, LifeBuoy } from 'lucide-react';

const SupportModal = ({ isOpen, onClose, onFeedbackClick, onTicketClick }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Support & Feedback</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => { onFeedbackClick(); onClose(); }}
                        className="w-full flex items-center p-4 bg-gray-100 dark:bg-gray-700/60 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <MessageSquare className="w-6 h-6 mr-4 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">Submit Feedback</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Have a suggestion or found a bug?</p>
                        </div>
                    </button>
                    <button
                        onClick={() => { onTicketClick(); onClose(); }}
                        className="w-full flex items-center p-4 bg-gray-100 dark:bg-gray-700/60 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <LifeBuoy className="w-6 h-6 mr-4 text-green-600 dark:text-green-400" />
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">Open Support Ticket</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get help with an issue.</p>
                        </div>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SupportModal;