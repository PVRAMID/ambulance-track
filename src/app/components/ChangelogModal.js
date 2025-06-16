// src/app/components/ChangelogModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';

const changelogData = [
    {
        version: "v0.5.0-beta",
        date: "2025-06-16",
        changes: [
            { type: "feat", text: "Added a unique user ID to improve analytics and support. The ID is now visible in the 'About' modal." },
            { type: "feat", text: "Implemented a notification system to alert users when a new version of the application is available." },
            { type: "feat", text: "The update notification can now be toggled on or off via a configuration setting in the code." },
        ]
    },
    {
        version: "v0.4.1-beta",
        date: "2025-06-16",
        changes: [
            { type: "fix", text: "Corrected a timezone-related bug where the calendar would highlight the wrong day and save entries to an incorrect date." },
        ]
    },
    {
        version: "v0.4.0-beta",
        date: "2025-06-14",
        changes: [
            { type: "feat", text: "Added anonymous analytics tracking for submission and deletion events to help improve the application." },
        ]
    },
    {
        version: "v0.3.1-beta",
        date: "2025-06-14",
        changes: [
            { type: "fix", text: "Fixed an issue where the local storage warning would not appear correctly in private Browse windows." },
        ]
    },
    {
        version: "v0.3.0-beta",
        date: "2025-06-14",
        changes: [
            { type: "feat", text: "Added a check to detect if local storage is inaccessible (e.g., in private Browse mode)." },
            { type: "ui", text: "A persistent warning banner now appears if storage cannot be accessed, advising users that data will not be saved." }
        ]
    },
    {
        version: "v0.2.1-beta",
        date: "2025-06-14",
        changes: [
            { type: "fix", text: "Resolved linting errors in the 'About' modal, replacing the standard `<img>` tag with `next/image` for better performance and fixing unescaped characters." },
        ]
    },
    {
        version: "v0.2.0-beta",
        date: "2025-06-14",
        changes: [
            { type: "feat", text: "Overhauled station selection to support multiple divisions (Nottinghamshire, Derbyshire, Leicestershire, Northamptonshire, Lincolnshire)." },
            { type: "ui", text: "Station selection is now a two-step process using cascading dropdowns for Division and Station in both Settings and Mileage Claims." },
        ]
    },
    {
        version: "v0.1.1-beta",
        date: "2025-06-14",
        changes: [
            { type: "feat", text: "Added a new 'About' section accessible from the footer with information about the developer and the project." },
        ]
    },
    {
        version: "v0.1.0-beta",
        date: "2025-06-14",
        changes: [
            { type: "feat", text: "Added a user feedback system to submit suggestions, bugs, or general comments directly within the app." },
            { type: "feat", text: "Integrated a Ko-fi link to allow users to support the application's development." },
            { type: "feat", text: "Introduced this changelog to keep users informed of new updates." },
            { type: "ui", text: "Added a new application footer." },
            { type: "ui", text: "Redesigned the feedback button in the header for better visibility." }
        ]
    },
    {
        version: "v0.0.1-beta",
        date: "2025-06-01",
        changes: [
            { type: "feat", text: "Initial beta release of ACTracker." },
            { type: "feat", text: "Core claim entry for Late Finishes, Mileage, and various allowances." },
            { type: "feat", text: "Automatic calculation for estimated overtime and mileage pay." },
            { type: "feat", text: "Settings panel for configuring pay band, grade, and station details." },
            { type: "feat", text: "Entries sidebar to view all historical claims." },
            { type: "ui", text: "Implemented Dark and Light theme modes." },
        ]
    }
];

const Tag = ({ type }) => {
    const styles = {
        feat: "bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300",
        ui: "bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300",
        fix: "bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300",
    };
    const text = {
        feat: "Feature",
        ui: "UI",
        fix: "Fix"
    }
    return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${styles[type]}`}>{text[type]}</span>
}

const ChangelogModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Changelog</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-8">
                    {changelogData.map(log => (
                        <div key={log.version}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{log.version}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{new Date(log.date + 'T12:00:00').toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <ul className="space-y-2">
                                {log.changes.map((change, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <Tag type={change.type} />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{change.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                 <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangelogModal;