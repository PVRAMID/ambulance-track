// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/components/EntriesSidebar.js
'use client';
import React, { useMemo } from 'react';
import { Clock, Info, Edit } from 'lucide-react';

const EntriesSidebar = ({ entries, onEdit, onShowBreakdown, view, setView, currentDate }) => {
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
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Entries</h2>
            
            <div className="flex items-center bg-gray-200 dark:bg-gray-700/60 rounded-xl p-1 mb-4 transition-colors">
                 <button onClick={() => setView('month')} className={`w-1/2 text-sm py-2 rounded-lg transition-all duration-300 ${view === 'month' ? 'bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-gray-100 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>This Month</button>
                 <button onClick={() => setView('all')} className={`w-1/2 text-sm py-2 rounded-lg transition-all duration-300 ${view === 'all' ? 'bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-gray-100 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>All Time</button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 -mr-3">
                {sortedEntries.length > 0 ? sortedEntries.map(entry => (
                    <div key={entry.id} className="bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{entry.claimType}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(entry.date + 'T12:00:00').toLocaleDateString()}</p>
                                <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">Callsign: {entry.callsign}</p>
                                {entry.claimType === 'Late Finish' && entry.overtimeDuration > 0 && (
                                    <div className="text-xs text-yellow-800 dark:text-yellow-400 mt-1.5 flex items-center font-medium"><Clock className="w-3.5 h-3.5 mr-1.5" /> {Math.floor(entry.overtimeDuration/60)}h {entry.overtimeDuration % 60}m (~£{entry.overtimePay?.toFixed(2)})</div>
                                )}
                                {entry.claimType === 'Mileage' && (
                                     <p className="text-xs text-green-800 dark:text-green-400 mt-1.5 font-medium">Claim: {parseFloat(entry.mileage).toFixed(2)} miles (~£{entry.mileagePay?.toFixed(2)})</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-1">
                                {entry.claimType === 'Mileage' && entry.calculationBreakdown && (
                                     <button onClick={() => onShowBreakdown(entry)} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"><Info className="w-4 h-4"/></button>
                                )}
                                <button onClick={() => onEdit(entry, entry.date)} className="p-1.5 text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"><Edit className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>
                )) : (<p className="text-gray-500 dark:text-gray-400 text-sm text-center py-10">No entries for this period.</p>)}
            </div>
        </div>
    );
};
export default EntriesSidebar;