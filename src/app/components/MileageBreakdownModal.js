'use client';
import React from 'react';
import Modal from './Modal';
import { ICONS, Icon } from '../lib/constants';

const BreakdownRow = ({ label, value, unit, bold = false }) => (
    <div className={`flex justify-between items-center py-2 ${bold ? 'font-bold' : ''}`}>
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-mono text-gray-800 dark:text-gray-100">{value} {unit}</span>
    </div>
);

const MileageBreakdownModal = ({ isOpen, onClose, entry }) => {
    if (!entry || !entry.calculationBreakdown) {
        return null;
    }

    const {
        homeToWork,
        homeToBase,
        totalJourneyToWork,
        usualJourneyToBase,
        claimableMileage,
        mileageRate,
        estimatedPay
    } = entry.calculationBreakdown;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mileage Breakdown</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Icon path={ICONS.X} className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4 text-sm">
                    {/* Mileage Calculation Section */}
                    <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Mileage Calculation</h3>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700/60 border-y border-gray-200 dark:border-gray-700/60 px-2">
                            <BreakdownRow label="Round trip to working station" value={`(${homeToWork} x 2)`} unit="miles"/>
                            <BreakdownRow label="Equals" value={totalJourneyToWork} unit="miles"/>
                            <BreakdownRow label="Usual round trip to base" value={`(${homeToBase} x 2)`} unit="miles"/>
                             <BreakdownRow label="Equals" value={usualJourneyToBase} unit="miles"/>
                            <BreakdownRow label="Claimable mileage" value={`${totalJourneyToWork} - ${usualJourneyToBase}`} unit="miles" bold/>
                            <BreakdownRow label="Total" value={claimableMileage} unit="miles" bold/>
                        </div>
                    </div>

                    {/* Payment Calculation Section */}
                    <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Payment Calculation</h3>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700/60 border-y border-gray-200 dark:border-gray-700/60 px-2">
                            <BreakdownRow label="Claimable mileage" value={claimableMileage} unit="miles"/>
                            <BreakdownRow label="Mileage rate" value={`£${mileageRate.toFixed(2)}`} unit="per mile"/>
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

export default MileageBreakdownModal;