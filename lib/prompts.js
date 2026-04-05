export function getCrossExPrompt(topic, userInput, messages, division) {
  const convo = messages
    ? messages.map(m => `${m.role}: ${m.text}`).join("\n")
    : "";

    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}

    The opponent just said:
    "${userInput}"

    Your task is to ask cross-examination questions.

    Requirements:
    - Ask 2 sharp, strategic questions
    - Focus on exposing weaknesses in logic, definitions, or evidence
    - Do NOT make arguments — only ask questions
    - Keep questions short and direct

    Sample Format:
    1. Question 1
    2. Question 2

    Be concise and precise.
    Talk directly to your opponent.
    `;

}

export function getNCPrompt(topic, userInput, messages, division) {
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater on the NEGATIVE. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}

    The opponent just said:
    "${userInput}"

    Your task is to deliver a Negative Constructive (NC).

    Requirements:
    - Accept or deny their definitions if any. Provide definitions if necessary
    - Refute the opponent’s main arguments
    - Point out weak assumptions or missing logic
    - Present 1–2 counterarguments
    - Each argument should include reasoning, examples, and cited evidence with proper publisher, (month/year) listed), and article/research title (if applicable)
    - Use examples, real-world situations, or widely accepted facts
    - Do not make up fake statistics

    Sample Format:
    1. Accept or deny definitions. Provide own defnitions if necesarry
    2. Refutation of the affirmative's strongest point
    3. Counterargument 1 with evidence and citation with publisher, (month/year) listed), and article/research title (if applicable)
    4. Counterargument 2 with evidence and citation with publisher, (month/year) listed), and article/research title (if applicable)
    5. (Optional) Counterargument 2 with evidence and citation publisher, (month/year) listed), and article/research title (if applicable)

    Note, do not list the citations, simply incorporate them in the flow of your answer.
    Be concise, persuasive, and well-structured.
    Keep it around 250-300 words.
    `;
}

export function getACPrompt(topic, messages, division){
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater on the AFFIRMATIVE. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}


    Your task is to deliver an Affirmative Constructive (AC).

    Requirements:
    - Clearly define the resolution
    - Define you value and criterion 
    - Take a strong stance supporting it
    - Present 2–3 structured arguments
    - Each argument should include reasoning, examples, and cited evidence with proper publisher, article/research title (if applicable) and date (month/year) listed
    - Use examples, real-world situations, or widely accepted facts
    - Do NOT make up fake statistics

    Sample Format:
    1. Definition / framing with value and criterion
    2. Contention 1 (with reasoning + evidence + citation with publisher, (month/year) listed), and article/research title (if applicable)
    3. Contention 2 (with reasoning + evidence + citation with publisher, (month/year) listed), and article/research title (if applicable)
    4. (Optional) Contention 3

    Note, do not list the citations, simply incorporate them in the flow of your answer.
    Talk directly to the judge. 
    Be concise, persuasive, and well-structured.
    Keep it around 250-300 words.
    `;
        
}

export function getCrossExResponsePrompt(topic, userInput, messages, division){
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater during cross-examination. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}

    The opponent just said:
    "${userInput}"

    Your task is to ask cross-examination questions.

    Your task is to answer each question clearly and directly.

    Requirements:
    - Answer each question individually
    - Be concise and precise
    - Defend your position logically
    - Do NOT introduce new major arguments
    - Clarify definitions or reasoning if needed

    Format: 
    1. Answer to Question 1 (if present) in 1-2 sentences or less
    2. Answer to Question 2 (if present) in 1-2 sentences or less
    3. (Optional) Answer to Question 3 (if present) in 1-2 sentences or less

    Do NOT ask Cross Examination questions of your own at this time. 
    
    Keep responses short and focused.
    Talk directly to your opponent. 
    `;
}

export function getJudgePrompt(topic, messages){
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    
    return `
    You are an experienced IPDA debate judge.

    Resolution: "${topic}"

    Debate transcript:
    ${convo}

    Your task is to evaluate the debate and determine the winner.

    Requirements:
    - Decide whether the AFFIRMATIVE or NEGATIVE wins
    - Explain which side had the stronger overall case
    - Evaluate argument strength, refutation, organization, clarity, and persuasiveness
    - Reference specific moments or arguments from the debate
    - Be fair, clear, and concise

    Format your response exactly like this:

    Winner: [AFFIRMATIVE or NEGATIVE]

    Reason for Decision:
    [2-4 sentences explaining why this side won]

    Strengths of the Affirmative:
    - ...
    - ...
    - ...

    Strengths of the Negative:
    - ...
    - ...
    - ...

    Areas for Improvement:
    - Affirmative: ... (2-4 sentences)
    - Negative: ... (2-4 sentences)

    Keep the feedback concise and easy to read.
    `;

}

export function getNRPrompt(topic, messages, division){
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater on the NEGATIVE. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}

    Your task is to deliver a Negative Rebuttal (NR).

    Requirements:
    - Summarize the main issues apposing the resolution and the affirmative case
    - Offer analysis for why the negative's interpretation is superior
    - State why the judge(s) should vote for the Negative 
    - DO NOT bring in new evidence, you can only reference previously cited evidence

    Sample Format:
    1. Summarize 
    2. Offer analysis
    3. List Final points for why the judge(s) should vote for the Negative

    Be concise, persuasive, and well-structured.
    Talk directly to the judge. 
    Keep it around 200-250 words.
    `;
}

export function getFirstARPrompt(topic, messages, division){
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater on the AFFIRMATIVE. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}

    Your task is to deliver the First Affirmative Rebuttal (1AR).

    Requirements:
    - Reestablishes and expands the Affirmative's case in light of the Negative's arguments
    - DO NOT bring in new evidence, you can only reference previously cited evidence

    Sample Format:
    1. Address negative's first contention (if present)
    2. Address negative's second contention (if present)
    3. Address negative's thurd contention (if present)
    4. Expand Affirmative's case

    Be concise, persuasive, and well-structured.
    Talk directly to the judge. 
    Keep it around 100-150 words.
    `;
}

export function getSecondARPrompt(topic, messages, division){
    let convo = messages.map(m => `${m.role}: ${m.text}`).join("\n");
    const style =
        division === "Novice"
        ? "Use simple, clear, beginner-friendly debate reasoning."
        : division === "Junior"
        ? "Use intermediate, persuasive, conversational debate reasoning."
        : "Use advanced, strategic debate reasoning."

    return `
    You are a solo ${division} IPDA debater on the AFFIRMATIVE. ${style}

    Resolution: "${topic}"

    ${convo ? `Debate so far:\n${convo}` : ""}

    Your task is to deliver the Second Affirmative Rebuttal (2AR).

    Requirements:
    - Summarizes the main issus supporting the resolution 
    - Offers analysis for why the affirmative's interpretation is superior

    Sample Format:
    1. Summarize 
    2. Offer analysis
    3. List Final points for why the judge(s) should vote for the Affirmative

    Be concise, persuasive, and well-structured.
    Talk directly to the judge. 
    Keep it around 100-150 words.
    `;
}