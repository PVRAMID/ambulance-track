// src/app/components/Footer.js
'use client';
import React from 'react';

const Footer = ({ onChangelogClick, onAboutClick, onRecoveryClick, onInfoClick, handleAdminAction }) => {
    const version = "v0.8.3-beta";

    return (
        <footer className="w-full mt-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-700/60 pt-4">
                <p>ACTracker (Ambulance Claim Tracker) - {version}</p>
                <div className="mt-1 space-x-4">
                    <button onClick={onAboutClick} className="hover:underline text-blue-600 dark:text-blue-400">
                        About
                    </button>
                    <button onClick={onChangelogClick} className="hover:underline text-blue-600 dark:text-blue-400">
                        Changelog
                    </button>
                    <button onClick={onInfoClick} className="hover:underline text-blue-600 dark:text-blue-400">
                        Information
                    </button>
                    <button onClick={onRecoveryClick} className="hover:underline text-blue-600 dark:text-blue-400">
                        Recovery
                    </button>
                    <button onClick={handleAdminAction} className="hover:underline text-red-600 dark:text-red-400">
                        Admin
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
