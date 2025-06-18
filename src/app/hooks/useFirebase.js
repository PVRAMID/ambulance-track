// src/app/hooks/useFirebase.js
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { devLog } from '../lib/logger';

// A stateless collection of functions to interact with Firebase.

export const syncData = async (userId, dataToSync) => {
  if (!userId) return { success: false, error: 'No user ID provided.' };
  devLog(`Syncing data for user: ${userId}`);
  try {
    const userDocRef = doc(db, 'user-data', userId);
    await setDoc(userDocRef, dataToSync, { merge: true });
    devLog('Sync successful.');
    return { success: true };
  } catch (error) {
    console.error("Error syncing data:", error);
    devLog('Sync failed:', error);
    return { success: false, error };
  }
};

export const recoverData = async (recoveryCode) => {
  devLog(`Attempting to recover data with code: ${recoveryCode}`);
  try {
    const userDocRef = doc(db, 'user-data', recoveryCode);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      devLog('Recovery successful, data found.');
      return { success: true, data };
    } else {
      devLog('No data found for that recovery code.');
      return { success: false, error: 'No data found for that recovery code.' };
    }
  } catch (error) {
    console.error("Error recovering data:", error);
    devLog('Recovery failed:', error);
    return { success: false, error: 'An error occurred during recovery.' };
  }
};

export const deleteServerData = async (userId) => {
  if (!userId) return { success: false, error: 'No user ID provided.' };
  devLog(`Deleting server data for user: ${userId}`);
  try {
    const userDocRef = doc(db, 'user-data', userId);
    await deleteDoc(userDocRef);
    devLog('Server data deleted successfully.');
    return { success: true };
  } catch (error) {
    console.error("Error deleting data:", error);
    devLog('Error deleting server data:', error);
    return { success: false, error: 'An error occurred while deleting your data.' };
  }
};