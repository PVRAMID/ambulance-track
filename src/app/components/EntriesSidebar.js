'use client';
import React, { useMemo } from 'react';
import { ICONS, Icon } from '../lib/constants';

const EntriesSidebar = ({ entries, onEdit, view, setView, currentDate }) => {
    const sortedEntries = useMemo(() => {
        const allEntries = Object.entries(entries)
            .flatMap(([date, dayEntries]) => dayEntries.map(entry => ({...entry, date})));

        if (view === 'month') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            return allEntries
                .filter(entry => {
                    const entryDate = new Date(entry.date + 'T12:00:00');
                    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [entries, view, currentDate]);

    return (
        <div className="h-full">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Entries</h2>
            
            <div className="flex items-center bg-gray-200 dark:bg-gray-700/50 rounded-lg p-1 mb-4 transition-colors">
                 <button onClick={() => setView('month')} className={`w-1/2 text-sm py-1.5 rounded-md transition-all duration-300 ${view === 'month' ? 'bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>This Month</button>
                 <button onClick={() => setView('all')} className={`w-1/2 text-sm py-1.5 rounded-md transition-all duration-300 ${view === 'all' ? 'bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>All Time</button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 -mr-2">
                {sortedEntries.length > 0 ? sortedEntries.map(entry => (
                    <div key={entry.id} className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{entry.claimType}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.date + 'T12:00:00').toLocaleDateString()}</p>
                                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">Callsign: {entry.callsign}</p>
                                {entry.claimType === 'Late Finish' && entry.overtimeDuration > 0 && (
                                    <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 flex items-center"><Icon path={ICONS.Clock} className="w-3 h-3 mr-1" /> {Math.floor(entry.overtimeDuration/60)}h {entry.overtimeDuration % 60}m (~£{entry.overtimePay?.toFixed(2)})</div>
                                )}
                                {entry.claimType === 'Mileage' && (
                                     <p className="text-xs text-green-700 dark:text-green-400 mt-1">Claim: {parseFloat(entry.mileage).toFixed(2)} miles (~£{entry.mileagePay?.toFixed(2)})</p>
                                )}
                            </div>
                            <button onClick={() => onEdit(entry, entry.date)} className="p-1 text-gray-400 hover:text-gray-800 dark:hover:text-white"><Icon path={ICONS.Edit} className="w-4 h-4"/></button>
                        </div>
                    </div>
                )) : (<p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No entries for this period.</p>)}
            </div>
        </div>
    );
};
export default EntriesSidebar;