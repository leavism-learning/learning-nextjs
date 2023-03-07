import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from "firebase/storage";
import { firebaseConfig } from '../lib/config';

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

export const Providers = {
  google: new GoogleAuthProvider(),
}

export const auth: Auth = getAuth();
export const firestore: Firestore = getFirestore();
export const storage: FirebaseStorage = getStorage();