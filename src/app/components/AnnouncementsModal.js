'use client';
import React from 'react';
import Modal from './Modal';
import { X, Megaphone } from 'lucide-react';
import Image from 'next/image';

const AnnouncementsModal = ({ isOpen, onClose, announcements, onOpened }) => {

    React.useEffect(() => {
        if (isOpen) {
            onOpened();
        }
    }, [isOpen, onOpened]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {announcements && announcements.length > 0 ? (
                        announcements.map((announcement, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-700/60">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{announcement.author}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(announcement.timestamp)}</p>
                                </div>
                                {announcement.imageUrl && (
                                    <div className="my-3 rounded-lg overflow-hidden">
                                        <Image
                                            src={announcement.imageUrl}
                                            alt="Announcement Image"
                                            width={400}
                                            height={200}
                                            className="w-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{announcement.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No announcements right now.</p>
                    )}
                </div>

                <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default AnnouncementsModal;