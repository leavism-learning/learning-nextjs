import Head from 'next/head';
import styles from '@/styles/Home.module.css'

export default function EnterPage({}) {
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
            </main>
        </>
    )
}