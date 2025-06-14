// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/components/SettingsModal.js
'use client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { GRADES, PAY_BANDS, STATIONS } from '../lib/constants';
import { X } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
    const [settings, setSettings] = useState(currentSettings);
    
    useEffect(() => { 
        setSettings(currentSettings); 
    }, [currentSettings, isOpen]);
    
    useEffect(() => {
        if (settings.band && !PAY_BANDS[settings.band]?.[settings.step]) {
            setSettings(s => ({ ...s, step: Object.keys(PAY_BANDS[s.band])[0] }));
        }
    }, [settings.band, settings.step]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value.toUpperCase() }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSave = (e) => { e.preventDefault(); onSave(settings); };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Home Postcode</label>
                    <input type="text" name="userPostcode" value={settings.userPostcode || ''} onChange={handleChange} placeholder="e.g. NG1 1AA" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Grade</label>
                    <select name="grade" value={settings.grade} onChange={handleSelectChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                        <option value="">Select Grade...</option>
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Pay Band</label>
                        <select name="band" value={settings.band} onChange={handleSelectChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                            <option value="">Select Band...</option>
                            {Object.keys(PAY_BANDS).map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Step Point</label>
                        <select name="step" value={settings.step} onChange={handleSelectChange} disabled={!settings.band} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 disabled:opacity-50">
                            <option value="">Select Step...</option>
                            {settings.band && Object.keys(PAY_BANDS[settings.band]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                {settings.band && settings.step && <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">Hourly Rate: £{(PAY_BANDS[settings.band][settings.step]).toFixed(2)}</p>}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Contractual Base Station</label>
                    <select name="station" value={settings.station} onChange={handleSelectChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                        <option value="">Select Base Station...</option>
                        {STATIONS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center justify-end pt-4">
                    <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Save Settings</button>
                </div>
            </form>
        </Modal>
    );
};
export default SettingsModal;