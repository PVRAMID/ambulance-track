// src/app/lib/analytics.js
export async function sendAnalyticsEvent(eventType, data, userId) {
    const webhookUrl = 'https://discord.com/api/webhooks/1383425659719647252/aE9bIHJt_JISXtNl7F5X4PKarG3mLAA8BdqSK6IYnL0A_R4ZT8xOd4x9fWbeEyUYftkF';

    let locationInfo = 'Unknown';
    try {
        // Using a free IP-to-location API
        const res = await fetch('https://ipapi.co/json/');
        const locationData = await res.json();
        if (locationData && locationData.country_name) {
            locationInfo = `${locationData.city}, ${locationData.region}, ${locationData.country_name} (${locationData.country_calling_code})`;
        }
    } catch (error) {
        console.error('Failed to fetch location info:', error);
    }

    const eventColors = {
        'Creation': 3447003, // Green
        'Update': 15844367, // Yellow
        'Deletion': 15158332, // Red
    };

    const embed = {
        title: `Analytics Event: ${eventType}`,
        color: eventColors[eventType] || 10070709, // Default to gray
        fields: [
            { name: 'User ID', value: `\`${userId}\``, inline: false },
            { name: 'Timestamp', value: new Date().toUTCString(), inline: false },
            { name: 'User Agent', value: `\`\`\`${navigator.userAgent}\`\`\``, inline: false },
            { name: 'Country/Region', value: locationInfo, inline: false },
            { name: 'Entry Data', value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``, inline: false },
        ],
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (error) {
         console.error('Failed to send analytics event:', error);
    }
}