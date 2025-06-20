// src/app/hooks/useAppLogic.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import { useSync } from './useSync';
import { 
    syncData, 
    recoverData, 
    deleteServerData, 
    getAnnouncements,
    checkIfAdmin,
    // Admin functions are called directly from the modal now
} from './useFirebase';
import { auth, onAuthStateChanged, googleProvider, signInWithPopup } from '../lib/firebase';
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
    const [userId] = usePersistentState('actracker_userId', generateWordId());
    const [entries, setEntries] = usePersistentState('ambulanceLogEntries_v6', {});
    const [settings, setSettings] = usePersistentState('ambulanceLogSettings_v6', {
        grade: '', band: '', step: '', division: '', station: '', userPostcode: ''
    });
    const { isSyncEnabled, setIsSyncEnabled, syncStatus, setSyncStatus } = useSync();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);
    const [breakdownEntry, setBreakdownEntry] = useState(null);
    const [deleteRequest, setDeleteRequest] = useState(null);

    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
    const [isSyncConfirmModalOpen, setIsSyncConfirmModalOpen] = useState(false);
    const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    
    const [showStorageWarning, setShowStorageWarning] = useState(false);
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);

    const [announcements, setAnnouncements] = useState([]);
    const [lastReadAnnouncement, setLastReadAnnouncement] = usePersistentState('actracker_lastReadAnnouncement', null);
    const [hasUnread, setHasUnread] = useState(false);

    const [lastSeenVersion, setLastSeenVersion] = usePersistentState('actracker_lastSeenVersion', '0.0.0');
    const [theme, setTheme] = usePersistentState('ambulanceLogTheme_v2', 'dark');
    const [sidebarView, setSidebarView] = useState('month');
    const [hasSeenWelcome, setHasSeenWelcome] = usePersistentState('hasSeenWelcome_v2', false);

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const adminStatus = await checkIfAdmin(currentUser.uid);
                setIsAdmin(adminStatus);
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAdminAction = async () => {
        if (user && isAdmin) {
            setIsAdminModalOpen(true);
        } else {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const loggedInUser = result.user;
                const adminStatus = await checkIfAdmin(loggedInUser.uid);
                setIsAdmin(adminStatus);
                if (adminStatus) {
                    setIsAdminModalOpen(true);
                } else {
                    alert('You are not authorized to access the admin panel.');
                }
            } catch (error) {
                console.error("Admin login failed:", error);
                alert("Admin login failed. Please try again.");
            }
        }
    };

    useEffect(() => {
        const fetchAnnouncementsData = async () => {
            const result = await getAnnouncements();
            if (result.success) {
                setAnnouncements(result.data);
                if (result.data.length > 0 && result.data[0].id !== lastReadAnnouncement) {
                    setHasUnread(true);
                }
            }
        };
        fetchAnnouncementsData();
    }, [lastReadAnnouncement]);

    const handleMarkAnnouncementsAsRead = () => {
        if (announcements.length > 0) {
            setLastReadAnnouncement(announcements[0].id);
            setHasUnread(false);
        }
    };

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
        currentDate, selectedDate, editingEntry, breakdownEntry, deleteRequest, entries, settings, theme, sidebarView, hasSeenWelcome, userId, isSyncEnabled, syncStatus, user,
        isAdmin,
        handleAdminAction,
        hasUnread,
        announcements,
        handleMarkAnnouncementsAsRead,
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
            announcements: { isOpen: isAnnouncementsModalOpen, open: () => setIsAnnouncementsModalOpen(true), close: () => setIsAnnouncementsModalOpen(false) },
            info: { isOpen: isInfoModalOpen, open: () => setIsInfoModalOpen(true), close: () => setIsInfoModalOpen(false) },
            admin: { isOpen: isAdminModalOpen, open: () => setIsAdminModalOpen(true), close: () => setIsAdminModalOpen(false)},
        },
        notifications: { storage: { isOpen: showStorageWarning, close: () => setShowStorageWarning(false) }, update: { isOpen: showUpdateNotification, close: handleCloseUpdateNotification, version: APP_VERSION },},
        setCurrentDate, setSidebarView, setTheme, setHasSeenWelcome, handleSaveEntry, handleSetEditingEntry, confirmDelete, handleSaveSettings, handleToggleSync, handleRecoverData, handleDeleteServerData, handleForceSync
    };
}
