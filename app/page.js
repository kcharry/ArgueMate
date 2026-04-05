import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.header}>
            <h1 className={styles.title}>ArguMate - Master IPDA Debate</h1>
          </div>

          <nav className={styles.navTabs}>
            <Link href="#learn-more" className={styles.tab}>
              Learn More
            </Link>
            <Link href="/debate" className={styles.tabSecondary}>
              Fact CheckMate
            </Link>
            <Link href="/debate" className={styles.tabPrimary}>
              ArguMate
            </Link>
          </nav>
        </section>

        <section id="learn-more" className={styles.section}>
          <h2 className={styles.sectionTitle}>Learn More</h2>
          <div className={styles.infoBlocks}>
            <div className={styles.infoItem}>
              <h3>What is IPDA?</h3>
              <p>
                A student-centered format focused on persuasive argumentation, research, and clear communication. This section will explain the structure and scoring of IPDA.
              </p>
            </div>
            <div className={styles.infoItem}>
              <h3>What is ArguMate?</h3>
              <p>
                ArguMate is your debate companion for practice, topic generation, and argument building. Leave room here for future features and descriptions.
              </p>
            </div>
            <div className={styles.infoItem}>
              <h3>Find teams near you</h3>
              <p>
                Connect with local debate teams, tournaments, and clubs. This space is reserved for a future team-finder feature.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
