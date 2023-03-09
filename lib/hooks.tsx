import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, onSnapshot} from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
      let unsubscribe;

      if (user) {
        const userReference = doc(firestore, 'users', user!.uid);
        unsubscribe = onSnapshot(userReference, (doc) => {
          setUsername(doc.data()?.username);
        })
      } else {
        setUsername(null);
      }
    }, [user]);

    return { user, username };
}