// src/app/components/FeedbackModal.js
'use client';
import React, { useState } from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [feedbackType, setFeedbackType] = useState('Suggestion');
    const [details, setDetails] = useState('');
    const [name, setName] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ feedbackType, details, name, screenshot });
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            alert("There was an error submitting your feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Send Feedback</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Feedback Type</label>
                    <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                        <option>Suggestion</option>
                        <option>Bug</option>
                        <option>General Feedback</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Details</label>
                    <textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows="4" placeholder="Please provide as much detail as possible..." className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"></textarea>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Name (Optional)</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Screenshot (Optional)</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/40 dark:file:text-blue-300 dark:hover:file:bg-blue-900/60"/>
                </div>

                <div className="flex items-center justify-end pt-4 space-x-3">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default FeedbackModal;