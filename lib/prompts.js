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
    - Ask 2–3 sharp, strategic questions
    - Focus on exposing weaknesses in logic, definitions, or evidence
    - Do NOT make arguments — only ask questions
    - Keep questions short and direct

    Sample Format:
    1. Question 1
    2. Question 2
    3. (Optional) Question 3

    Be concise and precise.
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
    - Include reasoning and supporting cited evidence for each counterargument
    - Use examples, real-world situations, or widely accepted facts
    - Do not make up fake statistics

    Sample Format:
    1. Accept or deny definitions. Provide own defnitions if necesarry
    2. Refutation of the affirmative's strongest point
    3. Counterargument 1 with evidence and citation if needed
    4. Counterargument 2 with evidence and citation if needed

    Be concise, persuasive, and well-structured.
    Keep it around 120–150 words.
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
    - Take a strong stance supporting it
    - Present 2–3 structured arguments
    - Each argument should include reasoning, examples, and cited evidence
    - Do NOT make up fake statistics

    Sample Format:
    1. Definition / framing
    2. Contention 1 (with reasoning + evidence + citation)
    3. Contention 2 (with reasoning + evidence + citation)
    4. (Optional) Contention 3

    Be concise, persuasive, and well-structured.
    Keep it around 120–150 words.
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
    1. Answer to Question 1 (if present)
    2. Answer to Question 2 (if present)
    3. (Optional) Answer to Question 3 (if present)

    Do NOT ask Cross Examination questions of your own at this time. 
    
    Keep responses short and focused.
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

    Strengths of the Negative:
    - ...
    - ...

    Areas for Improvement:
    - Affirmative: ...
    - Negative: ...

    Keep the feedback concise around 150-200 words and easy to read.
    `;

}