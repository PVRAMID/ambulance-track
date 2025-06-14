export async function getCoordsFromPostcode(postcode) {
    if (!postcode) {
        throw new Error('A postcode was not provided.');
    }
    try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.replace(/\s+/g, '')}`);
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.error || 'Postcode not found');
        }
        const data = await response.json();
        if (data.status === 200) {
            return {
                latitude: data.result.latitude,
                longitude: data.result.longitude,
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch postcode coordinates:", error);
        throw error;
    }
}

export function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
