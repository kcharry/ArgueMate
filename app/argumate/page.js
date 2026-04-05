"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const [division, setDivision] = useState("Novice");
  const [side, setSide] = useState("Random");

  function startDebate() {
    router.push(`/debate?division=${division}&side=${side}`);
  }


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>ArgueMate ⚔️</h1>
        <p className={styles.subtitle}>Master the art of IPDA debate. Choose your division and position to begin.</p>

        <form className={styles.form}>
          <div className={styles.selectGroup}>
            <label htmlFor="division" className={styles.label}>Division</label>
            <select 
              id="division"
              className={styles.select}
              onChange={(e) => setDivision(e.target.value)}
              defaultValue="novice"
            >
              <option value="Novice">Novice</option>
              <option value="Junior">Junior</option>
              <option value="Open">Open</option>
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label htmlFor="side" className={styles.label}>Position</label>
            <select 
              id="side"
              className={styles.select}
              onChange={(e) => setSide(e.target.value)}
              defaultValue="Random"
            >
              <option value="Random">Random</option>
              <option value="Affirmative">Affirmative</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
        </form>

        <button className={styles.button} onClick={startDebate}>
          Start Debate
        </button>

      </div>
    </div>
  );
}