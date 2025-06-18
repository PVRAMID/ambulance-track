// src/app/hooks/useAppLogic.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import { useSync } from './useSync';
import { syncData, recoverData, deleteServerData } from './useFirebase';
import { calculateOvertime, calculateMileage } from '../lib/calculations';
import { sendAnalyticsEvent } from '../lib/analytics';
import { APP_VERSION, ENABLE_UPDATE_NOTIFICATION, ALLOWANCE_CLAIM_TYPES } from '../lib/constants';
import { WORD_LIST } from '../lib/words';

function generateWordId() {
    const sequence = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
        sequence.push(WORD_LIST[randomIndex]);
    }
    const words = sequence.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${words}-${randomNumber}`;
}

export function useAppLogic() {
    // --- STATE MANAGEMENT ---
    const [userId] = usePersistentState('actracker_userId', generateWordId());
    const [entries, setEntries] = usePersistentState('ambulanceLogEntries_v6', {});
    const [settings, setSettings] = usePersistentState('ambulanceLogSettings_v6', {
        grade: '', band: '', step: '', division: '', station: '', userPostcode: ''
    });
    const { isSyncEnabled, setIsSyncEnabled, syncStatus, setSyncStatus } = useSync();
    
    // --- Other states
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);
    const [breakdownEntry, setBreakdownEntry] = useState(null);
    const [deleteRequest, setDeleteRequest] = useState(null);

    // Modal states
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
    const [isSyncConfirmModalOpen, setIsSyncConfirmModalOpen] = useState(false);
    
    // Notification states
    const [showStorageWarning, setShowStorageWarning] = useState(false);
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);

    // Persistent states
    const [lastSeenVersion, setLastSeenVersion] = usePersistentState('actracker_lastSeenVersion', '0.0.0');
    const [theme, setTheme] = usePersistentState('ambulanceLogTheme_v2', 'dark');
    const [sidebarView, setSidebarView] = useState('month');
    const [hasSeenWelcome, setHasSeenWelcome] = usePersistentState('hasSeenWelcome_v2', false);

    // --- DATA SYNCING ---
    const triggerSync = useCallback(async (currentEntries, currentSettings) => {
        if (!isSyncEnabled) return;
        setSyncStatus('pending');
        const dataToSync = { entries: currentEntries, settings: currentSettings, lastSynced: new Date().toISOString() };
        const result = await syncData(userId, dataToSync);
        if (result.success) {
            setSyncStatus('synced');
        } else {
            setSyncStatus('error');
        }
    }, [isSyncEnabled, userId, setSyncStatus]);

    // --- HANDLERS ---
    const handleToggleSync = () => {
        const newSyncState = !isSyncEnabled;
        setIsSyncEnabled(newSyncState);
        if (newSyncState) {
            triggerSync(entries, settings);
        }
        setIsSyncConfirmModalOpen(false);
    };

    const handleForceSync = () => {
        triggerSync(entries, settings);
    };

    const handleSaveEntry = async (entryData) => {
        if (!selectedDate) return;
        let finalData = { ...entryData };

        if (finalData.claimType === 'Late Finish') {
            const { overtimePay, overtimeDuration } = calculateOvertime(settings, finalData.overtimeHours, finalData.overtimeMinutes, finalData.isEnhancedRate);
            finalData.overtimePay = overtimePay;
            finalData.overtimeDuration = overtimeDuration;
        } else if (finalData.claimType === 'Mileage') {
            const { mileage, mileagePay, calculationBreakdown } = await calculateMileage(settings, finalData.workingDivision, finalData.workingStation);
            finalData.mileage = mileage;
            finalData.mileagePay = mileagePay;
            finalData.calculationBreakdown = calculationBreakdown;
        } else if (finalData.claimType in ALLOWANCE_CLAIM_TYPES) {
            finalData.pay = ALLOWANCE_CLAIM_TYPES[finalData.claimType].value;
        }

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        const newEntries = { ...entries };
        const dayEntries = newEntries[dateString] ? [...newEntries[dateString]] : [];
        const entryIndex = editingEntry ? dayEntries.findIndex(e => e.id === editingEntry.id) : -1;
        if (entryIndex > -1) {
            dayEntries[entryIndex] = { ...finalData, id: editingEntry.id };
        } else {
            dayEntries.push({ id: crypto.randomUUID(), ...finalData });
        }
        newEntries[dateString] = dayEntries;

        setEntries(newEntries);
        triggerSync(newEntries, settings);
        
        sendAnalyticsEvent(editingEntry ? 'Update' : 'Creation', finalData, userId);
        handleCloseEntryModal();
    };

    const confirmDelete = () => {
        if (!deleteRequest) return;
        const { entryId, dateString } = deleteRequest;
        
        const newEntries = { ...entries };
        let dayEntries = newEntries[dateString] || [];
        const entryToDelete = dayEntries.find(e => e.id === entryId);
        if (entryToDelete) sendAnalyticsEvent('Deletion', entryToDelete, userId);
        newEntries[dateString] = dayEntries.filter(e => e.id !== entryId);
        if (newEntries[dateString].length === 0) delete newEntries[dateString];

        setEntries(newEntries);
        triggerSync(newEntries, settings);

        setDeleteRequest(null);
        handleCloseEntryModal();
    };

    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        triggerSync(entries, newSettings);
        setIsSettingsModalOpen(false);
    };

    const handleRecoverData = async (code) => {
        const result = await recoverData(code);
        if (result.success) {
            setEntries(result.data.entries || {});
            setSettings(result.data.settings || {});
            alert('Recovery successful!');
            setIsRecoveryModalOpen(false);
        } else {
            alert(result.error);
        }
    };
    
    const handleDeleteServerData = async () => {
        const result = await deleteServerData(userId);
        if (result.success) {
            alert('Your server data has been permanently deleted.');
        } else {
            alert(result.error);
        }
    };
    
    const handleCloseUpdateNotification = () => setShowUpdateNotification(false);
    const handleOpenNewEntryModal = (day) => { setSelectedDate(day); setEditingEntry(null); setIsEntryModalOpen(true); };
    const handleOpenEditEntryModal = (entry, dateString) => { setSelectedDate(new Date(dateString + 'T12:00:00')); setEditingEntry(entry); setIsEntryModalOpen(true); };
    const handleSetEditingEntry = (entry) => setEditingEntry(entry);
    const handleCloseEntryModal = () => { setIsEntryModalOpen(false); setSelectedDate(null); setEditingEntry(null); };


    return {
        currentDate, selectedDate, editingEntry, breakdownEntry, deleteRequest, entries, settings, theme, sidebarView, hasSeenWelcome, userId, isSyncEnabled, syncStatus,
        modals: {
            entry: { isOpen: isEntryModalOpen, open: handleOpenNewEntryModal, close: handleCloseEntryModal, openEdit: handleOpenEditEntryModal },
            settings: { isOpen: isSettingsModalOpen, open: () => setIsSettingsModalOpen(true), close: () => setIsSettingsModalOpen(false) },
            breakdown: { isOpen: !!breakdownEntry, open: setBreakdownEntry, close: () => setBreakdownEntry(null) },
            feedback: { isOpen: isFeedbackModalOpen, open: () => setIsFeedbackModalOpen(true), close: () => setIsFeedbackModalOpen(false) },
            changelog: { isOpen: isChangelogModalOpen, open: () => setIsChangelogModalOpen(true), close: () => setIsChangelogModalOpen(false) },
            about: { isOpen: isAboutModalOpen, open: () => setIsAboutModalOpen(true), close: () => setIsAboutModalOpen(false) },
            delete: { isOpen: !!deleteRequest, open: setDeleteRequest, close: () => setDeleteRequest(null) },
            recovery: { isOpen: isRecoveryModalOpen, open: () => setIsRecoveryModalOpen(true), close: () => setIsRecoveryModalOpen(false) },
            syncConfirm: { isOpen: isSyncConfirmModalOpen, open: () => setIsSyncConfirmModalOpen(true), close: () => setIsSyncConfirmModalOpen(false) },
        },
        notifications: { storage: { isOpen: showStorageWarning, close: () => setShowStorageWarning(false) }, update: { isOpen: showUpdateNotification, close: handleCloseUpdateNotification, version: APP_VERSION },},
        setCurrentDate, setSidebarView, setTheme, setHasSeenWelcome, handleSaveEntry, handleSetEditingEntry, confirmDelete, handleSaveSettings, handleToggleSync, handleRecoverData, handleDeleteServerData, handleForceSync
    };
}