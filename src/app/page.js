'use client';

import React from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import MonthlyEarnings from './components/MonthlyEarnings';
import EntriesSidebar from './components/EntriesSidebar';
import WelcomeModal from './components/WelcomeModal';
import EntryModal from './components/EntryModal';
import SettingsModal from './components/SettingsModal';
import MileageBreakdownModal from './components/MileageBreakdownModal';
import OvertimeBreakdownModal from './components/OvertimeBreakdownModal';
import FeedbackModal from './components/FeedbackModal';
import SupportModal from './components/SupportModal';
import TicketSystemModal from './components/TicketSystemModal';
import ChangelogModal from './components/ChangelogModal';
import AboutModal from './components/AboutModal';
import RecoveryModal from './components/RecoveryModal';
import SyncConfirmationModal from './components/SyncConfirmationModal';
import StorageWarning from './components/StorageWarning';
import UpdateNotification from './components/UpdateNotification';
import InformationModal from './components/InformationModal';
import AdminModal from './components/AdminModal';
import ClaimAssistantModal from './components/ClaimAssistantModal';
import Modal from './components/Modal';
import ClientOnly from './components/ClientOnly';
import AnnouncementsModal from './components/AnnouncementsModal';
import Footer from './components/Footer';
import { useAppLogic } from './hooks/useAppLogic';

