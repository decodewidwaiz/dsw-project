import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();
// Enable CORS for all routes with Vercel-specific settings
app.use(cors({
  origin: "*", // Allow all origins for simplicity, but you can restrict this to your frontend domain
  credentials: true
}));
app.use(express.json());

// POST /ask endpoint
app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // ---------- INTENT ROUTER ----------
    // Pure math → symbolic reasoning (no LLM)
    if (/^[0-9+\-*/().\s]+$/.test(prompt)) {
      return res.json({
        answer: eval(prompt).toString(),
        engine: 'symbolic-math',
      });
    }

    // ---------- PROMPT ENGINEERING ----------
    const messages = [
      {
        role: 'system',
        content:
          'You are a concise technical assistant. Answer clearly in 3–5 sentences.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    // ---------- GROQ INFERENCE ----------
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.3,
      max_tokens: 120,
    });

    res.json({
      answer: completion.choices[0].message.content,
      engine: 'neural-llm',
    });
  } catch (err) {
    res.status(500).json({
      error: 'Inference failed',
      details: err.message,
    });
  }
});

export default app;