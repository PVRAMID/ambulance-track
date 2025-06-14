'use client';
import React, { useMemo } from 'react';
import { DISTURBED_MEAL_PAY, LUNCH_ALLOWANCE_PAY, EVENING_MEAL_ALLOWANCE_PAY } from '../lib/constants';

const MonthlyEarnings = ({ currentDate, entries }) => {
    const totals = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        let disturbedTotal = 0, lunchTotal = 0, eveningTotal = 0, overtimeTotal = 0, mileageTotal = 0;

        Object.entries(entries).forEach(([dateString, dayEntries]) => {
            const entryDate = new Date(dateString + 'T12:00:00');
            if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
                dayEntries.forEach(entry => {
                    if (entry.claimType === 'Disturbed Mealbreak') disturbedTotal += DISTURBED_MEAL_PAY;
                    if (entry.claimType === 'Lunch Allowance') lunchTotal += LUNCH_ALLOWANCE_PAY;
                    if (entry.claimType === 'Evening Meal Allowance') eveningTotal += EVENING_MEAL_ALLOWANCE_PAY;
                    if (entry.claimType === 'Late Finish' && entry.overtimePay) overtimeTotal += entry.overtimePay;
                    if (entry.claimType === 'Mileage' && entry.mileagePay) mileageTotal += entry.mileagePay;
                });
            }
        });
        return { disturbedTotal, lunchTotal, eveningTotal, overtimeTotal, mileageTotal };
    }, [currentDate, entries]);

    const grandTotal = totals.disturbedTotal + totals.lunchTotal + totals.eveningTotal + totals.overtimeTotal + totals.mileageTotal;

    return (
        <div className="mt-8 bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Earnings for {currentDate.toLocaleString('default', { month: 'long' })}</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Total Overtime:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{totals.overtimeTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Total Mileage:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{totals.mileageTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Total Disturbed:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{totals.disturbedTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Lunch Allowances:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{totals.lunchTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Evening Meal Allowances:</span><span className="font-mono text-gray-900 dark:text-gray-100 font-semibold">£{totals.eveningTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700/60 pt-3 mt-3"><span className="text-gray-900 dark:text-white font-bold text-base">Month Total:</span><span className="font-mono text-green-600 dark:text-green-400 font-bold text-lg">£{grandTotal.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    All payment values are estimates, before tax and provide an estimation only.
                </p>
            </div>
        </div>
    );
};
export default MonthlyEarnings;