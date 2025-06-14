// src/app/components/AboutModal.js
'use client';
import React from 'react';
import Modal from './Modal';
import { X, Coffee } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">About</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="text-center">
                    <img 
                        src="https://storage.ko-fi.com/cdn/useruploads/e66b78e5-53e5-4960-a8c0-9e2cae593677_eea130-f380-44b9-a4f3-4f9a0ab42dd1.png" 
                        alt="Josh Lewis" 
                        className="w-24 h-24 rounded-full mx-auto shadow-md"
                    />
                </div>

                <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300 mt-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">About Me</h3>
                        <p>Josh Lewis, Technician based in Leicestershire Division. Constantly forgetting when I've had late meal breaks and forgetting to submit mileage claims, came up with a solution, something easy and non-complex without having to repurpose a random shift planner app on the app store. Decided to make something new.</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">About This Product</h3>
                        <p>ACTracker is a simple, no-fuss application designed specifically for ambulance staff to easily track their claims for overtime, mileage, and meal allowances. The goal is to provide a straightforward tool to ensure you never miss a claim, without the complexity of generic shift planners.</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Pricing</h3>
                        <p>This application is currently free to use during its beta phase. In the future, it may move to a small subscription model to support continued development and server costs. Your feedback on what you'd be willing to pay would be greatly appreciated!</p>
                    </div>
                </div>

                 <div className="mt-6 text-center">
                    <a 
                        href="https://ko-fi.com/pvramid" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        <Coffee className="w-5 h-5 text-red-500" />
                        <span>Support the Developer on Ko-fi</span>
                    </a>
                </div>
            </div>
        </Modal>
    );
};

export default AboutModal;