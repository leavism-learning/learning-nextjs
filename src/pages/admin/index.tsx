import Head from 'next/head';
import styles from '@/styles/Home.module.css'

export default function AdminPostsPage({}) {
    return (
        <>
            <Head>
                <title>Admin Page</title>
                <meta name="description" content="Sample Admin Page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>Admin page</h1>
            </main>
        </>
    )
}