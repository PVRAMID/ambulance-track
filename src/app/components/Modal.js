'use client';
import React from 'react';

const Modal = ({ children, isOpen, onClose, sizeClass }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
            onClick={onClose}
        >
            <div 
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${sizeClass || 'max-w-md'}`} 
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
