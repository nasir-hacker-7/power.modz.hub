
import { ContentItem, ProfileSettings } from '../types';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  updateDoc, 
  increment, 
  query, 
  orderBy,
  getDocs,
  getDoc,
  setDoc,
  runTransaction
} from 'firebase/firestore';

const COLLECTION_NAME = 'content';
const SETTINGS_COLLECTION = 'settings';
const PROFILE_DOC_ID = 'profile_main';

export const dataService = {
  // Real-time subscription to data
  subscribeToContent: (callback: (items: ContentItem[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uploadDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: ContentItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({ 
          id: doc.id, 
          ...data,
          // Ensure backward compatibility if isVisible is missing
          isVisible: data.isVisible !== undefined ? data.isVisible : true 
        } as ContentItem);
      });
      callback(items);
    });
    
    return unsubscribe; // Return cleanup function
  },

  // One-time fetch
  getAllItemsOnce: async (): Promise<ContentItem[]> => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uploadDate', 'desc'));
    const querySnapshot = await getDocs(q);
    const items: ContentItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({ 
        id: doc.id, 
        ...data,
        isVisible: data.isVisible !== undefined ? data.isVisible : true 
      } as ContentItem);
    });
    return items;
  },

  // Fetch single item by ID
  getItemById: async (id: string): Promise<ContentItem | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          id: docSnap.id, 
          ...data,
          isVisible: data.isVisible !== undefined ? data.isVisible : true
        } as ContentItem;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      return null;
    }
  },

  // Add Item to Firestore
  addItem: async (item: Omit<ContentItem, 'id' | 'views' | 'uploadDate'>): Promise<string> => {
    const newItem = {
      ...item,
      views: 0,
      uploadDate: new Date().toISOString(),
      isVisible: item.isVisible !== undefined ? item.isVisible : true,
      dayDownloads: 0,
      lastDownloadDate: new Date().toISOString().split('T')[0]
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newItem);
    return docRef.id;
  },

  // Update Item in Firestore
  updateItem: async (id: string, updates: Partial<ContentItem>): Promise<void> => {
    const itemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(itemRef, updates);
  },

  // Delete Item from Firestore
  deleteItem: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  // Increment Views in Firestore
  incrementViews: async (id: string): Promise<void> => {
    const itemRef = doc(db, COLLECTION_NAME, id);
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(itemRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        
        const data = sfDoc.data();
        const lastDate = data.lastDownloadDate || "";
        const currentDayDownloads = data.dayDownloads || 0;
        const currentTotalViews = data.views || 0;

        let newDayDownloads = 1;
        if (lastDate === todayStr) {
          newDayDownloads = currentDayDownloads + 1;
        }

        transaction.update(itemRef, { 
          views: currentTotalViews + 1,
          lastDownloadDate: todayStr,
          dayDownloads: newDayDownloads
        });
      });
    } catch (e) {
      console.error("Failed to increment views safely", e);
      await updateDoc(itemRef, {
        views: increment(1)
      });
    }
  },

  // --- Profile Settings ---

  getProfileSettings: async (): Promise<ProfileSettings | null> => {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ProfileSettings;
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile settings:", error);
      return null;
    }
  },

  updateProfileSettings: async (settings: ProfileSettings): Promise<void> => {
    const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  }
};
