'use client';
import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { X, Copy, CheckCircle, ChevronDown } from 'lucide-react';
import { SHIFT_CLAIM_TYPES } from '../lib/constants';

const ClaimAssistantModal = ({ isOpen, onClose, entries }) => {
    const [submittedClaims, setSubmittedClaims] = useState({});
    const [expandedRows, setExpandedRows] = useState({});

    const allEntries = useMemo(() => {
        const shiftTypes = Object.keys(SHIFT_CLAIM_TYPES);
        return Object.entries(entries)
            .flatMap(([date, dayEntries]) => dayEntries.map(entry => ({ ...entry, date })))
            .filter(entry => !shiftTypes.includes(entry.claimType))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [entries]);

    const toggleSubmitted = (entryId) => {
        setSubmittedClaims(prev => ({
            ...prev,
            [entryId]: !prev[entryId]
        }));
    };

    const toggleExpand = (entryId) => {
        setExpandedRows(prev => ({
            ...prev,
            [entryId]: !prev[entryId]
        }));
    };

    const copyToClipboard = (entry) => {
        const entryDetails = `
Callsign: ${entry.callsign || 'N/A'}
Incident: ${entry.incidentNumber || 'N/A'}
Details: ${entry.details || 'No notes.'}
        `.trim();
        navigator.clipboard.writeText(entryDetails);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} sizeClass="max-w-3xl">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Claim Assistant</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                    {allEntries.length > 0 ? allEntries.map(entry => {
                        const isSubmitted = submittedClaims[entry.id];
                        const isExpanded = expandedRows[entry.id];
                        return (
                            <div key={entry.id} className={`rounded-lg transition-all ${isSubmitted ? 'bg-gray-100 dark:bg-gray-800 opacity-60' : 'bg-gray-50 dark:bg-gray-700/60'}`}>
                                <div className="p-3 flex items-center justify-between">
                                    <div className={`flex-grow ${isSubmitted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                        <p className="font-semibold text-sm">{entry.claimType} - {new Date(entry.date + 'T12:00:00').toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {entry.callsign || ''} {entry.incidentNumber || ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                        {isSubmitted && <CheckCircle className="w-5 h-5 text-green-500" />}
                                        <button onClick={() => toggleSubmitted(entry.id)} className={`px-2 py-1 text-xs font-semibold rounded-md ${isSubmitted ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                                            {isSubmitted ? 'Unmark' : 'Mark as Submitted'}
                                        </button>
                                        <button onClick={() => copyToClipboard(entry)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => toggleExpand(entry.id)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className={`px-4 pb-3 pt-1 border-t border-gray-200 dark:border-gray-600 ${isSubmitted ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <p className="text-xs font-semibold">Details:</p>
                                        <p className="text-xs mt-1 whitespace-pre-wrap">{entry.details || 'No additional notes.'}</p>
                                    </div>
                                )}
                            </div>
                        )
                    }) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">No allowance or mileage claims found.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ClaimAssistantModal;