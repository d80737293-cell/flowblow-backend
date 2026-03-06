import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.get("/", (req, res) => {
  res.send("Flow Blow Gemini backend is running.");
});

app.post("/flowblow", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ reply: "Please send a message to Flow Blow." });
  }

  try {
    const result = await model.generateContent([
      {
        role: "user",
        parts: [{ text: message }]
      }
    ]);

    const reply = result.response.text();
    res.json({ reply });
  } catch (err) {
    console.error("Flow Blow Gemini error:", err);
    res.status(500).json({
      reply: "Flow Blow had trouble talking to Gemini. Try again soon."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Flow Blow Gemini backend listening on port ${PORT}`);
});
