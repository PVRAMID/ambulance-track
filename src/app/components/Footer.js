// src/app/components/Footer.js
'use client';
import React from 'react';

const Footer = ({ onChangelogClick }) => {
    const version = "v0.1.0-beta";

    return (
        <footer className="w-full mt-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-700/60 pt-4">
                <p>ACTracker (Ambulance Claim Tracker) - {version}</p>
                <p className="mt-1">
                    <button onClick={onChangelogClick} className="hover:underline text-blue-600 dark:text-blue-400">
                        Changelog
                    </button>
                </p>
            </div>
        </footer>
    );
};

export default Footer;