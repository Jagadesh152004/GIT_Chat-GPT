import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173",
  "https://git-chat-gpt.vercel.app/"
] 
}));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------------- CHAT ENDPOINT ----------------------
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch(process.env.AZURE_GPT4_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "No response from GPT" });
  } catch (err) {
    console.error("Azure GPT-4 Error:", err);
    res.status(500).json({ reply: "Error connecting to Azure GPT-4" });
  }
});

// ---------------------- SCREENSHOT UPLOAD + GPT (with level) ----------------------
app.post("/api/upload-screenshot", upload.single("screenshot"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Read level from frontend (default to 1)
  const level = req.body.level || 1;

  // Customize instruction based on selected level
  let instruction = "only answer or option name";
  if (level == 2) instruction =  "Give only one sentence about the answer.It must be less than 50 words";
  if (level == 3) instruction = "Give a full explanation of the answer only.No unrelated details";

  try {
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // e.g., "image/png"

    const gptResponse = await fetch(process.env.AZURE_GPT4_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an assistant that analyzes screenshots and provides insights.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: instruction },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
            ],
          },
        ],
        max_tokens: 800,
      }),
    });

    const gptData = await gptResponse.json();
    const gptReply = gptData.choices?.[0]?.message?.content || "No response from GPT";

    res.json({
      message: "Screenshot processed successfully",
      gptReply,
    });
  } catch (err) {
    console.error("GPT-4 Vision Error:", err);
    res.status(500).json({ error: "Failed to analyze screenshot" });
  }
});

// ---------------------- START SERVER ----------------------
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
