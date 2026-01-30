import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Chat endpoint using Ollama with streaming
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Enable chunked transfer
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: [{ role: "user", content: message }],
        stream: true, // 👈 stream mode
      }),
    });

    if (!response.body) {
      throw new Error("No response body from Ollama");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      // Ollama streams NDJSON (one JSON per line)
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            res.write(data.message.content); // send text chunks to frontend
          }
        } catch (err) {
          console.error("⚠️ Failed to parse chunk:", line);
        }
      }
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error calling Ollama");
  }
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000 (Ollama Streaming)")
);
