// src/app/components/InformationModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';

const InformationModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">App Information & Guide</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-sm text-gray-600 dark:text-gray-300">
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Welcome to ACTracker! 🚑</h3>
                        <p>Hello, and welcome to the Ambulance Claim Tracker (ACTracker)! This guide is here to walk you through everything you need to know to get started and make the most of the app.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">What is ACTracker?</h3>
                        <p>ACTracker is a simple, no-fuss application designed specifically for ambulance staff to easily track their claims for overtime, mileage, and various work-related allowances. The goal is to provide a straightforward tool to ensure you never miss a claim again.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Core Features ✨</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Easy Claim Entry:</strong> Quickly add entries for Late Finishes, Mileage, and a wide range of official allowances directly onto a calendar.</li>
                            <li><strong>Automatic Pay Estimates:</strong> The app automatically calculates your estimated pay for overtime and mileage claims based on your personal settings.</li>
                            <li><strong>Monthly Earnings Summary:</strong> See a clear breakdown of your estimated earnings for the current month.</li>
                            <li><strong>Cloud Sync & Recovery:</strong> Securely back up your data to the cloud and restore it on any device using a memorable recovery code.</li>
                            <li><strong>Data Export:</strong> Download all your claim data as a CSV file for your personal records.</li>
                            <li><strong>Customisable Settings:</strong> Configure your pay band, grade, and home station for accurate calculations.</li>
                            <li><strong>Light & Dark Mode:</strong> Choose a theme that's easy on your eyes.</li>
                        </ul>
                    </section>

                     <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Getting Started: Your First Entry</h3>
                         <ol className="list-decimal list-inside space-y-2">
                             <li><strong>Go to Settings:</strong> Click the <strong>Settings</strong> icon (⚙️) in the header. Fill in your details like Pay Band, Grade, and Home Station. This is important for accurate pay calculations.</li>
                            <li><strong>Click a Date:</strong> On the main screen, click on any date in the calendar to open the entry modal.</li>
                            <li><strong>Choose Claim Type:</strong> Select the type of claim you want to make from the dropdown menu (e.g., "Late Finish").</li>
                            <li><strong>Fill in the Details:</strong> Complete the required fields, such as your overtime duration or callsign.</li>
                            <li><strong>Save:</strong> Click "Save Entry", and you're done! Your claim is now logged.</li>
                        </ol>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Cloud Sync & Recovery Explained ☁️</h3>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">How Syncing Works</h4>
                        <p className="mb-2">The Cloud Sync feature is <strong>enabled by default</strong>. This means every time you add, edit, or delete a claim, or change your settings, your data is automatically and securely backed up. You can check your sync status at any time using the icon in the header.</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>✅ **Green Check:** Your data is successfully synced and up to date.</li>
                            <li>🔄 **Spinning Yellow Icon:** Data is currently being synced.</li>
                            <li>❌ **Grey 'X':** Syncing is disabled.</li>
                            <li>❗ **Red Alert:** There was an error syncing your data.</li>
                        </ul>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-1">How to Recover Your Data</h4>
                        <p>If you get a new device, your data is not lost! Simply use the Recovery feature:</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                             <li><strong>Find Your Recovery Code:</strong> Click the <strong>Recovery</strong> button in the footer or the <strong>SOS icon</strong> (🆘) in the header. Your unique recovery code (e.g., `Apple-Banana-1234`) is at the top. **Keep this code somewhere safe!**</li>
                             <li><strong>Restore on a New Device:</strong> Open the Recovery Modal on the new device and enter your recovery code.</li>
                             <li><strong>Click Restore:</strong> The app will fetch your data from the server and restore it to your device.</li>
                        </ol>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Data Security & Privacy</h3>
                        <ul className="list-disc list-inside space-y-2">
                             <li><strong>Local-First:</strong> All your data is stored primarily on your device's local browser storage.</li>
                             <li><strong>Anonymous Backup:</strong> When Cloud Sync is enabled, your data is backed up to a secure Firebase server, tied only to your anonymous, randomly-generated recovery code.</li>
                             <li><strong>Your Control:</strong> You are in full control of your data. You can disable cloud syncing or permanently delete your server backup at any time via the Recovery Modal.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Feedback & Support</h3>
                        <p>Have an idea for a new feature, or found a bug? Any questions or concerns can be submitted via the **Feedback speech bubble** (💬) in the header or by emailing <a href="mailto:joshua.flanagan@emas.nhs.uk" className="text-blue-600 dark:text-blue-400 hover:underline">joshua.flanagan@emas.nhs.uk</a>.</p>
                    </section>
                </div>

                <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default InformationModal;