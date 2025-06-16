// src/app/lib/calculations.js
import { PAY_BANDS, OVERTIME_RATE_ENHANCED, OVERTIME_RATE_STANDARD, DIVISIONS_AND_STATIONS, MILEAGE_RATE } from './constants';
import { getCoordsFromPostcode, getDistanceFromLatLonInMiles } from './mileage';

export function calculateOvertime(settings, overtimeHours, overtimeMinutes, isEnhancedRate) {
    const hourlyRate = settings.band && settings.step ? PAY_BANDS[settings.band]?.[settings.step] : 0;
    
    if (!hourlyRate) {
        // This case should be handled by the caller, but we return a default value.
        return { overtimePay: 0, overtimeDuration: 0, error: 'Please set your Pay Band and Step Point in Settings to calculate overtime pay.' };
    }

    const totalMinutes = (parseInt(overtimeHours || 0) * 60) + parseInt(overtimeMinutes || 0);
    const rateModifier = isEnhancedRate ? OVERTIME_RATE_ENHANCED : OVERTIME_RATE_STANDARD;
    const overtimePay = (hourlyRate / 60) * totalMinutes * rateModifier;

    return { overtimePay, overtimeDuration: totalMinutes };
}

export async function calculateMileage(settings, workingDivision, workingStation) {
    try {
        let homeCoords, baseCoords, workCoords;

        try {
            homeCoords = await getCoordsFromPostcode(settings.userPostcode);
        } catch (e) {
            throw new Error(`Your Home Postcode ('${settings.userPostcode}') could not be found. Please check it in Settings.`);
        }

        try {
            const baseStationPostcode = DIVISIONS_AND_STATIONS[settings.division]?.find(s => s.name === settings.station)?.postcode;
            if (!baseStationPostcode) throw new Error('Your Base Station is not selected or invalid. Please check it in Settings.');
            baseCoords = await getCoordsFromPostcode(baseStationPostcode);
        } catch (e) {
            throw new Error(`Your Base Station's postcode could not be found. Please check your selection in Settings.`);
        }

        try {
            const workingStationPostcode = DIVISIONS_AND_STATIONS[workingDivision]?.find(s => s.name === workingStation)?.postcode;
            if (!workingStationPostcode) throw new Error('The selected Working Station is invalid.');
            workCoords = await getCoordsFromPostcode(workingStationPostcode);
        } catch (e) {
            throw new Error(`The Working Station's postcode could not be found.`);
        }
        
        const homeToWork = getDistanceFromLatLonInMiles(homeCoords.latitude, homeCoords.longitude, workCoords.latitude, workCoords.longitude);
        const homeToBase = getDistanceFromLatLonInMiles(homeCoords.latitude, homeCoords.longitude, baseCoords.latitude, baseCoords.longitude);
        
        const totalJourneyToWork = homeToWork * 2;
        const usualJourneyToBase = homeToBase * 2;
        
        const claimableMileage = Math.max(0, totalJourneyToWork - usualJourneyToBase);
        
        const mileage = claimableMileage.toFixed(2);
        const mileagePay = claimableMileage * MILEAGE_RATE;

        const calculationBreakdown = {
            homeToWork: homeToWork.toFixed(2),
            homeToBase: homeToBase.toFixed(2),
            totalJourneyToWork: totalJourneyToWork.toFixed(2),
            usualJourneyToBase: usualJourneyToBase.toFixed(2),
            claimableMileage: claimableMileage.toFixed(2),
            mileageRate: MILEAGE_RATE,
            estimatedPay: mileagePay.toFixed(2)
        };
        
        return { mileage, mileagePay, calculationBreakdown };

    } catch (err) {
        // Re-throw the specific error message from the try blocks.
        throw err;
    }
}