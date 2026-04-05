import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "No prompt provided" }),
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      
      config: {
        thinkingConfig: {
          thinkingBudget: 8000, 
        }
      },

      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // extract text safely
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return new Response(
      JSON.stringify({ output: text }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Gemini error:", error);

    return new Response(
      JSON.stringify({ error: "AI generation failed" }),
      { status: 500 }
    );
  }
}