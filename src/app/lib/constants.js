// src/app/lib/constants.js
export const APP_VERSION = "v0.5.0-beta";
export const ENABLE_UPDATE_NOTIFICATION = false; // Toggle the update notification feature here
export const DEV_LOGGING_ENABLED = true; // Toggle console logs for development
export const MILEAGE_RATE = 0.45;
export const OVERTIME_RATE_STANDARD = 1.3;
export const OVERTIME_RATE_ENHANCED = 1.6;

export const ALLOWANCE_CLAIM_TYPES = {
    'Away from Base - Annex 14 >5': {
        description: 'Away from base for more than 5 hours and less than 10 hours including lunchtime (12-2) Annex 14',
        value: 5,
        ePayPrompt: 'Away from Base - Annex 14 >5 AFC'
    },
    'Rest Break Away from Base': {
        description: 'Rest break away from base - Does not meet the criteria for Annex 14',
        value: 5,
        ePayPrompt: 'Rest Break away from base BAS Non AFC'
    },
    'Away from Base - Annex 14 >10': {
        description: 'Evening Meal Subsistence - More than 10 hours away from base and return after 7pm',
        value: 15,
        ePayPrompt: 'Away from Base - Annex 14 >10 AFC'
    },
    'Late Rest Break': {
        description: 'Rest Break outside of meal break window LMB',
        value: 10,
        ePayPrompt: 'Rest Break outside of meal break window Non AFC'
    },
    'Disturbed Rest Break': {
        description: 'Disturbed Rest Break',
        value: 20,
        ePayPrompt: 'Disturbed Rest Break DMB Non AFC'
    },
    'No Rest Break': {
        description: 'No Rest Break allocated',
        value: 10,
        ePayPrompt: 'No Rest Break NMB Non AFC'
    }
};

export const PAY_BANDS = {
    'Band 3': { 'Entry': 12.75, 'Top': 13.60 },
    'Band 4': { '[EMAS] Student Technician (75%)': 12.24, 'Entry': 14.06, 'Top': 15.43 },
    'Band 5': { 'Entry': 15.88, 'Intermediate': 17.13, 'Top': 19.33 },
    'Band 6': { 'Entry': 19.78, 'Intermediate': 20.88, 'Top': 23.82 },
    'Band 7': { 'Entry': 24.45, 'Intermediate': 25.71, 'Top': 27.98 },
    'Band 8a': { 'Entry': 28.48, 'Intermediate': 29.91, 'Top': 32.06 },
    'Band 8b': { 'Entry': 32.96, 'Intermediate': 35.10, 'Top': 38.30 },
    'Band 8c': { 'Entry': 39.36, 'Intermediate': 41.76, 'Top': 45.35 },
    'Band 8d': { 'Entry': 46.71, 'Intermediate': 49.58, 'Top': 53.87 },
    'Band 9': { 'Entry': 55.84, 'Intermediate': 59.20, 'Top': 64.25 },
};

export const GRADES = ['UCA', 'ECA', 'ASC', 'Technician', 'Paramedic', 'Specialist Paramedic'];

export const DIVISIONS = ["Nottinghamshire", "Derbyshire", "Leicestershire", "Northamptonshire", "Lincolnshire"];

export const DIVISIONS_AND_STATIONS = {
    "Nottinghamshire": [
        { name: 'Beechdale Ambulance Station', postcode: 'NG8 3LL' },
        { name: 'Wilford Ambulance Station', postcode: 'NG11 7ESH' },
        { name: 'Hucknall Ambulance Station', postcode: 'NG15 8AY' },
        { name: 'Kingsmill (Mansfield) Ambulance Station', postcode: 'NG18 5HL' },
        { name: 'Newark Ambulance Station', postcode: 'NG24 1LH' },
        { name: 'Retford Ambulance Station', postcode: 'DN22 7XN' },
        { name: 'Worksop Ambulance Station', postcode: 'S81 7BH' },
        { name: 'Stapleford Ambulance Station', postcode: 'NG9 3LF' },
        { name: 'HART Base – Mansfield', postcode: 'NG18 5BU' },
    ],
    "Derbyshire": [
        { name: 'Chesterfield Ambulance Station', postcode: 'S42 7JT' },
        { name: 'Heath Interchange Ambulance Station', postcode: 'S44 5SL' },
        { name: 'Derby Ambulance Station (Willow Rd)', postcode: 'DE1 3NZ' },
        { name: 'Ilkeston Ambulance Station', postcode: 'DE7 5FW' },
        { name: 'Ripley Ambulance Station', postcode: 'DE5 3HN' },
        { name: 'Buxton Ambulance Station', postcode: 'SK17 6SN' },
        { name: 'Bakewell Ambulance Station', postcode: 'DE45 1AB' },
        { name: 'Swadlincote Ambulance Station', postcode: 'DE11 0AE' },
    ],
    "Leicestershire": [
        { name: 'Gorse Hill Ambulance Station', postcode: 'LE7 7GL' },
        { name: 'Goodwood Ambulance Station', postcode: 'LE5 4LH' },
        { name: 'Loughborough Ambulance Station', postcode: 'LE11 3GE' },
        { name: 'Hinckley Ambulance Station', postcode: 'LE10 0QY' },
        { name: 'Narborough Ambulance Station', postcode: 'LE19 3EQ' },
        { name: 'Coalville Ambulance Station', postcode: 'LE67 3PU' },
        { name: 'Lutterworth Ambulance Station', postcode: 'LE17 4DZ' },
    ],
    "Northamptonshire": [
        { name: 'Northampton Mereway Ambulance Station', postcode: 'NN4 8BE' },
        { name: 'Northampton North Ambulance Station', postcode: 'NN2 8DJ' },
        { name: 'Kettering Ambulance Station', postcode: 'NN16 8UZ' },
        { name: 'Corby Ambulance Station', postcode: 'NN17 1TR' },
        { name: 'Towcester Ambulance Station', postcode: 'NN12 6HD' },
        { name: 'Daventry Ambulance Station', postcode: 'NN11 4HN' },
    ],
    "Lincolnshire": [
        { name: 'Lincoln Ambulance Station', postcode: 'LN5 8EL' },
        { name: 'Sleaford Ambulance Station', postcode: 'NG34 7EN' },
        { name: 'Boston Ambulance Station', postcode: 'PE21 9QS' },
        { name: 'Grantham Ambulance Station', postcode: 'NG31 9DR' },
        { name: 'Skegness Ambulance Station', postcode: 'PE25 2RH' },
        { name: 'Horncastle Ambulance Station', postcode: 'LN9 6AW' },
        { name: 'Mablethorpe Ambulance Station', postcode: 'LN12 1DP' },
        { name: 'Louth Ambulance Station', postcode: 'LN11 7AS' },
        { name: 'Grimsby Ambulance Station', postcode: 'DN31 2RL' },
        { name: 'Scunthorpe Ambulance Station', postcode: 'DN15 6AL' },
        { name: 'Spalding Ambulance Station', postcode: 'PE11 3DT' },
        { name: 'Holbeach Ambulance Station', postcode: 'PE12 8AG' },
        { name: 'Market Rasen', postcode: 'LN8 3HZ' },
    ]
};

export const UK_BANK_HOLIDAYS = [
    '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', '2024-05-27', '2024-08-26', '2024-12-25', '2024-12-26',
    '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26', '2025-08-25', '2025-12-25', '2025-12-26'
];