// src/app/components/MonthlyEarnings.js
'use client';
import React, { useMemo } from 'react';
import { ALLOWANCE_CLAIM_TYPES } from '../lib/constants';
import { Coffee } from 'lucide-react';

const MonthlyEarnings = ({ currentDate, entries }) => {
    const { plannedOvertimeTotal, eosOvertimeTotal, mileageTotal, allowanceBreakdown, grandTotal } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        let plannedOvertimeTotal = 0;
        let eosOvertimeTotal = 0;
        let mileageTotal = 0;
        const allowanceBreakdown = Object.fromEntries(
            Object.keys(ALLOWANCE_CLAIM_TYPES).map(key => [key, 0])
        );

        Object.entries(entries).forEach(([dateString, dayEntries]) => {
            const entryDate = new Date(dateString + 'T12:00:00');
            if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
                dayEntries.forEach(entry => {
                    if (entry.claimType === 'Late Finish') {
                        eosOvertimeTotal += entry.overtimePay || 0;
                    } else if (entry.claimType === 'Overtime Shift') {
                        plannedOvertimeTotal += entry.overtimePay || 0;
                    } else if (entry.claimType === 'Mileage') {
                        mileageTotal += entry.mileagePay || 0;
                    } else if (entry.claimType in ALLOWANCE_CLAIM_TYPES) {
                        allowanceBreakdown[entry.claimType] += entry.pay || 0;
                    }
                });
            }
        });

        const allowanceTotal = Object.values(allowanceBreakdown).reduce((a, b) => a + b, 0);
        const grandTotal = plannedOvertimeTotal + eosOvertimeTotal + mileageTotal + allowanceTotal;

        return { plannedOvertimeTotal, eosOvertimeTotal, mileageTotal, allowanceBreakdown, grandTotal };
    }, [currentDate, entries]);

    return (
        <div className="mt-8 bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4"><strong>Estimated</strong> Earnings for {currentDate.toLocaleString('default', { month: 'long' })}</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Overtime (EOS):</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{eosOvertimeTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Planned Overtime:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{plannedOvertimeTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Total Mileage:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{mileageTotal.toFixed(2)}</span></div>
                
                {Object.entries(allowanceBreakdown).map(([type, total]) => {
                    if (total > 0) {
                        return (
                            <div key={type} className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">{type}:</span>
                                <span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{total.toFixed(2)}</span>
                            </div>
                        )
                    }
                    return null;
                })}
                
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700/60 pt-3 mt-3"><span className="text-gray-900 dark:text-white font-bold text-base">Month Total:</span><span className="font-mono text-green-600 dark:text-green-400 font-bold text-lg">£{grandTotal.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    All payment values are estimates, before tax and provide an estimation only.
                </p>
                <a 
                    href="https://ko-fi.com/pvramid" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                    <Coffee className="w-5 h-5 text-red-500" />
                    <span>Support the Developer</span>
                </a>
            </div>
        </div>
    );
};
export default MonthlyEarnings;