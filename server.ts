import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get GoogleGenAI client (either with server key or custom client key)
function getGenAIClient(clientKey?: string) {
  const apiKey = clientKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Core Gemini AI endpoint for general text / explanatory chat
app.post("/api/gemini/chat", async (req, res): Promise<any> => {
  const { prompt, history, systemInstruction, customApiKey, model } = req.body;
  const selectedModel = model || "gemini-3.5-flash";

  try {
    const ai = getGenAIClient(customApiKey);

    // Format history if present
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    // Append the current prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "You are a friendly, encouraging English tutor for a 8-year-old child in Grade 3 in Vietnam. Keep explanations simple, use simple words, and use Vietnamese/English supportively.",
        temperature: 0.7,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return res.status(400).json({
        success: false,
        error: "Chưa cấu hình API Key. Vui lòng thêm API Key trong phần Cài đặt ở phía trên!",
      });
    }
    res.status(500).json({ success: false, error: error.message || "Đã xảy ra lỗi khi gọi Gemini API." });
  }
});

// 2. Gemini AI endpoint to generate specific quiz questions for Grade 3 (A2 Level)
app.post("/api/gemini/generate-quiz", async (req, res): Promise<any> => {
  const { topic, difficulty, count = 3, customApiKey, model } = req.body;
  const selectedModel = model || "gemini-3.5-flash";

  const systemInstruction = `You are a teacher specialized in Grade 3 English (A2 Level) for primary school students in Vietnam. 
Generate fun, engaging and child-appropriate vocabulary questions about the requested topic: ${topic}.
The generated questions MUST match the specified difficulty (${difficulty}).
Provide matching pairs, word puzzles, gap-filling exercises, or trivia clues.
Keep the language extremely encouraging, friendly, and correct. Use Vietnamese for explanations/translations.`;

  const prompt = `Generate exactly ${count} English vocabulary questions for Grade 3 (A2 level) on the topic: "${topic}".
Difficulty level: "${difficulty}".
You must return a raw JSON array of objects fitting this structure:
[
  {
    "content": "A direct question, a sentence with a missing word shown as ___ or a descriptive clue to guess.",
    "type": "matching" or "gap-filling" or "guess-word",
    "correctAnswer": "The correct option or target word. Examples: For guess-word: 'dog'. For gap-filling: 'is' or the missing letter. For matching: comma-separated pairs or single answer.",
    "options": ["Option A", "Option B", "Option C", "Option D"], // Provide 4 logical options for children (compulsory for gap-filling and matching types). Keep it simple and clear.
    "explanation": "Simple Vietnamese explanation telling why it is correct and translating the sentence/word so a 8-year-old can understand directly.",
    "difficulty": "${difficulty}",
    "clue": "An emoji or supportive hint in Vietnamese."
  }
]
Important guidelines:
- For 'gap-filling': The 'content' should contain a blank like '___'. The options should contain the correct word as one of the choices.
- For 'matching': The user matches a English word, e.g. "father", with its translation. E.g. content: "Hãy nối các từ sau với nghĩa đúng của chúng.", correctAnswer: "father: bố, mother: mẹ, brother: anh trai, sister: chị gái", options: ["bố (father)", "mẹ (mother)", "anh trai (brother)", "chị gái (sister)"]. Keep options clear and simple.
- For 'guess-word': Provide a nice clue about an animal, household item, family member etc. E.g., Content: "I have four legs and bark 'Woof!'. What am I?", correctAnswer: "dog", clue: "🐶 Thú cưng trung thành trong nhà"
Ensure all text except English vocabulary words is written in warm, pedagogical Vietnamese suitable for a 3rd grader.`;

  try {
    const ai = getGenAIClient(customApiKey);

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING, description: "Question content/clue/blank sentence" },
              type: { type: Type.STRING, description: "Type of game: matching, gap-filling, guess-word" },
              correctAnswer: { type: Type.STRING, description: "Exactly correct answer" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of options for multi-choice"
              },
              explanation: { type: Type.STRING, description: "Child-friendly Vietnamese explanation" },
              difficulty: { type: Type.STRING, description: "easy/medium/hard" },
              clue: { type: Type.STRING, description: "Emoji or simple hint" }
            },
            required: ["content", "type", "correctAnswer", "options", "explanation", "difficulty"]
          }
        }
      }
    });

    const bodyText = response.text.trim();
    const questions = JSON.parse(bodyText);
    res.json({ success: true, questions });
  } catch (error: any) {
    console.error("Gemini Quiz API Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return res.status(400).json({
        success: false,
        error: "Chưa cấu hình API Key. Vui lòng thêm API Key trong phần Cài đặt ở phía trên!",
      });
    }
    res.status(500).json({ success: false, error: error.message || "Đã xảy ra lỗi khi tạo câu hỏi với AI." });
  }
});

// Configure Vite middleware or static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted running alongside Express.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server listening on port ${PORT}`);
  });
}

setupVite();
