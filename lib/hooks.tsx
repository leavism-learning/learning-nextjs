import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc} from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
  
    useEffect(() => {
      async function unsubscribe() {
        let unsubscribe;
  
        if (user) {
          const userRef = doc(firestore, 'users', user.uid)
          unsubscribe = await getDoc(userRef)
            .then((ref) => {
              setUsername(ref.data()?.username);
            })
        } else {
          setUsername(null);
        }
        return unsubscribe;
      }
  
      unsubscribe()
    }, [user]);

    return { user, username };
}