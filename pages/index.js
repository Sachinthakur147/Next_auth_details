import Head from 'next/head';
import Link from 'next/link';
import styles from './Home.module.css'; // Create a CSS module for styling

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Home Page</title>
                <meta name="description" content="Welcome to our application" />
            </Head>
            <header className={styles.header}>
                <div className={styles.logo}>MyApp</div>
                <nav className={styles.nav}>
                    <Link href="/login">Login</Link>
                </nav>
            </header>
            <main className={styles.main}>
                <h1 className='h1'>Welcome to My Next.js App</h1>
                <p>Access the records and manage your tasks.</p>
            </main>
            <footer className={styles.footer}>
                &copy; {new Date().getFullYear()} MyApp. All rights reserved.
            </footer>
        </div>
    );
}
