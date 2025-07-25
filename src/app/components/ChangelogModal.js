// src/app/components/ChangelogModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';

const changelogData = [
    {
        version: "v0.9.4-beta",
        date: "2025-07-25",
        changes: [
            { type: "feat", text: "Added Claim Assistant - A modal that appears with copy/mark submitted buttons allowing for easier tracking on what should be submitted for this current month." },
        ]
    },
    {
        version: "v0.9.3-beta",
        date: "2025-07-01",
        changes: [
            { type: "feat", text: "Added Sickness to Shift Types." },
        ]
    },
    {
        version: "v0.9.2-beta",
        date: "2025-06-25",
        changes: [
            { type: "feat", text: "Added ability for sysops to merge user records." },
            { type: "fix", text: "Adjusted recovery function, recovering a profile will now force the device to adopt that profiles user ID, preventing duplicate users in the database." },
            { type: "feat", text: "Added Payback Shifts to shift types (Suggstion from Thomas H)" },
            { type: "fix", text: "Application now checks user settings against codebase to check for new shift types (bug found during above feature implementation)" },
        ]
    },
    {
        version: "v0.9.1-beta",
        date: "2025-06-23",
        changes: [
            { type: "feat", text: "Integrated two-way ticket system. Allowing users to create private support/feedback tickets. These tickets come with intergrated status management and live chat! Work in progress, but hey, it works!" },
        ]
    },
    {
        version: "v0.9.0-beta",
        date: "2025-06-22",
        changes: [
            { type: "feat", text: "Full overtime shift added to entries. (Suggestion by: Mercedes B)" },
            { type: "feat", text: "Essential Education/Education days added to entries. (Suggestion by: Mercedes B)" },
            { type: "feat", text: "TOIL/Annual Leave added to entries (Suggestion by: Mercedes B)" },
            { type: "feat", text: "Added ability for users to change abbreviations and set colours in settings for personal preference." },
            { type: "ui", text: "Changed estimated calculations section to split EOS Overtime and Planned Overtime." },
            { type: "fix", text: "Added Missing Station: Raynesway, Derbyshire" },
            { type: "known_issue", text: "There has been no current issues found with this update, please use the feedback form to report any problems." },
        ]
    },
    {
        version: "v0.8.3-beta",
        date: "2025-06-19",
        changes: [
            { type: "feat", text: "Built admin panel to add remote support possibilities." },
        ]
    },
    {
        version: "v0.8.2-beta",
        date: "2025-06-19",
        changes: [
            { type: "feat", text: "SUGGESTION IMPLEMENTED: When submitting a late finish, you can now designate the time you finished, allowing you to submit a timesheet OT entry without opening the tracker entry. (Suggestion from Mercedes B!)" },
            { type: "ui", text: "Edited the welcome screen for new users to correctly explain data storage, privacy and data control." },
        ]
    },
    {
        version: "v0.8.1-beta",
        date: "2025-06-19",
        changes: [
            { type: "fix", text: "Feedback form has been fixed, included section for reporting missing stations." },
            { type: "fix", text: "Added Eckington, Alfreton Ambulance Stations." },
            { type: "ui", text: "Added a Favicon replacement for the Vercel Icon. Created with love by Adam Norris." },
        ]
    },
    {
        version: "v0.8.0-beta",
        date: "2025-06-18",
        changes: [
            { type: "feat", text: "Announcements section has now been created to be able to provide live app updates to users." },
            { type: "fix", text: "Added Student Technician to Payscales (75% of Band 4, £12.24/hour)" },
            { type: "fix", text: "Added Market Rasen to Lincs Stations List" },
            { type: "fix", text: "Added Holbeach to Lincs Stations List" },
            { type: "fix", text: "Added ASC to Grades List" },
            
        ]
    },
     {
        version: "v0.7.0-beta",
        date: "2025-06-18",
        changes: [
            { type: "feat", text: "RECOVERY: A user can now keep a note of their user ID, this can be found in the 'About' section at the bottom of the page. In the event where a new device needs to be used, or in the event a loss of data occurs, the user can recover data if they have syncing enabled on the application." },
            { type: "feat", text: "SYNCING: A user can now enable syncing, data submitted into the app, along with all settings are stored in a firebase database, this can be enabled/disabled if a user wishes to keep their data on their device. The user is able to delete their own data from the server by entering 'Recovery' and selecting 'Detete my Data'."},
            { type: "feat", text: "A user can now force sync to the database using the arrows next to the sync status button." },
            { type: "feat", text: "A user can disable syncing by clicking on the sync button and confirming disable sync in the dialogue box." },
            { type: "backend", text: "Implemented Firebase integration for data storing/management." },
            { type: "ui", text: "Feedback button is now an icon instead of a text based button." },
            { type: "ui", text: "Syncing progress is now an icon in the header." },
            
        ]
    },
     {
        version: "v0.6.2-beta",
        date: "2025-06-17",
        changes: [
            { type: "fix", text: "All allowances available on ePay have now been transferred over, including accurate descriptions, values and epay prompts." },
            { type: "fix", text: "A problem where the user wouldn't be able to view the mileage calculation breakdown has been fixed!." },
        ]
    },
    {
        version: "v0.6.1-beta",
        date: "2025-06-17",
        changes: [
            { type: "fix", text: "Pushed a potential fix for being unable to delete entries." },
            { type: "feat", text: "Added the ability to see entries by day when the user clicks on a specific day in calendar view." },
            { type: "backend", text: "Removed some sensitive information from the codebase and created environment variables to prevent backdoor attacks." },
            { type: "known_issue", text: "Light/Dark mode is not functioning as expected, there is a potential fix pending." },
            { type: "known_issue", text: "Claim types need to be adjusted, such as regular LMB, LMB+AnnexN etc." }
        ]
    },
    {
        version: "v0.6.0-beta",
        date: "2025-06-16",
        changes: [
            { type: "backend", text: "Refactored the main page logic into smaller, reusable components for better code organization and maintainability." },
            { type: "backend", text: "Extracted calculation logic into a dedicated utility file." },
            { type: "ui", text: "Added new tag types ('Backend', 'Server', 'Suggested Feature') to the changelog for better categorization." }
        ]
    },
    {
        version: "v0.5.0-beta",
        date: "2025-06-16",
        changes: [
            { type: "feat", text: "Added a unique user ID to improve analytics and support. The ID is now visible in the 'About' modal." },
            { type: "feat", text: "Implemented a notification system to alert users when a new version of the application is available." },
            { type: "backend", text: "The update notification can now be toggled on or off via a configuration setting in the code." },
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
        backend: "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300",
        server: "bg-gray-200 dark:bg-gray-700/60 text-gray-800 dark:text-gray-300",
        suggested: "bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300",
        known_issue: "bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300",
    };
    const text = {
        feat: "Feature",
        ui: "UI",
        fix: "Fix",
        backend: "Backend",
        server: "Server",
        suggested: "Suggested Feature",
        known_issue: "Known Issue",
    }
    return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${styles[type] || styles.fix}`}>{text[type] || "Update"}</span>
}

const ChangelogModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Changelog</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
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