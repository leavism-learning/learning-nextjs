import Head from 'next/head';
import styles from '@/styles/Home.module.css'
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
            <main className={styles.main}>
                <h1>Sign up</h1>
                { user ? 
                    !username ? <UsernameForm /> : <SignOutButton /> 
                    : <SignInButton />
                }
            </main>
        </>
    )
    // return (
    //     <main>
    //       {user ? 
    //         !username ? <UsernameForm /> : <SignOutButton /> 
    //         : 
    //         <SignInButton />
    //       }
    //     </main>
    //   );
}

function SignInButton() {
    const signInWithGoogle =async () => {
        await signInWithPopup(auth, Providers.google)
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
          <img src="/google.png"></img>Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
    return null;
}