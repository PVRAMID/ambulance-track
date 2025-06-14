import { useState, useEffect } from 'react';

export const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        // This part runs only on the client-side after hydration
        if (typeof window === 'undefined') {
            return defaultValue;
        }
        try {
            const persistentValue = localStorage.getItem(key);
            return persistentValue !== null ? JSON.parse(persistentValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage key “${key}”:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        // This effect also runs only on the client-side
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.error(`Error writing to localStorage key “${key}”:`, error);
            }
        }
    }, [key, state]);

    return [state, setState];
};
