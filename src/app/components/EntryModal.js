// src/app/components/EntryModal.js
'use client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { LUNCH_ALLOWANCE_PAY, EVENING_MEAL_ALLOWANCE_PAY, DISTURBED_MEAL_PAY, UK_BANK_HOLIDAYS, DIVISIONS, DIVISIONS_AND_STATIONS } from '../lib/constants';
import { X, Info, AlertTriangle } from 'lucide-react';

const EntryModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, existingEntry, settings }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const dateString = selectedDate.toISOString().split('T')[0];
        const dayIsSunday = selectedDate.getDay() === 0;
        const dayIsBankHoliday = UK_BANK_HOLIDAYS.includes(dateString);
        
        const initialData = {
            claimType: '', callsign: '', incidentNumber: '', details: '', 
            overtimeHours: '0', overtimeMinutes: '0', isEnhancedRate: dayIsSunday || dayIsBankHoliday,
            workingDivision: '', workingStation: '', mileage: '', mileagePay: 0,
            ...existingEntry
        };
        
        setFormData(initialData);
        setErrors({});
    }, [existingEntry, isOpen, selectedDate]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value.toUpperCase() }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDivisionChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value, workingStation: ''}));
    }

    const validate = () => {
        const newErrors = {};
        if (!formData.claimType) newErrors.claimType = "Claim type is required";
        if (['Late Finish', 'Disturbed Mealbreak', 'Mileage'].includes(formData.claimType) && !formData.callsign) newErrors.callsign = "Callsign is required";
        if (['Late Finish', 'Disturbed Mealbreak'].includes(formData.claimType) && !formData.incidentNumber) newErrors.incidentNumber = "Incident number is required";
        
        if (formData.claimType === 'Mileage') {
            if (!formData.workingDivision) newErrors.workingDivision = "Please select the division you worked in.";
            if (!formData.workingStation) newErrors.workingStation = "Please select your working station for the shift.";
            if (!settings.userPostcode) newErrors.userPostcode = "Your home postcode must be set in Settings.";
            if (!settings.station || !settings.division) newErrors.baseStation = "Your base division and station must be set in Settings.";
        }
        
        if (formData.claimType === 'Late Finish' && parseInt(formData.overtimeHours, 10) === 0 && parseInt(formData.overtimeMinutes, 10) === 0) {
            newErrors.overtime = "Overtime duration must be greater than 0.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsCalculating(true);
        setErrors({}); // Clear previous errors
        try {
            await onSave(formData);
        } catch (error) {
            setErrors({ apiError: error.message || "Calculation failed. Please check postcodes." });
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSaveClick} className="p-6 space-y-4">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{existingEntry ? "Edit Entry" : "Add Entry"} for {selectedDate?.toLocaleDateString()}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Claim Type*</label>
                    <select name="claimType" value={formData.claimType || ''} onChange={handleSelectChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select a type...</option>
                        <option value="Late Finish">Late Finish (Overtime)</option>
                        <option value="Mileage">Mileage</option>
                        <option value="Lunch Allowance">Lunch Allowance</option>
                        <option value="Evening Meal Allowance">Evening Meal Allowance</option>
                        <option value="Disturbed Mealbreak">Disturbed Mealbreak</option>
                    </select>
                    {errors.claimType && <p className="text-red-500 text-xs mt-1">{errors.claimType}</p>}
                    {formData.claimType === 'Lunch Allowance' && (<div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 rounded-lg text-red-800 dark:text-red-200 text-xs flex items-start space-x-2"><Info className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>More than five hours away from base, including the lunchtime period between 12:00pm to 2:00pm. Paid at £{LUNCH_ALLOWANCE_PAY.toFixed(2)}.</span></div>)}
                    {formData.claimType === 'Evening Meal Allowance' && (<div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 rounded-lg text-red-800 dark:text-red-200 text-xs flex items-start space-x-2"><Info className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>More than ten hours away from base and return after 7:00pm. Paid at £{EVENING_MEAL_ALLOWANCE_PAY.toFixed(2)}.</span></div>)}
                    {formData.claimType === 'Disturbed Mealbreak' && (<div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 rounded-lg text-red-800 dark:text-red-200 text-xs flex items-start space-x-2"><Info className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Paid at £{DISTURBED_MEAL_PAY.toFixed(2)}.</span></div>)}
                </div>

                {formData.claimType === 'Late Finish' && (
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 rounded-lg space-y-4">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Overtime Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" name="overtimeHours" value={formData.overtimeHours || '0'} onChange={handleChange} min="0" className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"/>
                            <input type="number" name="overtimeMinutes" value={formData.overtimeMinutes || '0'} onChange={handleChange} min="0" max="59" className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"/>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-500/30 rounded-lg text-yellow-800 dark:text-yellow-200 text-xs flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Overtime must be claimed to the exact minute as per recent policy changes.</span>
                        </div>
                        <div className="flex items-center space-x-3 pt-2">
                            <input type="checkbox" name="isEnhancedRate" id="enhancedRate" checked={formData.isEnhancedRate || false} onChange={handleChange} className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="enhancedRate" className="text-sm text-gray-700 dark:text-gray-300">Sunday / Bank Holiday Rate (Time + 60%)</label>
                        </div>
                        {errors.overtime && <p className="text-red-500 text-xs">{errors.overtime}</p>}
                    </div>
                )}
                
                {formData.claimType === 'Mileage' && (
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 rounded-lg space-y-4">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Mileage Details</p>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Working Division*</label>
                                <select name="workingDivision" value={formData.workingDivision || ''} onChange={handleDivisionChange} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100">
                                    <option value="">Select Division...</option>
                                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Working Station*</label>
                                <select name="workingStation" value={formData.workingStation || ''} onChange={handleSelectChange} disabled={!formData.workingDivision} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 disabled:opacity-50">
                                    <option value="">Select Station...</option>
                                    {formData.workingDivision && DIVISIONS_AND_STATIONS[formData.workingDivision]?.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {errors.workingDivision && <p className="text-red-500 text-xs">{errors.workingDivision}</p>}
                        {errors.workingStation && <p className="text-red-500 text-xs">{errors.workingStation}</p>}
                        {errors.userPostcode && <p className="text-red-500 text-xs mt-1">{errors.userPostcode}</p>}
                        {errors.baseStation && <p className="text-red-500 text-xs mt-1">{errors.baseStation}</p>}
                        {errors.apiError && <p className="text-red-500 text-xs mt-1 text-center font-semibold">{errors.apiError}</p>}
                    </div>
                )}
                
                {['Late Finish', 'Disturbed Mealbreak', 'Mileage'].includes(formData.claimType) && (
                    <input type="text" name="callsign" value={formData.callsign || ''} onChange={handleChange} maxLength="6" placeholder="Callsign*" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                )}
                {errors.callsign && <p className="text-red-500 text-xs mt-1">{errors.callsign}</p>}
                
                {['Late Finish', 'Disturbed Mealbreak'].includes(formData.claimType) && (
                    <input type="text" name="incidentNumber" value={formData.incidentNumber || ''} onChange={handleChange} placeholder="Incident Number*" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                )}
                {errors.incidentNumber && <p className="text-red-500 text-xs mt-1">{errors.incidentNumber}</p>}

                <textarea name="details" value={formData.details || ''} onChange={handleChange} rows="3" placeholder="Add extra notes..." className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"></textarea>

                <div className="flex items-center justify-between pt-4">
                    {existingEntry ? 
                        <button type="button" onClick={() => onDelete({ entryId: existingEntry.id, dateString: selectedDate.toISOString().split('T')[0] })} className="px-4 py-2 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors">Delete</button>
                        : <div></div>
                    }
                    <div className="flex items-center space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" disabled={isCalculating} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed">
                             {isCalculating ? 'Calculating...' : (existingEntry ? 'Update Entry' : 'Save Entry')}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
export default EntryModal;