'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import MonthlyEarnings from './components/MonthlyEarnings';
import EntriesSidebar from './components/EntriesSidebar';
import WelcomeModal from './components/WelcomeModal';
import EntryModal from './components/EntryModal';
import SettingsModal from './components/SettingsModal';
import Modal from './components/Modal';
import ClientOnly from './components/ClientOnly';
import { usePersistentState } from './hooks/usePersistentState';
import { PAY_BANDS, OVERTIME_RATE_ENHANCED, OVERTIME_RATE_STANDARD, STATIONS, MILEAGE_RATE } from './lib/constants';
import { getCoordsFromPostcode, getDistanceFromLatLonInMiles } from './lib/mileage';

export default function Home() {
    // --- STATE MANAGEMENT ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    
    const [entries, setEntries] = usePersistentState('ambulanceLogEntries_v4', {});
    const [editingEntry, setEditingEntry] = useState(null);

    const [settings, setSettings] = usePersistentState('ambulanceLogSettings_v4', {
        grade: '', band: '', step: '', station: '', userPostcode: ''
    });
    
    const [deleteRequest, setDeleteRequest] = useState(null);
    const [theme, setTheme] = usePersistentState('ambulanceLogTheme_v2', 'dark');
    const [sidebarView, setSidebarView] = useState('month');
    const [hasSeenWelcome, setHasSeenWelcome] = usePersistentState('hasSeenWelcome_v2', false);
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);


    // --- HANDLERS (No changes needed here) ---
    const handleOpenNewEntryModal = (day) => {
        setSelectedDate(day);
        setEditingEntry(null);
        setIsEntryModalOpen(true);
    };
    
    const handleOpenEditEntryModal = (entry, dateString) => {
        setSelectedDate(new Date(dateString + 'T12:00:00'));
        setEditingEntry(entry);
        setIsEntryModalOpen(true);
    };

    const handleCloseEntryModal = () => {
        setIsEntryModalOpen(false);
        setSelectedDate(null);
        setEditingEntry(null);
    };
    
    const handleSaveEntry = async (entryData) => {
        if (!selectedDate) return;

        let finalData = { ...entryData };

        // Overtime Calculation
        if (finalData.claimType === 'Late Finish') {
            const hourlyRate = settings.band && settings.step ? PAY_BANDS[settings.band]?.[settings.step] : 0;
            if (!hourlyRate) {
                alert('Please set your Pay Band and Step Point in Settings to calculate overtime pay.');
                finalData.overtimePay = 0;
            } else {
                const overtimeMinutes = (parseInt(finalData.overtimeHours || 0) * 60) + parseInt(finalData.overtimeMinutes || 0);
                const rateModifier = finalData.isEnhancedRate ? OVERTIME_RATE_ENHANCED : OVERTIME_RATE_STANDARD;
                const overtimePay = (hourlyRate / 60) * overtimeMinutes * rateModifier;
                finalData.overtimePay = overtimePay;
                finalData.overtimeDuration = overtimeMinutes;
            }
        }
        
        // Mileage Calculation
        if (finalData.claimType === 'Mileage') {
            if (finalData.manualMileage) {
                const claimableMileage = parseFloat(finalData.mileage || 0);
                finalData.mileagePay = claimableMileage * MILEAGE_RATE;
            } else {
                 try {
                    const homeCoords = await getCoordsFromPostcode(settings.userPostcode);
                    const destCoords = await getCoordsFromPostcode(finalData.destinationPostcode);
                    const baseStationPostcode = STATIONS.find(s => s.name === finalData.baseStation)?.postcode;
                    const baseCoords = await getCoordsFromPostcode(baseStationPostcode);

                    if (homeCoords && destCoords && baseCoords) {
                        const homeToDest = getDistanceFromLatLonInMiles(homeCoords.latitude, homeCoords.longitude, destCoords.latitude, destCoords.longitude);
                        const homeToBase = getDistanceFromLatLonInMiles(homeCoords.latitude, homeCoords.longitude, baseCoords.latitude, baseCoords.longitude);
                        
                        const totalJourney = homeToDest * 2;
                        const deduction = homeToBase * 2;
                        const claimableMileage = Math.max(0, totalJourney - deduction);
                        
                        finalData.mileage = claimableMileage.toFixed(2);
                        finalData.mileagePay = claimableMileage * MILEAGE_RATE;
                    } else {
                        throw new Error("Could not retrieve coordinates for one or more postcodes.");
                    }
                } catch (err) {
                    throw err; // Re-throw to be caught by the calling function
                }
            }
        }
        
        const dateString = selectedDate.toISOString().split('T')[0];
        
        setEntries(prevEntries => {
            const newEntries = JSON.parse(JSON.stringify(prevEntries));
            const dayEntries = newEntries[dateString] || [];

            if (editingEntry) {
                const entryIndex = dayEntries.findIndex(e => e.id === editingEntry.id);
                if (entryIndex > -1) {
                    dayEntries[entryIndex] = { ...finalData, id: editingEntry.id };
                }
            } else {
                dayEntries.push({ id: crypto.randomUUID(), ...finalData });
            }
            newEntries[dateString] = dayEntries;
            return newEntries;
        });
        handleCloseEntryModal();
    };

    const handleDeleteRequest = (entryId, dateString) => {
        setDeleteRequest({ entryId, dateString });
    };

    const confirmDelete = () => {
        if (!deleteRequest) return;
        const { entryId, dateString } = deleteRequest;

        setEntries(prevEntries => {
            const newEntries = JSON.parse(JSON.stringify(prevEntries));
            let dayEntries = newEntries[dateString] || [];
            dayEntries = dayEntries.filter(e => e.id !== entryId);

            if (dayEntries.length > 0) {
                newEntries[dateString] = dayEntries;
            } else {
                delete newEntries[dateString];
            }
            
            return newEntries;
        });
        setDeleteRequest(null);
        handleCloseEntryModal();
    };
    
    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        setIsSettingsModalOpen(false);
    };

    const handleExport = () => {
        const allEntries = Object.entries(entries).flatMap(([date, dayEntries]) =>
            dayEntries.map(entry => ({ ...entry, date }))
        ).sort((a, b) => new Date(a.date) - new Date(b.date));

        if (allEntries.length === 0) {
            alert("No data to export.");
            return;
        }

        const headers = [
            "Date", "Claim Type", "Callsign", "Incident Number", "Mileage", "Mileage Pay Est",
            "Overtime Duration (mins)", "Overtime Pay Est", "Details"
        ];
        
        const formatCsvField = (data) => {
            if (data === null || data === undefined) return '""';
            const string = String(data);
            if (string.includes('"') || string.includes(',')) {
                return `"${string.replace(/"/g, '""')}"`;
            }
            return `"${string}"`;
        };

        const csvRows = [headers.join(',')];
        
        allEntries.forEach(entry => {
            const row = [
                entry.date,
                entry.claimType || '',
                entry.callsign || '',
                entry.incidentNumber || '',
                entry.mileage || '',
                entry.mileagePay ? entry.mileagePay.toFixed(2) : '0.00',
                entry.overtimeDuration || 0,
                entry.overtimePay ? entry.overtimePay.toFixed(2) : '0.00',
                entry.details || ''
            ].map(formatCsvField).join(',');
            csvRows.push(row);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        const today = new Date().toISOString().split('T')[0];

        link.setAttribute("href", url);
        link.setAttribute("download", `Ambulance_Claims_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <main>
            <ClientOnly>
                <div className="flex flex-col xl:flex-row max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="flex-grow xl:pr-8">
                        <Header currentDate={currentDate} setCurrentDate={setCurrentDate} onExport={handleExport} onSettingsClick={() => setIsSettingsModalOpen(true)} theme={theme} setTheme={setTheme}/>
                        <div className="mt-4">
                           <Calendar currentDate={currentDate} onDateClick={handleOpenNewEntryModal} entries={entries} />
                        </div>
                        <MonthlyEarnings currentDate={currentDate} entries={entries} />
                    </div>
                    <aside className="w-full xl:w-96 mt-8 xl:mt-0 xl:pl-8 xl:border-l border-gray-200 dark:border-gray-700/60">
                         <div className="xl:sticky xl:top-8">
                           <EntriesSidebar entries={entries} onEdit={handleOpenEditEntryModal} view={sidebarView} setView={setSidebarView} currentDate={currentDate} />
                        </div>
                    </aside>
                </div>
                
                <WelcomeModal isOpen={!hasSeenWelcome} onClose={() => setHasSeenWelcome(true)} />

                {isEntryModalOpen && selectedDate && (
                    <EntryModal 
                        isOpen={isEntryModalOpen} 
                        onClose={handleCloseEntryModal} 
                        onSave={handleSaveEntry}
                        onDelete={handleDeleteRequest} 
                        selectedDate={selectedDate} 
                        existingEntry={editingEntry}
                        settings={settings}
                    />
                )}

                <SettingsModal 
                    isOpen={isSettingsModalOpen} 
                    onClose={() => setIsSettingsModalOpen(false)}
                    onSave={handleSaveSettings}
                    currentSettings={settings}
                />
                
                <Modal isOpen={!!deleteRequest} onClose={() => setDeleteRequest(null)}>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 my-4">Are you sure you want to delete this entry? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setDeleteRequest(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                        </div>
                    </div>
                </Modal>
            </ClientOnly>
        </main>
    );
}