export default function Home() {
    const {
        currentDate,
        selectedDate,
        editingEntry,
        breakdownEntry,
        overtimeBreakdownEntry,
        deleteRequest,
        entries,
        settings,
        theme,
        sidebarView,
        hasSeenWelcome,
        userId,
        isSyncEnabled,
        syncStatus,
        modals,
        notifications,
        hasUnread,
        announcements,
        tickets,
        unreadTicketCount,
        user,
        handleAdminAction,
        handleMarkAnnouncementsAsRead,
        handleNewTicket,
        handleReplyToTicket,
        getMessagesForTicket,
        handleMarkTicketAsRead,
        setCurrentDate,
        setSidebarView,
        setTheme,
        setHasSeenWelcome,
        handleSaveEntry,
        handleSetEditingEntry,
        confirmDelete,
        handleSaveSettings,
        handleToggleSync,
        handleRecoverData,
        handleDeleteServerData,
        handleForceSync,
        handleForceUpdateFromServer,
    } = useAppLogic();

    const handleSendFeedback = async ({ feedbackType, details, name, screenshot }) => {
        const webhookUrl = process.env.NEXT_PUBLIC_FEEDBACKWEBHOOKURL
        
        const embed = {
            title: `New Feedback: ${feedbackType}`,
            description: details,
            color: 5814783,
            fields: [],
            footer: { text: `User ID: ${userId}` },
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

        const headers = ["Date", "Claim Type", "Callsign", "Incident Number", "Working Station", "Mileage", "Mileage Pay Est", "Overtime Duration (mins)", "Overtime Pay Est", "Allowance Pay", "Details"];
        
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
                entry.pay ? entry.pay.toFixed(2) : '0.00',
                entry.details || ''
            ].map(formatCsvField).join(',');
            csvRows.push(row);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Ambulance_Claims_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFormattedDateString = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dateString = getFormattedDateString(selectedDate);
    const entriesForDay = dateString && entries[dateString] ? entries[dateString] : [];
    
    return (
        <div className="flex flex-col min-h-screen">
            <StorageWarning isOpen={notifications.storage.isOpen} onClose={notifications.storage.close} />
            <UpdateNotification isOpen={notifications.update.isOpen} onClose={notifications.update.close} version={notifications.update.version} />
            
            <main className="flex-grow pt-16">
                <ClientOnly>
                    <div className="flex flex-col xl:flex-row max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="flex-grow xl:pr-8">
                            <Header 
                                currentDate={currentDate} 
                                setCurrentDate={setCurrentDate} 
                                onExport={handleExport} 
                                onSettingsClick={modals.settings.open}
                                onSupportClick={modals.support.open}
                                onRecoveryClick={modals.recovery.open}
                                onSyncToggleClick={modals.syncConfirm.open}
                                onForceSyncClick={handleForceSync}
                                isSyncEnabled={isSyncEnabled}
                                syncStatus={syncStatus}
                                theme={theme} 
                                setTheme={setTheme}
                                onAnnouncementsClick={modals.announcements.open}
                                hasUnread={hasUnread}
                                unreadTicketCount={unreadTicketCount}
                                onTicketSystemClick={modals.ticketSystem.open}
                            />
                            <div className="mt-4">
                               <Calendar currentDate={currentDate} onDateClick={modals.entry.open} entries={entries} settings={settings} />
                            </div>
                            <MonthlyEarnings currentDate={currentDate} entries={entries} />
                        </div>
                        <aside className="w-full xl:w-96 mt-8 xl:mt-0 xl:pl-8 xl:border-l border-gray-200 dark:border-gray-700/60">
                             <div className="xl:sticky xl:top-8">
                               <EntriesSidebar 
                                   entries={entries} 
                                   onEdit={modals.entry.openEdit} 
                                   onShowBreakdown={modals.breakdown.open} 
                                   onShowOvertimeBreakdown={modals.overtimeBreakdown.open}
                                   view={sidebarView} 
                                   setView={setSidebarView} 
                                   currentDate={currentDate} 
                                   onOpenClaimAssistant={modals.claimAssistant.open}
                                />
                            </div>
                        </aside>
                    </div>
                    
                    <WelcomeModal isOpen={!hasSeenWelcome} onClose={() => setHasSeenWelcome(true)} />

                    {modals.entry.isOpen && selectedDate && (
                        <EntryModal 
                            isOpen={modals.entry.isOpen} 
                            onClose={modals.entry.close} 
                            onSave={handleSaveEntry}
                            onDelete={modals.delete.open} 
                            selectedDate={selectedDate} 
                            existingEntry={editingEntry}
                            settings={settings}
                            entriesForDay={entriesForDay}
                            onSelectForEdit={handleSetEditingEntry}
                        />
                    )}

                    <SettingsModal 
                        isOpen={modals.settings.isOpen} 
                        onClose={modals.settings.close}
                        onSave={handleSaveSettings}
                        currentSettings={settings}
                    />
                    
                    <RecoveryModal
                        isOpen={modals.recovery.isOpen}
                        onClose={modals.recovery.close}
                        recoveryId={userId}
                        onRecover={handleRecoverData}
                        onDelete={handleDeleteServerData}
                        onForceUpdateFromServer={handleForceUpdateFromServer}
                    />

                    <SyncConfirmationModal 
                        isOpen={modals.syncConfirm.isOpen}
                        onClose={modals.syncConfirm.close}
                        onConfirm={handleToggleSync}
                        isSyncEnabled={isSyncEnabled}
                    />

                    <SupportModal 
                        isOpen={modals.support.isOpen}
                        onClose={modals.support.close}
                        onFeedbackClick={modals.feedback.open}
                        onTicketClick={modals.ticketSystem.open}
                    />

                    <TicketSystemModal
                        isOpen={modals.ticketSystem.isOpen}
                        onClose={modals.ticketSystem.close}
                        tickets={tickets}
                        userId={userId}
                        onNewTicket={handleNewTicket}
                        onReply={handleReplyToTicket}
                        getMessages={getMessagesForTicket}
                        onMarkAsRead={handleMarkTicketAsRead}
                        user={user}
                    />

                    <FeedbackModal
                        isOpen={modals.feedback.isOpen}
                        onClose={modals.feedback.close}
                        onSubmit={handleSendFeedback}
                    />

                    <ChangelogModal 
                        isOpen={modals.changelog.isOpen}
                        onClose={modals.changelog.close}
                    />

                    <AboutModal
                        isOpen={modals.about.isOpen}
                        onClose={modals.about.close}
                        userId={userId}
                    />

                     <AdminModal
                        isOpen={modals.admin.isOpen}
                        onClose={modals.admin.close}
                        user={user}
                    />

                    <AnnouncementsModal
                        isOpen={modals.announcements.isOpen}
                        onClose={modals.announcements.close}
                        announcements={announcements}
                        onOpened={handleMarkAnnouncementsAsRead}
                    />

                    <MileageBreakdownModal 
                        isOpen={modals.breakdown.isOpen}
                        onClose={modals.breakdown.close}
                        entry={breakdownEntry}
                    />

                    <OvertimeBreakdownModal
                        isOpen={modals.overtimeBreakdown.isOpen}
                        onClose={modals.overtimeBreakdown.close}
                        entry={overtimeBreakdownEntry}
                    />

                       <InformationModal
                            isOpen={modals.info.isOpen}
                            onClose={modals.info.close}
                        />

                    <ClaimAssistantModal
                        isOpen={modals.claimAssistant.isOpen}
                        onClose={modals.claimAssistant.close}
                        entries={entries}
                    />
                    
                    <Modal isOpen={!!deleteRequest} onClose={() => modals.delete.close()}>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 my-4">Are you sure you want to delete this entry? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button onClick={modals.delete.close} className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                            </div>
                        </div>
                    </Modal>
                </ClientOnly>
            </main>
            <Footer 
                onChangelogClick={modals.changelog.open}
                onAboutClick={modals.about.open}
                onRecoveryClick={modals.recovery.open}
                onInfoClick={modals.info.open}
                handleAdminAction={handleAdminAction}
            />
        </div>
    );
}