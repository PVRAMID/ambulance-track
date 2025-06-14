'use client';
import React, { useMemo } from 'react';

const Calendar = ({ currentDate, onDateClick, entries }) => {
    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 

        let days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700/60"></div>);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayEntries = entries[dateString] || [];
            const isToday = new Date().toISOString().split('T')[0] === dateString;

            days.push(
                <div key={day} onClick={() => onDateClick(date)} className="relative p-2 border-r border-b border-gray-200 dark:border-gray-700/60 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800/80 transition-colors duration-200 aspect-square flex flex-col justify-start items-start group">
                    <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                    {dayEntries.length > 0 && 
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">{dayEntries.length}</div>
                    }
                </div>
            );
        }
        return days;
    }, [currentDate, entries, onDateClick]);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="grid grid-cols-7 bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-lg overflow-hidden">
            {daysOfWeek.map(day => <div key={day} className="text-center text-xs sm:text-sm font-semibold py-3 border-r border-b border-gray-200 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40">{day}</div>)}
            {calendarGrid}
        </div>
    );
};

export default Calendar;