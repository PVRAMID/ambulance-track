'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import MonthlyEarnings from './components/MonthlyEarnings';
import EntriesSidebar from './components/EntriesSidebar';
import WelcomeModal from './components/WelcomeModal';
import EntryModal from './components/EntryModal';
import SettingsModal from './components/SettingsModal';
import MileageBreakdownModal from './components/MileageBreakdownModal';
import FeedbackModal from './components/FeedbackModal';
import ChangelogModal from './components/ChangelogModal';
import AboutModal from './components/AboutModal';
import StorageWarning from './components/StorageWarning';
import Modal from './components/Modal';
import ClientOnly from './components/ClientOnly';
import Footer from './components/Footer';
import { usePersistentState } from './hooks/usePersistentState';
import { PAY_BANDS, OVERTIME_RATE_ENHANCED, OVERTIME_RATE_STANDARD, DIVISIONS_AND_STATIONS, MILEAGE_RATE } from './lib/constants';
import { getCoordsFromPostcode, getDistanceFromLatLonInMiles } from './lib/mileage';
import { sendAnalyticsEvent } from './lib/analytics'; // Import the new analytics function

export default function Home() {
    // --- STATE MANAGEMENT ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [showStorageWarning, setShowStorageWarning] = useState(false);

    const [entries, setEntries] = usePersistentState('ambulanceLogEntries_v6', {});
    const [editingEntry, setEditingEntry] = useState(null);
    const [breakdownEntry, setBreakdownEntry] = useState(null);

    const [settings, setSettings] = usePersistentState('ambulanceLogSettings_v6', {
        grade: '', band: '', step: '', division: '', station: '', userPostcode: ''
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

    useEffect(() => {
        // Check for Local Storage availability on client mount
        try {
            const testKey = 'actracker-storage-test';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
        } catch (e) {
            setShowStorageWarning(true);
        }
    }, []);

    // --- HANDLERS ---
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

    const handleOpenBreakdownModal = (entry) => {
        setBreakdownEntry(entry);
        setIsBreakdownModalOpen(true);
    };

    const handleCloseBreakdownModal = () => {
        setIsBreakdownModalOpen(false);
        setBreakdownEntry(null);
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
            try {
                let homeCoords, baseCoords, workCoords;

                try {
                    homeCoords = await getCoordsFromPostcode(settings.userPostcode);
                } catch (e) {
                    throw new Error(`Your Home Postcode ('${settings.userPostcode}') could not be found. Please check it in Settings.`);
                }

                try {
                    const baseStationPostcode = DIVISIONS_AND_STATIONS[settings.division]?.find(s => s.name === settings.station)?.postcode;
                    if (!baseStationPostcode) throw new Error('Your Base Station is not selected or invalid. Please check it in Settings.');
                    baseCoords = await getCoordsFromPostcode(baseStationPostcode);
                } catch (e) {
                    throw new Error(`Your Base Station's postcode could not be found. Please check your selection in Settings.`);
                }

                try {
                    const workingStationPostcode = DIVISIONS_AND_STATIONS[finalData.workingDivision]?.find(s => s.name === finalData.workingStation)?.postcode;
                    if (!workingStationPostcode) throw new Error('The selected Working Station is invalid.');
                    workCoords = await getCoordsFromPostcode(workingStationPostcode);
                } catch (e) {
                    throw new Error(`The Working Station's postcode could not be found.`);
                }
                
                const homeToWork = getDistanceFromLatLonInMiles(homeCoords.latitude, homeCoords.longitude, workCoords.latitude, workCoords.longitude);
                const homeToBase = getDistanceFromLatLonInMiles(homeCoords.latitude, homeCoords.longitude, baseCoords.latitude, baseCoords.longitude);
                
                const totalJourneyToWork = homeToWork * 2;
                const usualJourneyToBase = homeToBase * 2;
                
                const claimableMileage = Math.max(0, totalJourneyToWork - usualJourneyToBase);
                
                finalData.mileage = claimableMileage.toFixed(2);
                finalData.mileagePay = claimableMileage * MILEAGE_RATE;

                // --- Store calculation for breakdown view ---
                finalData.calculationBreakdown = {
                    homeToWork: homeToWork.toFixed(2),
                    homeToBase: homeToBase.toFixed(2),
                    totalJourneyToWork: totalJourneyToWork.toFixed(2),
                    usualJourneyToBase: usualJourneyToBase.toFixed(2),
                    claimableMileage: claimableMileage.toFixed(2),
                    mileageRate: MILEAGE_RATE,
                    estimatedPay: (claimableMileage * MILEAGE_RATE).toFixed(2)
                };

            } catch (err) {
                throw err;
            }
        }
        
        const dateString = selectedDate.toISOString().split('T')[0];
        const eventType = editingEntry ? 'Update' : 'Creation';
        
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
        
        sendAnalyticsEvent(eventType, finalData);
        handleCloseEntryModal();
    };

    const handleDeleteRequest = (entryId, dateString) => {
        setDeleteRequest({ entryId, dateString });
    };

    const confirmDelete = () => {
        if (!deleteRequest) return;
        const { entryId, dateString } = deleteRequest;
        
        const entryToDelete = entries[dateString]?.find(e => e.id === entryId);

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

        if (entryToDelete) {
            sendAnalyticsEvent('Deletion', entryToDelete);
        }
        
        setDeleteRequest(null);
        handleCloseEntryModal();
    };
    
    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        setIsSettingsModalOpen(false);
    };

    const handleSendFeedback = async ({ feedbackType, details, name, screenshot }) => {
        const webhookUrl = 'https://discord.com/api/webhooks/1383407070425911336/HSB7813qTZy4SOPEP-0H2XfE6kzE3UQA5JwR17SRdjaDrHdJgk3MreI7KU83p2kNhKjB';
        
        const embed = {
            title: `New Feedback: ${feedbackType}`,
            description: details,
            color: 5814783, // A nice blue color
            fields: [],
            timestamp: new Date().toISOString(),
        };

        if (name) {
            embed.fields.push({ name: 'Submitted By', value: name, inline: true });
        }
        
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

        if (screenshot) {
            formData.append('file', screenshot);
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Webhook failed with status: ${response.status}`);
        }

        // If submission is successful, show the alert
        if (window.Swal) {
            window.Swal.fire({
                title: 'Success!',
                text: 'Your feedback has been sent.',
                icon: 'success',
                confirmButtonText: 'Great!',
                background: theme === 'dark' ? '#1f2937' : '#ffffff',
                color: theme === 'dark' ? '#f3f4f6' : '#111827'
            });
        }
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
            "Date", "Claim Type", "Callsign", "Incident Number", "Working Station", "Mileage", "Mileage Pay Est",
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
                entry.workingStation || '',
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
        <div className="flex flex-col min-h-screen">
            <StorageWarning isOpen={showStorageWarning} onClose={() => setShowStorageWarning(false)} />
            <main className="flex-grow pt-16">
                <ClientOnly>
                    <div className="flex flex-col xl:flex-row max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="flex-grow xl:pr-8">
                            <Header 
                                currentDate={currentDate} 
                                setCurrentDate={setCurrentDate} 
                                onExport={handleExport} 
                                onSettingsClick={() => setIsSettingsModalOpen(true)}
                                onFeedbackClick={() => setIsFeedbackModalOpen(true)}
                                theme={theme} 
                                setTheme={setTheme}
                            />
                            <div className="mt-4">
                               <Calendar currentDate={currentDate} onDateClick={handleOpenNewEntryModal} entries={entries} />
                            </div>
                            <MonthlyEarnings currentDate={currentDate} entries={entries} />
                        </div>
                        <aside className="w-full xl:w-96 mt-8 xl:mt-0 xl:pl-8 xl:border-l border-gray-200 dark:border-gray-700/60">
                             <div className="xl:sticky xl:top-8">
                               <EntriesSidebar entries={entries} onEdit={handleOpenEditEntryModal} onShowBreakdown={handleOpenBreakdownModal} view={sidebarView} setView={setSidebarView} currentDate={currentDate} />
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
                    
                    <FeedbackModal
                        isOpen={isFeedbackModalOpen}
                        onClose={() => setIsFeedbackModalOpen(false)}
                        onSubmit={handleSendFeedback}
                    />

                    <ChangelogModal 
                        isOpen={isChangelogModalOpen}
                        onClose={() => setIsChangelogModalOpen(false)}
                    />

                    <AboutModal
                        isOpen={isAboutModalOpen}
                        onClose={() => setIsAboutModalOpen(false)}
                    />

                    <MileageBreakdownModal 
                        isOpen={isBreakdownModalOpen}
                        onClose={handleCloseBreakdownModal}
                        entry={breakdownEntry}
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
            <Footer 
                onChangelogClick={() => setIsChangelogModalOpen(true)}
                onAboutClick={() => setIsAboutModalOpen(true)}
            />
        </div>
    );
}