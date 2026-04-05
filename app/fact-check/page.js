"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function FactCheckPage() {
  const [currentEvidence, setCurrentEvidence] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState("");
  const [guessResult, setGuessResult] = useState(null);
  const [pastEvidence, setPastEvidence] = useState([]);
  const [error, setError] = useState("");

  async function fetchEvidence() {
    setLoading(true);
    setSelectedGuess("");
    setGuessResult(null);
    setError("");

    const historyText = pastEvidence.length
      ? `Past evidence examples:\n${pastEvidence
          .map((item, index) => `${index + 1}. Evidence: "${item.evidence}" Label: ${item.label} Reason: ${item.reason}`)
          .join("\n")}`
      : "No prior evidence examples.";

    const prompt = `Generate a single piece of evidence that a debater could possibly use in an IPDA round. ${historyText} Choose Strong or Weak evidence so that both labels appear roughly equally over multiple generations. If the evidence is vague, from an untrustworthy source, outdated, unsupported, or poorly connected to the topic, label it Weak. If it is specific, relevant (published relatively recently), from a trustworthy source, and well-supported, label it Strong. Avoid generating multiple Strong entries in a row. Balance between generating obviously weak or strong pieces of evidence and ones with subtle differences. Output only valid JSON with exactly three keys: "evidence", "label", and "reason". The reason should explain why the label is correct. Example: {"evidence":"...","label":"Strong","reason":"Because it uses specific factual detail and supports a clear claim."}. Do not include any extra text or explanation.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      const raw = data.output || "";
      const parsed = parseEvidenceOutput(raw);
      setCurrentEvidence(parsed);
      setPastEvidence((prev) => [...prev, { evidence: parsed.evidence, label: parsed.label, reason: parsed.reason }]);
    } catch (err) {
      setError("Could not generate evidence. Try again.");
      setCurrentEvidence(null);
    } finally {
      setLoading(false);
    }
  }

  function parseEvidenceOutput(raw) {
    const trimmed = raw.trim();
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed?.evidence && parsed?.label) {
        return {
          evidence: parsed.evidence.trim(),
          label: parsed.label.trim(),
          reason: parsed.reason?.trim() || "",
        };
      }
    } catch (err) {
      // fallback parsing
    }

    const labelMatch = trimmed.match(/"?label"?\s*[:=]\s*"?(Strong|Weak)"?/i);
    let label = labelMatch ? labelMatch[1] : trimmed.match(/\b(Strong|Weak)\b/i)?.[1];
    label = label ? label.trim() : "Weak";
    const evidenceMatch = trimmed.match(/"?evidence"?\s*[:=]\s*"?([\s\S]+?)"?\s*(?:,|}|$)/i);
    const reasonMatch = trimmed.match(/"?reason"?\s*[:=]\s*"?([\s\S]+?)"?\s*(?:,|}|$)/i);
    const evidence = evidenceMatch
      ? evidenceMatch[1].trim()
      : trimmed.replace(/"?label"?\s*[:=]\s*"?(Strong|Weak)"?/i, "").trim();
    const reason = reasonMatch ? reasonMatch[1].trim() : "";

    return { evidence, label, reason };
  }

  function handleStart() {
    setStarted(true);
    fetchEvidence();
  }

  function handleGuess(choice) {
    if (!currentEvidence || loading || guessResult) return;
    const isCorrect = currentEvidence.label.toLowerCase() === choice.toLowerCase();
    setSelectedGuess(choice);
    setGuessResult(isCorrect ? "correct" : "incorrect");
  }

  function getOptionClass(choice) {
    let base = styles.optionButton;
    if (!selectedGuess) return base;
    if (selectedGuess !== choice) return base;
    return `${base} ${guessResult === "correct" ? styles.correct : styles.incorrect}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Fact CheckMate</h1>
          <p className={styles.pageSubtitle}>
            Guess whether each AI-generated piece of evidence is strong or weak in an IPDA round.
          </p>
        </div>
      </div>

      <details className={styles.instructionNote}>
        <summary>How to play</summary>
        <p>
          Click Start to generate a piece of evidence. Then choose whether it is Strong or Weak. If your guess is correct, the choice button turns green; if not, it turns red. Use Next evidence to continue generating new examples.
        </p>
      </details>

      <div className={styles.card}>
        {started ? (
          <>
            <div className={styles.evidenceBlock}>
              <h2 className={styles.evidenceTitle}>Evidence</h2>
              <p className={styles.evidenceText}>
                {loading ? "Generating evidence..." : currentEvidence?.evidence || "No evidence available."}
              </p>
            </div>

            <div className={styles.controlsRow}>
              <button
                className={getOptionClass("Strong")}
                onClick={() => handleGuess("Strong")}
                disabled={loading || !!guessResult}
              >
                Strong
              </button>
              <button
                className={getOptionClass("Weak")}
                onClick={() => handleGuess("Weak")}
                disabled={loading || !!guessResult}
              >
                Weak
              </button>
            </div>

            {guessResult && (
              <div className={styles.feedbackRow}>
                <div>
                  <p className={styles.feedbackText}>
                    {guessResult === "correct" ? "Correct!" : "Incorrect."} It was {currentEvidence.label} evidence.
                  </p>
                  {currentEvidence?.reason && (
                    <p className={styles.reasonText}>
                      <strong>Reason:</strong> {currentEvidence.reason}
                    </p>
                  )}
                </div>
                <button className={styles.nextButton} onClick={fetchEvidence}>
                  Next evidence
                </button>
              </div>
            )}

            {error && <p className={styles.errorText}>{error}</p>}
          </>
        ) : (
          <div className={styles.startSection}>
            <button className={styles.startButton} onClick={handleStart}>
              Start
            </button>
          </div>
        )}
      </div>

      <Link href="/" className={styles.returnHome}>
        Return home
      </Link>
    </div>
  );
}
 