'use client';
import React from 'react';
import Modal from './Modal';
import { ICONS, Icon } from '../lib/constants';

const WelcomeModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome to the Ambulance Claim Tracker!</h2>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                    <p>Here’s a quick guide to get you started:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><b>Calendar:</b> Click on any date to add a new claim for a late finish, disturbed meal, or mileage.</li>
                        <li><b>Entries Sidebar:</b> View, edit, or filter your claims on the right.</li>
                        <li><b>Earnings:</b> Get an estimated breakdown of your monthly earnings below the calendar.</li>
                        <li><b>Settings (<Icon path={ICONS.Settings} className="w-4 h-4 inline-block -mt-1"/>):</b> Configure your pay grade and band for accurate overtime calculations.</li>
                        <li><b>Dark Mode (<Icon path={ICONS.Moon} className="w-4 h-4 inline-block -mt-1"/>/<Icon path={ICONS.Sun} className="w-4 h-4 inline-block -mt-1"/>):</b> Toggle between light and dark themes using the icon in the header.</li>
                    </ul>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/30 rounded-lg text-yellow-800 dark:text-yellow-200">
                        <h4 className="font-bold mb-1">Important: Local Storage & Data Loss</h4>
                        <p>All data you enter is stored <strong>only on this device's browser</strong>. It is not saved to the cloud.</p>
                        <p className="mt-2">To prevent data loss, please use the <strong>Download button (<Icon path={ICONS.Download} className="w-4 h-4 inline-block -mt-1"/>) regularly</strong> to back up your records. Do not clear your browser's cache or site data for this app unless you have a backup.</p>
                        <p className="mt-2 font-semibold">PVRAMID Solutions is not responsible for any data loss.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Future Development</h4>
                        <p>This application is actively under development, with new features and improvements being added regularly.</p>
                         <p className="mt-2">It is currently free to use. In the future, it will transition to a subscription model priced at approximately <strong>£0.99 per month</strong> to support ongoing development.</p>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">This welcome message will only appear once.</p>
                </div>

                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
                </div>
            </div>
        </Modal>
    );
};
export default WelcomeModal;
