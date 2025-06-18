import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { devLog } from '../lib/logger';

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

export const getAnnouncements = async () => {
    devLog('Fetching announcements from Firestore...');
    try {
        const announcementsCol = collection(db, 'announcements');
        const q = query(announcementsCol, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const announcements = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        devLog(`Successfully fetched ${announcements.length} announcements.`);
        return { success: true, data: announcements };
    } catch (error) {
        console.error("Error fetching announcements:", error);
        devLog('Announcement fetch failed:', error);
        return { success: false, error: 'Could not fetch announcements.' };
    }
};