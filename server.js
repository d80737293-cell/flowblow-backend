import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Flow Blow backend is running.");
});

app.post("/flowblow", async (req, res) => {
  const { message, imageUrl, fileNames } = req.body || {};

  if (!message && !imageUrl && (!fileNames || fileNames.length === 0)) {
    return res.status(400).json({ reply: "Send a message, image URL, or file info to Flow Blow." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are Flow Blow, an in-depth, friendly AI assistant for a game website.
Explain clearly and step-by-step.
Be creative and helpful.
Stay safe and respectful.
If something is dangerous, illegal, or medical, say you can't help with that.
          `
        },
        {
          role: "user",
          content: `
User message: ${message || "(no text)"}
Image URL: ${imageUrl || "none"}
Attached files: ${fileNames && fileNames.length ? fileNames.join(", ") : "none"}
          `
        }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content || "Flow Blow couldn't generate a reply this time.";
    res.json({ reply });
  } catch (err) {
    console.error("Flow Blow error:", err);
    res.status(500).json({
      reply: "Flow Blow ran into an error talking to the AI model. Try again in a moment."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Flow Blow backend listening on port ${PORT}`);
});
