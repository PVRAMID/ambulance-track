// src/app/hooks/useAppLogic.js
'use client';
import { useState, useEffect } from 'react';
import { usePersistentState } from './usePersistentState';
import { calculateOvertime, calculateMileage } from '../lib/calculations';
import { sendAnalyticsEvent } from '../lib/analytics';
import { APP_VERSION, ENABLE_UPDATE_NOTIFICATION, ALLOWANCE_CLAIM_TYPES } from '../lib/constants';

export function useAppLogic() {
    // --- STATE MANAGEMENT ---
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
    
    // Notification states
    const [showStorageWarning, setShowStorageWarning] = useState(false);
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);

    // Persistent states
    const [userId] = usePersistentState('actracker_userId', crypto.randomUUID());
    const [lastSeenVersion, setLastSeenVersion] = usePersistentState('actracker_lastSeenVersion', '0.0.0');
    const [entries, setEntries] = usePersistentState('ambulanceLogEntries_v6', {});
    const [settings, setSettings] = usePersistentState('ambulanceLogSettings_v6', {
        grade: '', band: '', step: '', division: '', station: '', userPostcode: ''
    });
    const [theme, setTheme] = usePersistentState('ambulanceLogTheme_v2', 'dark');
    const [sidebarView, setSidebarView] = useState('month');
    const [hasSeenWelcome, setHasSeenWelcome] = usePersistentState('hasSeenWelcome_v2', false);

    // --- EFFECTS ---
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        try {
            const testKey = 'actracker-storage-test';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
        } catch (e) {
            setShowStorageWarning(true);
        }
        if (ENABLE_UPDATE_NOTIFICATION && lastSeenVersion !== APP_VERSION) {
            setShowUpdateNotification(true);
        }
    }, [lastSeenVersion]);

    // --- HANDLERS ---
    const handleCloseUpdateNotification = () => {
        setShowUpdateNotification(false);
        setLastSeenVersion(APP_VERSION);
    };

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
    
    const handleSetEditingEntry = (entry) => {
        setEditingEntry(entry);
    };

    const handleCloseEntryModal = () => {
        setIsEntryModalOpen(false);
        setSelectedDate(null);
        setEditingEntry(null);
    };

    const handleSaveEntry = async (entryData) => {
        if (!selectedDate) return;

        let finalData = { ...entryData };

        if (finalData.claimType === 'Late Finish') {
            const { overtimePay, overtimeDuration, error } = calculateOvertime(settings, finalData.overtimeHours, finalData.overtimeMinutes, finalData.isEnhancedRate);
            if (error) {
                alert(error);
                finalData.overtimePay = 0;
            } else {
                finalData.overtimePay = overtimePay;
                finalData.overtimeDuration = overtimeDuration;
            }
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
        const eventType = editingEntry ? 'Update' : 'Creation';

        setEntries(prevEntries => {
            const newEntries = { ...prevEntries };
            const dayEntries = newEntries[dateString] ? [...newEntries[dateString]] : [];
            const entryIndex = editingEntry ? dayEntries.findIndex(e => e.id === editingEntry.id) : -1;

            if (entryIndex > -1) {
                dayEntries[entryIndex] = { ...finalData, id: editingEntry.id };
            } else {
                dayEntries.push({ id: crypto.randomUUID(), ...finalData });
            }
            newEntries[dateString] = dayEntries;
            return newEntries;
        });

        sendAnalyticsEvent(eventType, finalData, userId);
        handleCloseEntryModal();
    };

    const confirmDelete = () => {
        if (!deleteRequest) return;
        const { entryId, dateString } = deleteRequest;
        const entryToDelete = entries[dateString]?.find(e => e.id === entryId);

        setEntries(prevEntries => {
            const newEntries = { ...prevEntries };
            let dayEntries = newEntries[dateString] || [];
            newEntries[dateString] = dayEntries.filter(e => e.id !== entryId);
            if (newEntries[dateString].length === 0) {
                delete newEntries[dateString];
            }
            return newEntries;
        });

        if (entryToDelete) {
            sendAnalyticsEvent('Deletion', entryToDelete, userId);
        }

        setDeleteRequest(null);
        handleCloseEntryModal();
    };

    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        setIsSettingsModalOpen(false);
    };

    return {
        // State
        currentDate,
        selectedDate,
        editingEntry,
        breakdownEntry,
        deleteRequest,
        entries,
        settings,
        theme,
        sidebarView,
        hasSeenWelcome,
        userId,
        // Modal and Notification visibility
        modals: {
            entry: { isOpen: isEntryModalOpen, open: handleOpenNewEntryModal, close: handleCloseEntryModal, openEdit: handleOpenEditEntryModal },
            settings: { isOpen: isSettingsModalOpen, open: () => setIsSettingsModalOpen(true), close: () => setIsSettingsModalOpen(false) },
            breakdown: { isOpen: !!breakdownEntry, open: setBreakdownEntry, close: () => setBreakdownEntry(null) },
            feedback: { isOpen: isFeedbackModalOpen, open: () => setIsFeedbackModalOpen(true), close: () => setIsFeedbackModalOpen(false) },
            changelog: { isOpen: isChangelogModalOpen, open: () => setIsChangelogModalOpen(true), close: () => setIsChangelogModalOpen(false) },
            about: { isOpen: isAboutModalOpen, open: () => setIsAboutModalOpen(true), close: () => setIsAboutModalOpen(false) },
            delete: { isOpen: !!deleteRequest, open: setDeleteRequest, close: () => setDeleteRequest(null) },
            recovery: { isOpen: isRecoveryModalOpen, open: () => setIsRecoveryModalOpen(true), close: () => setIsRecoveryModalOpen(false) },
        },
        notifications: {
            storage: { isOpen: showStorageWarning, close: () => setShowStorageWarning(false) },
            update: { isOpen: showUpdateNotification, close: handleCloseUpdateNotification, version: APP_VERSION },
        },
        // Handlers
        setCurrentDate,
        setSidebarView,
        setTheme,
        setHasSeenWelcome,
        handleSaveEntry,
        handleSetEditingEntry,
        confirmDelete,
        handleSaveSettings,
    };
}