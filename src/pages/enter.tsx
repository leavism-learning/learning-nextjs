import Head from 'next/head';
import Image from 'next/image';

import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import debounce from 'lodash.debounce';

import { auth, firestore, Providers } from '../../lib/firebase';
import { UserContext } from 'lib/context';

import { signInWithPopup } from 'firebase/auth';
import { doc, DocumentReference, getDoc, WriteBatch, writeBatch } from 'firebase/firestore';

export default function Enter(_props: any) {
    const { user, username } = useContext(UserContext);

    return (
        <>
            <Head>
                <title>Enter Page</title>
                <meta name="description" content="Sample Sign up Page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Sign up</h1>
                {user ?
                    !username ? <UsernameForm /> : <SignOutButton />
                    : <SignInButton />
                }
            </main>
        </>
    )
}

function SignInButton(): JSX.Element {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, Providers.google)
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image
                src="/google.png"
                alt="Google logo"
                width={30} height={30}
            /> Sign in with Google
        </button>
    );
}

function SignOutButton(): JSX.Element {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm(): JSX.Element {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    async function onSubmit(event: { preventDefault: () => void; }): Promise<void> {
        event.preventDefault();

        const userReference: DocumentReference = doc(firestore, 'users', user!.uid);
        const usernameReference: DocumentReference = doc(firestore, 'username', formValue);

        const batch: WriteBatch = writeBatch(firestore);
        batch.set(userReference, {
            username: formValue,
            photoURL: user!.photoURL,
            displayName: user!.displayName,
            uid: user!.uid,
        });
        batch.set(usernameReference, { uid: user!.uid});

        const committed: Promise<void> = batch.commit();

        toast.promise(committed, {
            loading: 'Creating account...',
            success: 'Nice!',
            error: 'Something went wrong 😭'
        });
    }

    function onChange(event: { target: { value: string; }; }): void {
        const usernameValue: string = event.target.value.toLowerCase();
        const usernameRegex: RegExp = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (usernameValue.length < 3) {
            setFormValue(usernameValue);
            setLoading(false);
            setIsValid(false);
        }

        if (usernameRegex.test(usernameValue)) {
            setFormValue(usernameValue);
            setLoading(true);
            setIsValid(false);
        }
    }

    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (username.length >= 3) {
                const ref = doc(firestore, 'usernames', username);
                const exists = (await getDoc(ref)).exists();
                console.log('Firestore read executed!');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    )

    useEffect(() => {
        checkUsername(formValue)
    }, [checkUsername, formValue])

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  }