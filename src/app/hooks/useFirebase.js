// src/app/hooks/useFirebase.js
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, orderBy, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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

export const updateUserDoc = async (userId, dataToUpdate) => {
    if (!userId) return { success: false, error: 'No user ID provided.' };
    devLog(`Updating document for user: ${userId}`);
    try {
        const userDocRef = doc(db, 'user-data', userId);
        await setDoc(userDocRef, dataToUpdate, { merge: true });
        devLog('User document update successful.');
        return { success: true };
    } catch (error) {
        console.error("Error updating user document:", error);
        devLog('User document update failed:', error);
        return { success: false, error };
    }
}

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

// Admin Functions
export const checkIfAdmin = async (uid) => {
    if (!uid) return false;
    devLog(`Checking admin status for UID: ${uid}`);
    try {
        const adminDocRef = doc(db, 'admins', uid);
        const docSnap = await getDoc(adminDocRef);
        if (docSnap.exists() && docSnap.data().isAdmin === true) {
            devLog('User is an admin.');
            return true;
        }
        devLog('User is not an admin.');
        return false;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
};

export const getAllUsers = async () => {
    devLog('Fetching all users...');
    try {
        const usersCol = collection(db, 'user-data');
        const querySnapshot = await getDocs(usersCol);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: 'Could not fetch users.' };
    }
};

export const deleteUserContent = async (userIdToDelete) => {
    devLog(`Attempting to delete content for user: ${userIdToDelete}`);
    try {
        const userDocRef = doc(db, 'user-data', userIdToDelete);
        await deleteDoc(userDocRef);
        return { success: true };
    } catch (error) {
        console.error(`Error deleting content for user ${userIdToDelete}:`, error);
        return { success: false, error: 'Could not delete user content.' };
    }
};

export const createAnnouncement = async (announcementData) => {
    devLog('Creating new announcement...');
    try {
        const announcementsCol = collection(db, 'announcements');
        await addDoc(announcementsCol, {
            ...announcementData,
            timestamp: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating announcement:", error);
        return { success: false, error: 'Could not create announcement.' };
    }
};

export const updateAnnouncement = async (id, announcementData) => {
    devLog(`Updating announcement: ${id}`);
    try {
        const announcementDocRef = doc(db, 'announcements', id);
        await updateDoc(announcementDocRef, announcementData);
        return { success: true };
    } catch (error) {
        console.error(`Error updating announcement ${id}:`, error);
        return { success: false, error: 'Could not update announcement.' };
    }
};

export const deleteAnnouncement = async (id) => {
    devLog(`Deleting announcement: ${id}`);
    try {
        const announcementDocRef = doc(db, 'announcements', id);
        await deleteDoc(announcementDocRef);
        return { success: true };
    } catch (error) {
        console.error(`Error deleting announcement ${id}:`, error);
        return { success: false, error: 'Could not delete announcement.' };
    }
};

export const addAdmin = async (uid) => {
    if (!uid) return { success: false, error: 'No UID provided.' };
    devLog(`Adding new admin: ${uid}`);
    try {
        const adminDocRef = doc(db, 'admins', uid);
        await setDoc(adminDocRef, { isAdmin: true });
        return { success: true };
    } catch (error) {
        console.error(`Error adding admin ${uid}:`, error);
        return { success: false, error: 'Could not add admin.' };
    }
};
