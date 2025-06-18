// src/app/hooks/useRecovery.js
'use client';
import { useCallback, useEffect } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { usePersistentState } from './usePersistentState';
import { devLog } from '../lib/logger';

export function useRecovery(recoveryId, isSyncEnabled, setSyncStatus) {
    const [entries, setEntries] = usePersistentState('ambulanceLogEntries_v6', {});
    const [settings, setSettings] = usePersistentState('ambulanceLogSettings_v6', {});

    // This function syncs the user's local data to Firestore.
    const syncData = useCallback(async () => {
        if (!recoveryId || !isSyncEnabled) return;
        
        devLog(`Syncing data for user: ${recoveryId}`);
        setSyncStatus('pending');

        try {
            const userDocRef = doc(db, 'user-data', recoveryId);
            const dataToSync = {
                entries,
                settings,
                lastSynced: new Date().toISOString(),
            };
            await setDoc(userDocRef, dataToSync, { merge: true });
            devLog('Sync successful.');
            setSyncStatus('synced');
        } catch (error) {
            console.error("Error syncing data:", error);
            devLog('Sync failed:', error);
            setSyncStatus('error');
        }
    }, [recoveryId, isSyncEnabled, entries, settings, setSyncStatus]);

    // This effect will automatically sync data whenever it changes.
    useEffect(() => {
        if (!isSyncEnabled) return;

        const handler = setTimeout(() => {
            syncData();
        }, 2000); // Sync 2 seconds after the last change.

        return () => {
            clearTimeout(handler);
        };
    }, [entries, settings, syncData, isSyncEnabled]);

    // This function recovers data from Firestore using a recovery code.
    const recoverData = async (code) => {
        devLog(`Attempting to recover data with code: ${code}`);
        try {
            const userDocRef = doc(db, 'user-data', code);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setEntries(data.entries || {});
                setSettings(data.settings || {});
                devLog('Recovery successful, local state updated.');
                alert('Recovery successful!');
            } else {
                devLog('No data found for that recovery code.');
                alert('No data found for that recovery code.');
            }
        } catch (error) {
            console.error("Error recovering data:", error);
            devLog('Recovery failed:', error);
            alert('An error occurred during recovery.');
        }
    };

    // This function deletes the user's data from the server.
    const deleteServerData = async () => {
        if (!recoveryId) return;
        devLog(`Deleting server data for user: ${recoveryId}`);
        try {
            const userDocRef = doc(db, 'user-data', recoveryId);
            await deleteDoc(userDocRef);
            devLog('Server data deleted successfully.');
            alert('Your server data has been permanently deleted.');
        } catch (error) {
            console.error("Error deleting data:", error);
            devLog('Error deleting server data:', error);
            alert('An error occurred while deleting your data.');
        }
    };

    return { recoverData, deleteServerData };
}