// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/components/WelcomeModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { Download } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to the Ambulance Claim Tracker!</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Here&apos;s a quick guide to get you started:</p>
                </div>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm mt-6">
                    <ul className="space-y-3">
                        <li className="flex items-start"><b className="w-24 shrink-0">Calendar:</b><span>Click on any date to add a new claim for a late finish, disturbed meal, or mileage.</span></li>
                        <li className="flex items-start"><b className="w-24 shrink-0">Entries:</b><span>View, edit, or filter your claims in the sidebar.</span></li>
                        <li className="flex items-start"><b className="w-24 shrink-0">Earnings:</b><span>Get an estimated breakdown of your monthly earnings below the calendar.</span></li>
                        <li className="flex items-start"><b className="w-24 shrink-0">Settings:</b><span>Configure your pay grade and home station for accurate calculations.</span></li>
                    </ul>

                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 text-yellow-800 dark:text-yellow-200">
                        <h4 className="font-bold mb-1">Important: Local Storage & Data Loss</h4>
                        <p>All data you enter is stored <strong>only on this device&apos;s browser</strong>. It is not saved to any server.</p>
                        <p className="mt-2">To prevent data loss, please use the <strong>Download button (<Download className="w-4 h-4 inline-block -mt-1"/>) regularly</strong> to back up your records. Do not clear your browser&apos;s cache or site data for this app unless you have a backup.</p>
                        <p className="mt-2 font-semibold">PVRAMID Solutions is not responsible for any data loss.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Future Development</h4>
                        <p>This application is actively under development. In the future, it may transition to a subscription model (approx. <strong>£0.99/month</strong>) to support ongoing development.</p>
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <button onClick={onClose} className="w-full px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
                </div>
            </div>
        </Modal>
    );
};
export default WelcomeModal;