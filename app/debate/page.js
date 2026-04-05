"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from './page.module.css';
import {
    getCrossExPrompt,
    getACPrompt,
    getNCPrompt,
    getCrossExResponsePrompt,
    getJudgePrompt
} from "../../lib/prompts";
import { getRandomTopic } from "../../lib/topics";

export default function DebatePage() {
  const searchParams = useSearchParams();

  const division = searchParams.get("division");
  const sideChoice = searchParams.get("side");

  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [side, setSide] = useState("");
  const [stage, setStage] = useState("loading");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // helper to add messages
  function addMessage(role, text) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  // initialize debate
  useEffect(() => {
    const t = getRandomTopic();
    setTopic(t);

    let assigned = sideChoice;

    if (sideChoice === "Random") {
      assigned = Math.random() < 0.5 ? "Affirmative" : "Negative";
    }

    setSide(assigned);
    if (assigned === "Affirmative"){
        setStage("user_ac"); 
    } else if (assigned === "Negative") {
        setStage("ai_ac"); 
    }
    
  }, [sideChoice]);

  // call Gemini API
  async function generateAI(prompt) {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data.output;
  }

  // main flow handler
  async function runDebate(currentStage, userInput = "") {

    // ===== USER AC, AI NC =====
    if (currentStage === "user_ac") { // user JUST inputted affirmative constructive --> ai provides cross exam
        addMessage("user", `Affirmative Constructive:\n${userInput || "..."}`);

        const ai_cross_exam = await generateAI(
            getCrossExPrompt(topic, userInput || "...", messages, division)
        );

      addMessage("ai mate", `Cross-Ex:\n${ai_cross_exam}`);

      setStage("ai_nc");
    }

    else if (currentStage == "ai_nc") { // user JUST responded to cross exam --> ai provides negative constructive
        addMessage("user", `Cross-Response:\n${userInput || "..."}`);

        const ai_neg_constructive = await generateAI(
            getNCPrompt(topic, userInput || "...", messages, division)
        );

        addMessage("ai mate", `Negative Constructive:\n${ai_neg_constructive}`);

        //setStage("judge"); // later user aff cross user_1ar
        setStage("user_aff_cross");
    }
    
    else if (currentStage == "user_aff_cross"){
      addMessage("user", `Cross-Ex:\n${userInput}`); 

      const ai_cross_response = await generateAI(
        getCrossExResponsePrompt(topic, userInput, messages, division)
      ); 

      addMessage("ai mate", `Cross-Response:\n${ai_cross_response}`);
    }

    // ===== USER NC, AI AC=====
    else if (currentStage === "ai_ac") { // ai provides the affirmative constructive
      const ai_aff_constructive = await generateAI(
        getACPrompt(topic, messages, division)
      );

      addMessage("ai mate", `Affirmative Constructive:\n${ai_aff_constructive}`);

      setStage("user_neg_cross");
    }

    else if (currentStage === "user_neg_cross") { // user provides neg cross examination --> ai responds 
        addMessage("user", `Cross-Ex:\n${userInput || "..."}`);

        const ai_cross_response = await generateAI(
            getCrossExResponsePrompt(topic, userInput, messages, division)
        ); 

        addMessage("ai mate", `Cross-Response:\n${ai_cross_response}`);
        
        setStage("user_nc");
    }

    else if (currentStage === "user_nc"){ // user provides negative constructive --> ai aff cross 
        addMessage("user", `Negative Constructive:\n${userInput || "..."}`);

        // later ai aff cross 

        setStage("judge");
    }

    else if (currentStage === "judge"){
        const judge = await generateAI(
          getJudgePrompt(topic, messages)
        );

        addMessage("judge", judge);
        setStage("done")
    }

    setInput("");
  }

    // auto-run on stage change if it's an AI-first stage
  useEffect(() => {
    if (!topic) return; // wait until topic is loaded
    if (stage === "ai_ac" || stage === "judge") {
      runDebate(stage);
    }
  },[stage, topic]);

  const getMessageClass = (role) => {
    if (role === "user") return styles.messageUser;
    if (role === "judge") return styles.messageJudge;
    return styles.messageAI;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>ArguMate ⚔️</h1>

        {/* Header Info */}
        <div className={styles.headerInfo}>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Topic</span>
              <span className={styles.infoValue}>{topic}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Division</span>
              <span className={styles.infoValue}>{division}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Your Side</span>
              <span className={styles.infoValue}>{side}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Stage</span>
              <span className={styles.infoValue}>
                {stage === "user_ac" || stage === "ai_ac"
                ? "Affirmative Constructive"
                : stage === "user_nc" || stage === "ai_nc"
                ? "Negative Constructive"
                : stage === "user_neg_cross" || stage ==="user_aff_cross"
                ? "Cross Examination"
                : stage === "judge"
                ? "Juding"
                : stage === "done"
                ? "Complete"
                :"Waiting..."
                }
              </span>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className={styles.chatContainer}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.message} ${getMessageClass(m.role)}`}>
              <div className={styles.messageRole}>{m.role}</div>
              <div className={styles.messageText}>{m.text}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        {stage !== "done" && stage !== "loading" && (
          <div className={styles.inputSection}>
            <textarea
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                stage === "user_ac"
                ? "Enter your affirmative constructive..."
                : stage === "user_nc" 
                ? "Enter your negative constructive..."
                : stage === "ai_nc"
                ? "Enter your cross response..."
                : stage === "user_neg_cross" || stage === "user_aff_cross"
                ? "Enter your cross examination questions..."
                : "..."
              }
            />
            <button
              className={styles.button}
              onClick={() => {
                runDebate(stage, input);
                setInput("");
              }}
            >
              Submit
            </button>
          </div>
        )}

        {/* End State */}
        {stage === "done" && (
          <div className={styles.endState}>
            <h2 className={styles.endStateTitle}>Debate Finished 🎉</h2>
            <button
              className={styles.button}
              onClick={() => router.push('/')}
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}