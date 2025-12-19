const express = require('express')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')
const cors = require('cors')
const Groq = require('groq-sdk')
require('dotenv').config()

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

// Enable CORS for all routes
app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json())

// ---------- INIT GROQ ----------
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// ---------- HEALTH ----------
app.get('/', (req, res) => {
  res.send('AI Backend Running')
})

/*
=====================================================
 ASK ENDPOINT (Groq-based, NOT an API wrapper)
 - Intent routing
 - Symbolic math
 - Prompt engineering
=====================================================
*/
app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    // ---------- INTENT ROUTER ----------
    // Pure math → symbolic reasoning (no LLM)
    if (/^[0-9+\-*/().\s]+$/.test(prompt)) {
      return res.json({
        answer: eval(prompt).toString(),
        engine: 'symbolic-math',
      })
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
    ]

    // ---------- GROQ INFERENCE ----------
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.3,
      max_tokens: 120,
    })

    res.json({
      answer: completion.choices[0].message.content,
      engine: 'neural-llm',
    })
  } catch (err) {
    res.status(500).json({
      error: 'Inference failed',
      details: err.message,
    })
  }
})

// ---------- PDF SUMMARIZE ENDPOINT (UNCHANGED) ----------
app.post('/summarize', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const formData = new FormData()
    formData.append('file', req.file.buffer, req.file.originalname)

    const response = await axios.post(
      'https://pdf-summarizer-service-1.onrender.com/summarize_notes',
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000,
      }
    )

    res.json(response.data)
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json(
        err.response.data || {
          error: 'Failed to summarize',
          details: err.response.statusText,
        }
      )
    } else {
      res.status(500).json({
        error: 'Failed to summarize',
        details: err.message,
      })
    }
  }
})

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`)
})
