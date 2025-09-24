import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

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

// ---------------------- SCREENSHOT UPLOAD + GPT (no Azure Blob) ----------------------
app.post("/api/upload-screenshot", upload.single("screenshot"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Convert file to Base64
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // e.g., "image/png"

    // Send screenshot directly to GPT-4 Vision
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
              {
                type: "text",
                text: "Analyze this screenshot and explain it in three levels of detail.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
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
