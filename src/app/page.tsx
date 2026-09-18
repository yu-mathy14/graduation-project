import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.main}>
        <h1 className={styles.title}>ホーム</h1>

        <p className={styles.message}>
          Basketball Managerへようこそ
        </p>

        <nav className={styles.nav}>
          <Link href="/teams" className={styles.navLink}>
            チーム管理
          </Link>

          <Link href="/games" className={styles.navLink}>
            試合管理
          </Link>
        </nav>
      </section>
    </main>
  );
}