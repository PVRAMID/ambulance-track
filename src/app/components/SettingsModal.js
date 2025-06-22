// src/app/components/SettingsModal.js
'use client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { GRADES, PAY_BANDS, DIVISIONS, DIVISIONS_AND_STATIONS, SHIFT_CLAIM_TYPES } from '../lib/constants';
import { X } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
    const [settings, setSettings] = useState(currentSettings);
    const [activeTab, setActiveTab] = useState('general');
    
    useEffect(() => { 
        // Ensure customShiftTypes is populated from constants if not present
        const initialSettings = {
            ...currentSettings,
            customShiftTypes: {
                ...SHIFT_CLAIM_TYPES,
                ...(currentSettings.customShiftTypes || {})
            }
        };
        setSettings(initialSettings); 
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

    const handleDivisionChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value, station: '' })); // Reset station when division changes
    }
    
    const handleCustomizationChange = (claimType, field, value) => {
        setSettings(prev => ({
            ...prev,
            customShiftTypes: {
                ...prev.customShiftTypes,
                [claimType]: {
                    ...prev.customShiftTypes[claimType],
                    [field]: value
                }
            }
        }));
    };

    const handleSave = (e) => { e.preventDefault(); onSave(settings); };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSave} className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button type="button" onClick={() => setActiveTab('general')} className={`${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                            General
                        </button>
                        <button type="button" onClick={() => setActiveTab('customisation')} className={`${activeTab === 'customisation' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                            Customisation
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'general' && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Home Postcode</label>
                            <input type="text" name="userPostcode" value={settings.userPostcode || ''} onChange={handleChange} placeholder="e.g. NG1 1AA" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Grade</label>
                            <select name="grade" value={settings.grade || ''} onChange={handleSelectChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                                <option value="">Select Grade...</option>
                                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Pay Band</label>
                                <select name="band" value={settings.band || ''} onChange={handleSelectChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                                    <option value="">Select Band...</option>
                                    {Object.keys(PAY_BANDS).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Step Point</label>
                                <select name="step" value={settings.step || ''} onChange={handleSelectChange} disabled={!settings.band} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 disabled:opacity-50">
                                    <option value="">Select Step...</option>
                                    {settings.band && Object.keys(PAY_BANDS[settings.band]).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        {settings.band && settings.step && <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">Hourly Rate: £{(PAY_BANDS[settings.band][settings.step] || 0).toFixed(2)}</p>}
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Division</label>
                                <select name="division" value={settings.division || ''} onChange={handleDivisionChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100">
                                    <option value="">Select Division...</option>
                                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Base Station</label>
                                <select name="station" value={settings.station || ''} onChange={handleSelectChange} disabled={!settings.division} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 disabled:opacity-50">
                                    <option value="">Select Station...</option>
                                    {settings.division && DIVISIONS_AND_STATIONS[settings.division]?.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'customisation' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Customise the abbreviations and colors for shift types shown on the calendar.</p>
                        {Object.entries(settings.customShiftTypes || {}).map(([claimType, details]) => (
                            <div key={claimType} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg grid grid-cols-3 gap-4 items-center">
                                <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{claimType}</span>
                                <input 
                                    type="text"
                                    value={details.abbreviation}
                                    onChange={(e) => handleCustomizationChange(claimType, 'abbreviation', e.target.value)}
                                    maxLength="5"
                                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"
                                />
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="color"
                                        value={details.color}
                                        onChange={(e) => handleCustomizationChange(claimType, 'color', e.target.value)}
                                        className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-transparent"
                                        style={{'backgroundColor': details.color}}
                                    />
                                    <span className="font-mono text-xs text-gray-500">{details.color}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                <div className="flex items-center justify-end pt-6">
                    <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Save Settings</button>
                </div>
            </form>
        </Modal>
    );
};
export default SettingsModal;