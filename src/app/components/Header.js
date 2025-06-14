// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/components/Header.js
'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, Download, Settings, Sun, Moon } from 'lucide-react';

const Header = ({ currentDate, setCurrentDate, onExport, onSettingsClick, theme, setTheme }) => {
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
            <div className="flex items-center space-x-2">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><ChevronRight className="w-6 h-6" /></button>
                <button onClick={onExport} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Download className="w-5 h-5" /></button>
                <button onClick={onSettingsClick} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><Settings className="w-5 h-5" /></button>
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

export default Header;