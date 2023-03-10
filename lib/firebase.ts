import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { collection, CollectionReference, Firestore, getFirestore, where, query, getDocs, QueryDocumentSnapshot, Query, DocumentData, limit, DocumentSnapshot } from 'firebase/firestore';
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


export async function getUserWithUsername(username) {
  const usersCollection: CollectionReference = collection(firestore, 'users')
  const usernameQuery: Query<DocumentData> = query(usersCollection,
    where('username', '==', username),
    limit(1),
    );
  const userDocument: QueryDocumentSnapshot<DocumentData> = (await getDocs(usernameQuery)).docs[0];

  return userDocument;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshopt} doc 
 * @returns 
 */

export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis(),
    updatedAt: data?.updatedAt.toMillis(),
  };
}