// src/app/components/OvertimeBreakdownModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';

const BreakdownRow = ({ label, value, unit, bold = false }) => (
    <div className={`flex justify-between items-center py-2 ${bold ? 'font-bold' : ''}`}>
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-mono text-gray-800 dark:text-gray-100">{value} {unit}</span>
    </div>
);

const OvertimeBreakdownModal = ({ isOpen, onClose, entry }) => {
    if (!entry || !entry.calculationBreakdown) {
        return null;
    }

    const {
        duration,
        hourlyRate,
        rateModifier,
        estimatedPay
    } = entry.calculationBreakdown;

    const durationHours = Math.floor(duration / 60);
    const durationMinutes = duration % 60;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Overtime Breakdown</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4 text-sm">
                    <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Payment Calculation</h3>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700/60 border-y border-gray-200 dark:border-gray-700/60 px-2">
                            <BreakdownRow label="Overtime Duration" value={`${durationHours}h ${durationMinutes}m`} unit={`(${duration} mins)`} />
                            <BreakdownRow label="Your Hourly Rate" value={`£${hourlyRate}`} unit="" />
                            <BreakdownRow label="Rate Multiplier" value={`${rateModifier}x`} unit={entry.isEnhancedRate ? "(Enhanced)" : "(Standard)"} />
                            <BreakdownRow label="Estimated Pay" value={`£${estimatedPay}`} unit="" bold/>
                        </div>
                    </div>
                </div>

                 <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default OvertimeBreakdownModal;