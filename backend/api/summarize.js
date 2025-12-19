import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const app = express();
// Enable CORS for all routes with Vercel-specific settings
app.use(cors({
  origin: "*", // Allow all origins for simplicity, but you can restrict this to your frontend domain
  credentials: true
}));

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// POST /summarize endpoint
app.post('/summarize', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const response = await axios.post(
      'https://pdf-summarizer-service-1.onrender.com/summarize_notes',
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json(
        err.response.data || {
          error: 'Failed to summarize',
          details: err.response.statusText,
        }
      );
    } else {
      res.status(500).json({
        error: 'Failed to summarize',
        details: err.message,
      });
    }
  }
});

export default app;