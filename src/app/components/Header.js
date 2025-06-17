// src/app/components/Header.js
'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, Download, Settings, Sun, Moon, MessageSquare, LifeBuoy } from 'lucide-react';

const Header = ({ currentDate, setCurrentDate, onExport, onSettingsClick, onFeedbackClick, onRecoveryClick, theme, setTheme }) => {
    const changeMonth = (offset) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h1>
            <div className="flex items-center space-x-3">
                <button 
                    onClick={onFeedbackClick} 
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>Feedback</span>
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><ChevronRight className="w-6 h-6" /></button>
                <button onClick={onExport} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Download className="w-5 h-5" /></button>
                <button onClick={onSettingsClick} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Settings className="w-5 h-5" /></button>
                <button onClick={onRecoveryClick} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><LifeBuoy className="w-5 h-5" /></button>
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

export default Header;