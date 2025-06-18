// src/app/hooks/useSync.js
'use client';
import { useState, useEffect } from 'react';
import { usePersistentState } from './usePersistentState';
import { devLog } from '../lib/logger';

export function useSync(initialStatus = 'disabled') {
    const [isSyncEnabled, setIsSyncEnabled] = usePersistentState('actracker_isSyncEnabled', true);
    const [syncStatus, setSyncStatus] = useState(initialStatus); // 'disabled', 'synced', 'pending', 'error'

    useEffect(() => {
        const newStatus = isSyncEnabled ? 'synced' : 'disabled';
        setSyncStatus(newStatus);
        devLog(`Sync enabled state changed. New status: ${newStatus}`);
    }, [isSyncEnabled]);

    const updateSyncStatus = (status) => {
        if (isSyncEnabled) {
            devLog(`Sync status updated to: ${status}`);
            setSyncStatus(status);
        }
    };

    return { isSyncEnabled, setIsSyncEnabled, syncStatus, setSyncStatus: updateSyncStatus };
}