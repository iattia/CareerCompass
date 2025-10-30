import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, query, orderBy, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { AssessmentAnswers, Career, ForumPost } from '@/types';

const firebaseConfig = {
  apiKey: "AIzaSyDifSB_R5Emz6zBLwGh41aTje9rMmLI3dk",
  authDomain: "career-40e93.firebaseapp.com",
  projectId: "career-40e93",
  storageBucket: "career-40e93.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Firebase not configured
  db = null;
  auth = null;
}

export { db, auth };

// User Profile Functions
export const saveUserProfile = async (userId: string, data: { answers: AssessmentAnswers; careers: Career[] }) => {
  if (!db) {
    console.warn('Firebase not available, using localStorage as fallback');
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
    return;
  }
  
  try {
    const userRef = doc(db, 'profiles', userId);
    await setDoc(userRef, {
      answers: data.answers,
      careers: data.careers,
      updatedAt: new Date(),
    }, { merge: true });
  } catch (error) {
    console.warn('Failed to save to Firebase, using localStorage as fallback:', error);
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
  }
};

export const getUserProfile = async (userId: string) => {
  if (!db) {
    console.warn('Firebase not available, using localStorage as fallback');
    const stored = localStorage.getItem(`profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
  
  try {
    const userRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn('Failed to get profile from Firebase, using localStorage as fallback:', error);
    const stored = localStorage.getItem(`profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
};

// Forum Post Functions
export const createForumPost = async (post: Omit<ForumPost, 'id'>) => {
  if (!db) {
    console.warn('Firebase not available, forum posts not supported');
    return 'temp-post-id';
  }
  
  try {
    const postsRef = collection(db, 'forumPosts');
    const docRef = await addDoc(postsRef, {
      ...post,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Failed to create forum post:', error);
    return 'temp-post-id';
  }
};

export const getForumPosts = async (): Promise<ForumPost[]> => {
  if (!db) {
    console.warn('Firebase not available, returning empty forum posts');
    return [];
  }
  
  try {
    const postsRef = collection(db, 'forumPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      replies: (doc.data().replies || []).map((reply: any) => ({
        ...reply,
        createdAt: reply.createdAt?.toDate() || new Date(),
      })),
    })) as ForumPost[];
  } catch (error) {
    console.warn('Failed to get forum posts:', error);
    return [];
  }
};

export const addReplyToPost = async (postId: string, reply: any) => {
  if (!db) {
    console.warn('Firebase not available, reply not added');
    return;
  }
  
  try {
    const postRef = doc(db, 'forumPosts', postId);
    await updateDoc(postRef, {
      replies: arrayUnion({
        ...reply,
        createdAt: new Date(),
      }),
    });
  } catch (error) {
    console.warn('Failed to add reply:', error);
  }
};
