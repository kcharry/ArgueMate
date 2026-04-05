import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.page}>
        <header className={styles.topBar}>
          <div className={styles.brand}>ArgueMate</div>
          <nav className={styles.topLinks}>
            <a href="#learn-more" className={styles.topLink}>
              Learn more
            </a>
            
            <Link href="#find-teams" className={styles.topLink}>
              Find teams near you
            </Link>
          </nav>
        </header>
    

        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroGlow} />
              <h1 className={styles.heroHeadline}>Master IPDA Debate</h1>
              <p className={styles.heroSubtitle}>
                Practice and sharpen your debate skills in a fun and engaging way with AI-powered practice, topic guidance, and real-time feedback.
              </p>
              <Link href="/arguemate" className={styles.heroButton}>
                Try out ArgueMate
              </Link>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.videoHeader}>IPDA Debate Example</div>
              <div className={styles.videoWrapper}>
                <iframe
                  src="https://www.youtube.com/embed/hGsFDfYjLMM"
                  title="Debate Flow Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        <section id="learn-more" className={styles.learnMore}>
          <div className={styles.learnMoreContainer}>
            <h2 className={styles.learnMoreTitle}>Learn More</h2>

            <div className={styles.subsectionGrid}>
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>What is ArgueMate?</h3>
                <p className={styles.subsectionText}>
                  ArgueMate is an AI-powered debate partner designed to help you master <a href="http://www.ipdadebate.info/" target="_blank" rel="noopener noreferrer" className={styles.ipdaLink}>IPDA argumentation</a>. Get instant feedback on your arguments, refine your rebuttals, and build stronger cases with real-time coaching tailored to your debate style. The platform breaks down complex rounds into clear strengths and opportunities, helping you develop better structure, evidence, and delivery over every practice session. By leveraging advanced natural language processing, ArgueMate identifies subtle weaknesses in your logic and provides targeted advice to improve your overall debating prowess. Whether you're preparing for a tournament or just honing your skills, ArgueMate serves as your dedicated coach, available 24/7 to elevate your performance.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>How It Works</h3>
                <p className={styles.subsectionText}>
                  Simply start a debate round, present your arguments, and ArgueMate will analyze your logic, evidence quality, and delivery. Receive personalized suggestions, explore counter-arguments, and practice winning strategies all in one platform. Each review includes actionable insights and examples so you can build more persuasive cases with every iteration. The AI evaluates your arguments in real-time, offering immediate corrections and alternative approaches to strengthen your position. With a vast database of debate strategies and historical examples, ArgueMate ensures you learn from the best practices in competitive debating.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>What Makes It Different</h3>
                <p className={styles.subsectionText}>
                  Unlike generic debate tools, ArgueMate focuses specifically on IPDA rules and conventions. Our AI understands value frameworks, impacts, and evidence quality—giving you feedback that actually matters for competitive debate. It also supports the full debate cycle, from case building to cross-examination and final focus, so you stay prepared for real tournament formats. While other platforms offer broad advice, ArgueMate's specialized knowledge of IPDA ensures that every piece of feedback is contextually relevant and strategically sound. This targeted approach helps you avoid common pitfalls and master the nuances of IPDA debating.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Who It's For</h3>
                <p className={styles.subsectionText}>
                  Whether you're a first-time debater or a seasoned competitor, ArgueMate adapts to your skill level. Perfect for individual practice, team preparation, or coaching supplementation. It is also ideal for debate coaches looking for a reliable way to give students extra practice and structured feedback outside of scheduled meetings. Novices can start with basic exercises to build foundational skills, while experts can tackle advanced scenarios to refine their techniques. Teams can use it for collaborative practice, simulating real debates and receiving collective feedback to improve group dynamics and argumentation.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Why It Matters</h3>
                <p className={styles.subsectionText}>
                  Practice makes perfect. With ArgueMate, you can debate anytime, anywhere—without waiting for tournament seasons. Build confidence, sharpen critical thinking, and develop the skills to lead persuasive arguments. The longer you engage with the platform, the more consistent your strategy becomes, helping you win more rounds and grow as a thoughtful, effective speaker. Regular practice with ArgueMate not only improves your debating abilities but also enhances your overall communication skills, making you a more compelling speaker in academic, professional, and personal contexts. Ultimately, ArgueMate empowers you to become a master of argumentation, ready to tackle any debate with poise and precision.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

