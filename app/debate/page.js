"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from './page.module.css';
import {
    getCrossExPrompt,
    getACPrompt,
    getNCPrompt,
    getCrossExResponsePrompt,
    getNRPrompt,
    getFirstARPrompt,
    getSecondARPrompt,
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
  const [noteExpanded, setNoteExpanded] = useState(false);

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

    else if (currentStage === "ai_nc") { // user JUST responded to cross exam --> ai provides negative constructive
        addMessage("user", `Cross-Response:\n${userInput || "..."}`);

        const ai_neg_constructive = await generateAI(
            getNCPrompt(topic, userInput || "...", messages, division)
        );

        addMessage("ai mate", `Negative Constructive:\n${ai_neg_constructive}`);

        setStage("user_aff_cross");
    }
    
    else if (currentStage === "user_aff_cross"){
      addMessage("user", `Cross-Ex:\n${userInput}`); 

      const ai_cross_response = await generateAI(
        getCrossExResponsePrompt(topic, userInput, messages, division)
      ); 

      addMessage("ai mate", `Cross-Response:\n${ai_cross_response}`);

      setStage("user_1ar");
    }

    else if (currentStage === "user_1ar"){
      addMessage("user", `First Aff Rebuttal\n${userInput}`);

      setStage("ai_nr"); 
    }

    else if (currentStage === "ai_nr"){
      const ai_neg_rebuttal = await generateAI(
        getNRPrompt(topic, messages, division)
      );

      addMessage("ai mate", `Negative Rebuttal:\n${ai_neg_rebuttal}`);

      setStage("user_2ar");
    }

    else if (currentStage === "user_2ar"){
      addMessage("user", `Second Aff Rebuttal\n${userInput}`);

      setStage("judge");
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

        const ai_cross_exam = await generateAI(
            getCrossExPrompt(topic, userInput || "...", messages, division)
        );

        addMessage("ai mate", `Cross-Exam:\n${ai_cross_exam}`);

        setStage("ai_cross");
    }

    else if (currentStage == "ai_cross") {
      addMessage("user", `Cross-Response:\n${userInput || "..."}`);

      setStage("ai_1ar");
    }

    else if (currentStage == "ai_1ar"){
      const ai_1aff_rebuttal = await generateAI(
        getFirstARPrompt(topic, messages, division) //TODO
      );

      addMessage("ai mate", `First Aff Rebuttal:\n${ai_1aff_rebuttal}`);

      setStage("user_nr")
    }

    else if (currentStage == "user_nr") {
      addMessage("user", `Negative Rebuttal:\n${userInput || "..."}`);

      setStage("ai_2ar");
    }

    else if (currentStage == "ai_2ar"){
      const ai_2aff_rebuttal = await generateAI(
        getSecondARPrompt(topic, messages, division) //TODO
      );

      addMessage("ai mate", `Second Aff Rebuttal:\n${ai_2aff_rebuttal}`);

      setStage("judge")
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
    if (stage === "ai_ac" || stage === "ai_nr" || stage === "ai_1ar" || stage === "ai_2ar" || stage === "judge") {
      runDebate(stage);
    }
  },[stage, topic]);

  const getMessageClass = (role) => {
    if (role === "user") return styles.messageUser;
    if (role === "judge") return styles.messageJudge;
    return styles.messageAI;
  };

  const getStageNote = (currentStage) => {
    switch (currentStage) {
      case "user_ac":
        return "Define the resolution and present your case for the Affirmative. Be sure to state your value(s) and criterion. Include cited evidence, reasoning, and structure your case clearly.";
      case "user_nc":
        return "Accept or reject the Affirmative's defintion of the resolution. Refute the Affirmative's case by addressing their claims and offer the Negative case against the resolution. Include cited evidence, reasoning, and structure your case clearly.";
      case "ai_nc":
      case "ai_cross":
        return "Respond to the AI's cross-examination questions. Be direct and provide clear, concise answers.";
      case "user_neg_cross":
      case "user_aff_cross":
        return "Ask questions to challenge the opponent's case. Focus on weaknesses in their evidence or reasoning. Take note of any concessions made by the opponent during this time.";
      case "user_1ar":
        return "Address the negative's constructive and respond to their cross-examination. Strengthen your case, but do NOT introduce new evidence.";
      case "user_2ar":
        return "Address all remaining issues and summarize why you win the debate. Provide clear reasons to why the judge should vote Affirmative.";
      case "user_nr":
        return "Respond to the affirmative's first rebuttal and address any new arguments. Provide clear reasons to why the judge should vote Negative. Do NOT bring in new evidence.";
      default:
        return "";
    }
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
                : stage === "user_neg_cross" || stage ==="user_aff_cross" || stage == "ai_cross"
                ? "Cross Examination"
                : stage === "user_1ar" || stage === "ai_1ar"
                ? "First Aff Rebuttal"
                : stage === "ai_nr" || stage === "user_nr"
                ? "Negative Rebuttal"
                : stage === "user_2ar" || stage === "ai_2ar"
                ? "Second Aff Rebuttal"
                : stage === "judge"
                ? "Judging"
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
                : stage === "ai_nc" || stage === "ai_cross"
                ? "Enter your cross examination response..."
                : stage === "user_neg_cross" || stage === "user_aff_cross"
                ? "Enter your cross examination questions..."
                : stage === "user_1ar"
                ? "Enter your first rebuttal..."
                : stage === "user_2ar"
                ? "Enter your second rebuttal..."
                : stage === "user_nr"
                ? "Enter your rebuttal..."
                : "..."
              }
            />
            <div 
              className={`${styles.stageNote} ${noteExpanded ? styles.stageNoteExpanded : styles.stageNoteCollapsed}`}
              onClick={() => setNoteExpanded(!noteExpanded)}
            >
              <div className={styles.stageNoteHeader}>
                <span>💡 Need Help?</span>
                <span className={styles.expandIcon}>▼</span>
              </div>
              {noteExpanded && (
                <div className={styles.stageNoteContent}>
                  {getStageNote(stage)}
                </div>
              )}
            </div>
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
            <h2 className={styles.endStateTitle}>Debate Finished!</h2>
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