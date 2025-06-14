// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/lib/constants.js
export const MILEAGE_RATE = 0.45;
export const DISTURBED_MEAL_PAY = 20;
export const LUNCH_ALLOWANCE_PAY = 5;
export const EVENING_MEAL_ALLOWANCE_PAY = 15;
export const OVERTIME_RATE_STANDARD = 1.3;
export const OVERTIME_RATE_ENHANCED = 1.6;

export const PAY_BANDS = {
    'Band 3': { 'Entry': 12.75, 'Top': 13.60 },
    'Band 4': { 'Entry': 14.06, 'Top': 15.43 },
    'Band 5': { 'Entry': 15.88, 'Intermediate': 17.13, 'Top': 19.33 },
    'Band 6': { 'Entry': 19.78, 'Intermediate': 20.88, 'Top': 23.82 },
    'Band 7': { 'Entry': 24.45, 'Intermediate': 25.71, 'Top': 27.98 },
    'Band 8a': { 'Entry': 28.48, 'Intermediate': 29.91, 'Top': 32.06 },
    'Band 8b': { 'Entry': 32.96, 'Intermediate': 35.10, 'Top': 38.30 },
    'Band 8c': { 'Entry': 39.36, 'Intermediate': 41.76, 'Top': 45.35 },
    'Band 8d': { 'Entry': 46.71, 'Intermediate': 49.58, 'Top': 53.87 },
    'Band 9': { 'Entry': 55.84, 'Intermediate': 59.20, 'Top': 64.25 },
};

export const GRADES = ['UCA', 'ECA', 'Technician', 'Paramedic', 'Specialist Paramedic'];

export const STATIONS = [
    { name: 'Coalville Ambulance Station', postcode: 'LE67 3PU' },
    { name: 'Loughborough Ambulance Station', postcode: 'LE11 3GE' },
    { name: 'Goodwood Ambulance Station', postcode: 'LE5 7LH' },
    { name: 'Gorse Hill Ambulance Station', postcode: 'LE7 7GL' },
    { name: 'Narborough Ambulance Station', postcode: 'LE19 3EQ' },
    { name: 'Lutterworth Ambulance Station', postcode: 'LE17 4DZ' },
    { name: 'Market Harborough Ambulance Station', postcode: 'LE16 9AA' },
    { name: 'Hinckley Ambulance Station', postcode: 'LE10 3DA' }
];

export const UK_BANK_HOLIDAYS = [
    '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', '2024-05-27', '2024-08-26', '2024-12-25', '2024-12-26',
    '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26', '2025-08-25', '2025-12-25', '2025-12-26'
];