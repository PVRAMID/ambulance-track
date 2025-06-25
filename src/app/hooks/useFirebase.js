// src/app/hooks/useFirebase.js
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, orderBy, addDoc, updateDoc, serverTimestamp, onSnapshot, where } from 'firebase/firestore';
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

// --- Ticket System Functions ---

export const createTicket = async (userId, ticketData) => {
    if (!userId) return { success: false, error: 'User ID is required.' };
    devLog(`Creating new ticket for user ${userId}`);
    try {
        const { subject, initialMessage, userName } = ticketData;
        const ticketsCol = collection(db, 'tickets');
        const newTicketRef = await addDoc(ticketsCol, {
            userId,
            subject,
            userName: userName || 'Anonymous',
            status: 'open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isReadByUser: true,
            isReadByAdmin: false,
        });

        const messagesCol = collection(newTicketRef, 'messages');
        await addDoc(messagesCol, {
            senderId: userId,
            text: initialMessage,
            timestamp: serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return { success: false, error: 'Could not create ticket.' };
    }
};

export const createTicketForUser = async (adminUid, targetUserId, ticketData) => {
    if (!adminUid || !targetUserId) return { success: false, error: 'Admin and target User ID are required.' };
    devLog(`Admin ${adminUid} creating new ticket for user ${targetUserId}`);
    try {
        const { subject, initialMessage } = ticketData;
        const ticketsCol = collection(db, 'tickets');
        const newTicketRef = await addDoc(ticketsCol, {
            userId: targetUserId,
            subject,
            userName: 'Admin Initiated',
            status: 'open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isReadByUser: false,
            isReadByAdmin: true,
        });

        const messagesCol = collection(newTicketRef, 'messages');
        await addDoc(messagesCol, {
            senderId: adminUid,
            text: initialMessage,
            timestamp: serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating ticket for user:', error);
        return { success: false, error: 'Could not create ticket.' };
    }
};


export const getTicketsForUser = (userId, callback) => {
    if (!userId) return () => {};
    devLog(`Setting up ticket listener for user ${userId}`);
    const ticketsCol = collection(db, 'tickets');
    const q = query(ticketsCol, where('userId', '==', userId), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(userTickets);
    }, (error) => {
        console.error("Error listening for ticket updates:", error);
    });

    return unsubscribe;
};

export const getMessagesForTicket = (ticketId, callback) => {
    if (!ticketId) return () => {};
    const messagesCol = collection(db, 'tickets', ticketId, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    }, (error) => {
        console.error(`Error listening for messages for ticket ${ticketId}:`, error);
    });

    return unsubscribe;
};

export const addMessageToTicket = async (ticketId, senderId, text, isSenderAdmin = false) => {
    if (!ticketId || !senderId || !text) return { success: false, error: 'Missing required fields.' };
    try {
        const messagesCol = collection(db, 'tickets', ticketId, 'messages');
        await addDoc(messagesCol, { senderId, text, timestamp: serverTimestamp() });
        
        const ticketRef = doc(db, 'tickets', ticketId);
        await updateDoc(ticketRef, { 
            updatedAt: serverTimestamp(),
            isReadByAdmin: isSenderAdmin ? true : false,
            isReadByUser: isSenderAdmin ? false : true,
        });

        return { success: true };
    } catch(error) {
        console.error(`Error adding message to ticket ${ticketId}:`, error);
        return { success: false, error: 'Could not add message.'};
    }
};

export const markTicketAsRead = async (ticketId, userType) => {
    if (!ticketId) return;
    try {
        const ticketRef = doc(db, 'tickets', ticketId);
        const updateData = userType === 'user' ? { isReadByUser: true } : { isReadByAdmin: true };
        await updateDoc(ticketRef, updateData);
    } catch (error) {
        console.error(`Error marking ticket ${ticketId} as read:`, error);
    }
};


// --- Admin Functions ---
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

export const getAllTickets = (callback) => {
    const ticketsCol = collection(db, 'tickets');
    const q = query(ticketsCol, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(allTickets);
    }, (error) => {
        console.error("Error listening for all ticket updates:", error);
    });

    return unsubscribe;
};

export const updateTicketStatus = async (ticketId, status) => {
    if (!ticketId || !status) return { success: false, error: 'Ticket ID and status are required.' };
    try {
        const ticketRef = doc(db, 'tickets', ticketId);
        await updateDoc(ticketRef, { status: status, updatedAt: serverTimestamp() });
        return { success: true };
    } catch (error) {
        console.error(`Error updating status for ticket ${ticketId}:`, error);
        return { success: false, error: 'Could not update status.' };
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

export const mergeUserEntries = async (sourceUserId, targetUserId) => {
    if (!sourceUserId || !targetUserId) {
        return { success: false, error: 'Both source and target User IDs are required.' };
    }
    if (sourceUserId === targetUserId) {
        return { success: false, error: 'Source and Target User IDs cannot be the same.' };
    }

    devLog(`Starting merge from ${sourceUserId} to ${targetUserId}`);

    try {
        const sourceDocRef = doc(db, 'user-data', sourceUserId);
        const targetDocRef = doc(db, 'user-data', targetUserId);

        const sourceDocSnap = await getDoc(sourceDocRef);
        const targetDocSnap = await getDoc(targetDocRef);

        if (!sourceDocSnap.exists()) {
            return { success: false, error: `Source user (${sourceUserId}) not found.` };
        }
        if (!targetDocSnap.exists()) {
            return { success: false, error: `Target user (${targetUserId}) not found.` };
        }

        const sourceData = sourceDocSnap.data();
        const targetData = targetDocSnap.data();

        const sourceEntries = sourceData.entries || {};
        const targetEntries = targetData.entries || {};
        
        const mergedEntries = { ...targetEntries };

        for (const date in sourceEntries) {
            if (Object.prototype.hasOwnProperty.call(sourceEntries, date)) {
                if (mergedEntries[date]) {
                    const existingIds = new Set(mergedEntries[date].map(e => e.id));
                    const newEntriesForDate = sourceEntries[date].filter(e => !existingIds.has(e.id));
                    mergedEntries[date] = [...mergedEntries[date], ...newEntriesForDate];
                } else {
                    mergedEntries[date] = sourceEntries[date];
                }
            }
        }

        await updateDoc(targetDocRef, { entries: mergedEntries, lastSynced: serverTimestamp() });
        
        await deleteDoc(sourceDocRef);

        devLog(`Merge successful. ${sourceUserId} entries merged into ${targetUserId} and source document deleted.`);
        return { success: true };

    } catch (error) {
        console.error("Error merging user entries:", error);
        devLog('Merge failed:', error);
        return { success: false, error: 'An error occurred during the merge process.' };
    }
};
