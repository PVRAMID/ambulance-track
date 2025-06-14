'use client';
import React from 'react';
import { ICONS, Icon } from '../lib/constants';

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
        <header className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h1>
            <div className="flex items-center space-x-1 sm:space-x-2">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Icon path={ICONS.ChevronLeft} className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Icon path={ICONS.ChevronRight} className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                <button onClick={onExport} className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"><Icon path={ICONS.Download} className="w-5 h-5" /></button>
                <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"><Icon path={ICONS.Settings} className="w-5 h-5" /></button>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-500 dark:text-yellow-400 transition-colors">
                   {theme === 'dark' ? <Icon path={ICONS.Sun} className="w-5 h-5" /> : <Icon path={ICONS.Moon} className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

export default Header;
