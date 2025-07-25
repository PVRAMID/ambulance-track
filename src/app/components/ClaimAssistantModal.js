'use client';
import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { X, Copy, CheckCircle, ChevronDown, Calendar, Tag, Radio, FileText } from 'lucide-react';
import { SHIFT_CLAIM_TYPES } from '../lib/constants';

const ClaimAssistantModal = ({ isOpen, onClose, entries }) => {
    const [submittedClaims, setSubmittedClaims] = useState({});
    const [expandedRows, setExpandedRows] = useState({});

    const groupedEntries = useMemo(() => {
        const shiftTypes = Object.keys(SHIFT_CLAIM_TYPES);
        const filteredEntries = Object.entries(entries)
            .flatMap(([date, dayEntries]) => dayEntries.map(entry => ({ ...entry, date })))
            .filter(entry => !shiftTypes.includes(entry.claimType))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        return filteredEntries.reduce((acc, entry) => {
            const month = new Date(entry.date + 'T12:00:00').toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(entry);
            return acc;
        }, {});
    }, [entries]);

    const toggleSubmitted = (entryId) => {
        setSubmittedClaims(prev => ({ ...prev, [entryId]: !prev[entryId] }));
    };

    const toggleExpand = (entryId) => {
        setExpandedRows(prev => ({ ...prev, [entryId]: !prev[entryId] }));
    };

    const copyToClipboard = (entry) => {
        const entryDetails = `
Callsign: ${entry.callsign || 'N/A'}
Notes: ${entry.details || 'No notes.'}
        `.trim();
        navigator.clipboard.writeText(entryDetails);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} sizeClass="max-w-3xl">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Claim Assistant</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-3 -mr-3">
                    {Object.keys(groupedEntries).length > 0 ? Object.entries(groupedEntries).map(([month, monthEntries]) => (
                        <div key={month}>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2">{month}</h3>
                            <div className="space-y-2">
                                {monthEntries.map(entry => {
                                    const isSubmitted = submittedClaims[entry.id];
                                    const isExpanded = expandedRows[entry.id];
                                    const claimValue = entry.mileagePay || entry.pay;
                                    return (
                                        <div key={entry.id} className={`rounded-lg transition-all border ${isSubmitted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                                            <div className="p-3 flex items-center justify-between">
                                                <div className={`flex-grow ${isSubmitted ? 'opacity-50' : ''}`}>
                                                    <div className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                                        <span className={isSubmitted ? 'line-through' : ''}>{new Date(entry.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                                        <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                                        <Tag className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                                        <span className={isSubmitted ? 'line-through' : ''}>{entry.claimType}</span>
                                                        {claimValue && (
                                                            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full ${isSubmitted ? 'text-green-800 bg-green-200 dark:bg-green-900/50 dark:text-green-300' : 'text-blue-900 bg-blue-200 dark:bg-blue-300 dark:text-blue-900'}`}>
                                                                ~£{claimValue.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
                                                    {isSubmitted && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                    <button onClick={() => toggleSubmitted(entry.id)} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${isSubmitted ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                                                        {isSubmitted ? 'Unmark' : 'Mark'}
                                                    </button>
                                                    <button onClick={() => copyToClipboard(entry)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-full">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => toggleExpand(entry.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-full">
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>
                                            {isExpanded && (
                                                <div className={`px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700/60`}>
                                                    <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                                                        <div className="flex items-start">
                                                            <Radio className="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0"/>
                                                            <div>
                                                                <span className="font-semibold">Callsign:</span> {entry.callsign || 'N/A'}
                                                                {entry.incidentNumber && <> <span className="font-semibold ml-2">Incident:</span> {entry.incidentNumber}</>}
                                                            </div>
                                                        </div>
                                                         <div className="flex items-start">
                                                            <FileText className="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0"/>
                                                            <div>
                                                                <span className="font-semibold">Notes:</span>
                                                                <p className="whitespace-pre-wrap pl-1">{entry.details || 'No additional notes.'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">No allowance or mileage claims found.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ClaimAssistantModal;