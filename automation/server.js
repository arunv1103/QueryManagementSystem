import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: "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", 
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error calling AI");
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
