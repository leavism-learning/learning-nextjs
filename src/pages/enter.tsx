import Head from 'next/head';
import Image from 'next/image';
import { auth, Providers } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function EnterPage({}) {
    const user = null;
    const username = null;

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
                { user ? 
                    !username ? <UsernameForm /> : <SignOutButton /> 
                    : <SignInButton />
                }
            </main>
        </>
    )
}

function SignInButton() {
    const signInWithGoogle =async () => {
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

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
    return null;
}