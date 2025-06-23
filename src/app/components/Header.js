// src/app/components/Header.js
'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, Download, Settings, Sun, Moon, MessageSquare, LifeBuoy, RefreshCw, AlertCircle, CheckCircle, XCircle, Megaphone, Bell } from 'lucide-react';

const SyncIcon = ({ status }) => {
    switch (status) {
        case 'synced':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'pending':
            return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
        case 'error':
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
            return <XCircle className="w-5 h-5 text-gray-500" />;
    }
};

const Header = ({ currentDate, setCurrentDate, onExport, onSettingsClick, onSupportClick, onRecoveryClick, onSyncToggleClick, onForceSyncClick, isSyncEnabled, syncStatus, theme, setTheme, onAnnouncementsClick, hasUnread, unreadTicketCount, onTicketSystemClick }) => {
    const changeMonth = (offset) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const syncTooltip = {
        synced: "Data is synced with the cloud",
        pending: "Syncing data...",
        error: "Sync failed",
        disabled: "Sync is disabled"
    }

    return (
        <header className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h1>
            <div className="flex items-center space-x-2">
                 <button 
                    onClick={onAnnouncementsClick} 
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors relative"
                    title="Announcements"
                >
                    <Megaphone className="w-5 h-5" />
                    {hasUnread && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                    )}
                </button>
                <button 
                    onClick={onTicketSystemClick} 
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors relative"
                    title="Support Tickets"
                >
                    <Bell className="w-5 h-5" />
                    {unreadTicketCount > 0 && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                    )}
                </button>
                <button 
                    onClick={onSupportClick} 
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                    title="Support & Feedback"
                >
                    <MessageSquare className="w-5 h-5" />
                </button>
                
                <button onClick={onSyncToggleClick} title={syncTooltip[syncStatus]} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                    <SyncIcon status={syncStatus} />
                </button>

                {isSyncEnabled && (
                    <button onClick={onForceSyncClick} title="Force Sync" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                         <RefreshCw className={`w-5 h-5 ${syncStatus === 'pending' ? 'animate-spin' : ''}`} />
                    </button>
                )}

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><ChevronRight className="w-6 h-6" /></button>
                <button onClick={onExport} title="Export Data" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Download className="w-5 h-5" /></button>
                <button onClick={onSettingsClick} title="Settings" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Settings className="w-5 h-5" /></button>
                <button onClick={onRecoveryClick} title="Recovery" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><LifeBuoy className="w-5 h-5" /></button>
                <button onClick={toggleTheme} title="Toggle Theme" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

export default Header;