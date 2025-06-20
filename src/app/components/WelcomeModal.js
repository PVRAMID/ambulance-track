// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/components/WelcomeModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { Download, AlertTriangle, Database, Trash2 } from 'lucide-react';

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
                        <h4 className="font-bold mb-2 flex items-center"><Database className="w-4 h-4 mr-2" /> Data Storage & Security</h4>
                        <p>By default, your data is securely backed up to a Google Firebase database. This allows you to recover your data on a new device using your unique recovery code.</p>
                        <p className="mt-2">You can disable cloud syncing at any time in the header if you prefer to store data only on this device.</p>
                        <p className="mt-2">
                            <strong className="flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Data Loss Warning:</strong> 
                            Clearing your browser&apos;s history, cache, or cookies can result in data loss, even with cloud sync. Always keep a safe record of your recovery code.
                        </p>
                         <p className="mt-2 flex items-center"><Trash2 className="w-4 h-4 mr-2" /> You are in full control and can delete all of your server data at any time from the &apos;Recovery&apos; section.</p>
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