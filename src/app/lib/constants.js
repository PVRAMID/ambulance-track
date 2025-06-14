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

export const ICONS = {
    ChevronLeft: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    ChevronRight: "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z",
    X: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    Download: "M5 20h14v-2H5v2zm9-12h-4v6H5l7 7 7-7h-5V8z",
    Settings: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24-.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69-.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
    Edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    Info: "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
    Clock: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
    AlertTriangle: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    Sun: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.64 5.64zm12.72 12.72c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zM5.64 18.36l-1.06-1.06c-.39-.39-.39-1.02 0-1.41s1.02-.39 1.41 0l1.06 1.06c.39.39.39 1.02 0 1.41s-1.02.39-1.41 0zM19.78 5.64l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.06-1.06c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0z",
    Moon: "M9.37 5.51c.36-.22.44-.69.15-1.02C8.12 3.01 6.35 2.18 4.44 2.18 2.02 2.18.21 4.14.21 6.56c0 2.27 1.68 4.14 3.91 4.48.49.07.93-.32.93-.81v-.01c0-.4-.3-.73-.69-.81-.97-.21-1.72-1-1.72-2.06 0-1.16.94-2.11 2.1-2.11.83 0 1.54.49 1.88 1.2.32.7.97 1.11 1.73 1.11.58 0 1.1-.31 1.41-.79.35-.55.23-1.29-.28-1.7z"
};

export const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);
